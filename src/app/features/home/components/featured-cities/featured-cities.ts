import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City } from '../../../../core/models/city.model';
import { WeatherResponse } from '../../../../core/models/weather.model';
import { WeatherApiService } from '../../../../core/services/weather-api.service';
import { weatherCodeCategory, weatherCodeLabel } from '../../../../core/utils/weather-code';

interface FeaturedCity extends City {
  timezone: string;
}

interface LiveFeaturedCity {
  city: FeaturedCity;
  weather: WeatherResponse;
}

const FEATURED_CITIES: FeaturedCity[] = [
  {
    id: 3435910,
    name: 'Buenos Aires',
    country: 'Argentina',
    country_code: 'AR',
    latitude: -34.6037,
    longitude: -58.3816,
    timezone: 'America/Argentina/Buenos_Aires',
  },
  {
    id: 2643743,
    name: 'Londres',
    country: 'Reino Unido',
    country_code: 'GB',
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: 'Europe/London',
  },
  {
    id: 3143244,
    name: 'Oslo',
    country: 'Noruega',
    country_code: 'NO',
    latitude: 59.9139,
    longitude: 10.7522,
    timezone: 'Europe/Oslo',
  },
  {
    id: 1850147,
    name: 'Tokio',
    country: 'Japón',
    country_code: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
];

@Component({
  selector: 'app-featured-cities',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './featured-cities.html',
  styleUrl: './featured-cities.scss',
})
export class FeaturedCities {
  private readonly weatherApi = inject(WeatherApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly cities = signal<LiveFeaturedCity[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    this.refreshWeather();
  }

  refreshWeather(): void {
    if (this.loading() && this.cities().length > 0) return;

    this.loading.set(true);
    this.error.set('');

    const requests = FEATURED_CITIES.map((city) =>
      this.weatherApi.getWeather(city.latitude, city.longitude).pipe(
        map((weather): LiveFeaturedCity => ({ city, weather })),
        catchError(() => of(null)),
      ),
    );

    forkJoin(requests)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((responses) => {
        const cities = responses.filter((response): response is LiveFeaturedCity => response !== null);
        this.cities.set(cities);

        if (cities.length === 0) {
          this.error.set('No pudimos obtener el clima en este momento. Probá actualizar o buscá una ciudad.');
        } else if (cities.length < FEATURED_CITIES.length) {
          this.error.set('Algunas ciudades no están disponibles en este momento.');
        }
      });
  }

  viewWeather(city: FeaturedCity): void {
    void this.router.navigate(['/clima', city.id], {
      queryParams: {
        name: city.name,
        country: city.country,
        countryCode: city.country_code,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
      },
    });
  }

  weatherLabel(code: number): string {
    return weatherCodeLabel(code);
  }

  weatherCategory(code: number): string {
    return weatherCodeCategory(code);
  }

  localTime(time: string): string {
    return time.slice(11, 16);
  }
}
