import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, combineLatest, finalize, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City } from '../../../core/models/city.model';
import { FeedbackMessage } from '../../../core/models/feedback.model';
import { SavedCityFormValue } from '../../../core/models/saved-city.model';
import { WeatherResponse } from '../../../core/models/weather.model';
import { AuthService } from '../../../core/services/auth.service';
import { SavedCityService } from '../../../core/services/saved-city.service';
import { WeatherApiService } from '../../../core/services/weather-api.service';
import { weatherCodeCategory, weatherCodeLabel } from '../../../core/utils/weather-code';
import { formatWeatherTime } from '../../../core/utils/weather-time';
import { SavedCityForm } from '../../../shared/components/saved-city-form/saved-city-form';

interface ForecastDay {
  date: string;
  code: number;
  max: number;
  min: number;
  precipitation: number;
  wind: number;
  sunrise: string;
  sunset: string;
}

@Component({
  selector: 'app-weather-detail',
  imports: [RouterLink, SavedCityForm],
  templateUrl: './weather-detail.html',
  styleUrl: './weather-detail.scss',
})
export class WeatherDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weatherApi = inject(WeatherApiService);
  private readonly auth = inject(AuthService);
  private readonly savedCities = inject(SavedCityService);
  private readonly destroyRef = inject(DestroyRef);

  readonly city = signal<City | null>(null);
  readonly Math = Math;
  readonly weather = signal<WeatherResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly showSaveForm = signal(false);
  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly feedback = signal<FeedbackMessage | null>(null);
  readonly user = this.auth.user;
  readonly forecast = computed<ForecastDay[]>(() => {
    const daily = this.weather()?.daily;
    if (!daily) return [];
    return daily.time.map((date, index) => ({
      date,
      code: daily.weather_code[index],
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_probability_max[index],
      wind: daily.wind_speed_10m_max[index],
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index],
    }));
  });

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        switchMap(([params, query]) => {
          const latitude = Number(query.get('latitude'));
          const longitude = Number(query.get('longitude'));
          const id = Number(params.get('cityId'));
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(id)) {
            this.error.set(
              'No se recibieron coordenadas válidas para esta ciudad. Volvé al buscador e intentá nuevamente.',
            );
            this.loading.set(false);
            return of(null);
          }

          this.city.set({
            id,
            name: query.get('name') ?? 'Ciudad seleccionada',
            country: query.get('country') ?? 'Sin país',
            country_code: query.get('countryCode') ?? '',
            admin1: query.get('admin1') ?? undefined,
            latitude,
            longitude,
            timezone: query.get('timezone') ?? undefined,
          });
          this.loading.set(true);
          this.error.set('');
          return this.weatherApi.getWeather(latitude, longitude).pipe(
            catchError((error: Error) => {
              this.error.set(error.message);
              return of(null);
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((weather) => {
        this.weather.set(weather);
        this.checkSaved();
      });

    this.auth.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.checkSaved());
  }

  weatherLabel(code: number): string {
    return weatherCodeLabel(code);
  }
  weatherCategory(code: number): string {
    return weatherCodeCategory(code);
  }
  displayDate(value: string): string {
    return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(
      new Date(`${value}T12:00:00`),
    );
  }
  displayTime(value: string): string {
    return formatWeatherTime(value);
  }

  requestSave(): void {
    if (!this.user()) {
      const returnUrl = this.router.url;
      void this.router.navigate(['/login'], { queryParams: { returnUrl } });
      return;
    }
    this.showSaveForm.set(true);
    this.feedback.set(null);
  }

  saveCity(value: SavedCityFormValue): void {
    const city = this.city();
    const user = this.user();
    if (!city || !user) return;

    this.saving.set(true);
    this.savedCities
      .createSavedCity(user.uid, {
        cityExternalId: city.id,
        name: city.name,
        country: city.country,
        countryCode: city.country_code,
        admin1: city.admin1,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        ...value,
      })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.saved.set(true);
          this.showSaveForm.set(false);
          this.feedback.set({ type: 'success', text: 'Ciudad guardada correctamente.' });
        },
        error: (error: Error) => this.feedback.set({ type: 'error', text: error.message }),
      });
  }

  closeSaveForm(): void {
    this.showSaveForm.set(false);
  }

  private checkSaved(): void {
    const city = this.city();
    const user = this.user();
    if (!city || !user) {
      this.saved.set(false);
      return;
    }
    this.savedCities
      .isCitySaved(user.uid, city.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (saved) => this.saved.set(saved),
        error: () => this.saved.set(false),
      });
  }
}
