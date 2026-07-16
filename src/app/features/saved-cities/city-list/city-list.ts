import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedbackMessage } from '../../../core/models/feedback.model';
import { SavedCity, SavedCityFormValue } from '../../../core/models/saved-city.model';
import { AuthService } from '../../../core/services/auth.service';
import { SavedCityService } from '../../../core/services/saved-city.service';
import { filterSavedCities, SavedCityFilters } from '../../../core/utils/saved-city-filter';
import { SavedCityForm } from '../../../shared/components/saved-city-form/saved-city-form';

@Component({
  selector: 'app-city-list',
  imports: [ReactiveFormsModule, RouterLink, SavedCityForm],
  templateUrl: './city-list.html',
  styleUrl: './city-list.scss',
})
export class CityList {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly savedCityService = inject(SavedCityService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.auth.user;
  readonly cities = signal<SavedCity[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly feedback = signal<FeedbackMessage | null>(null);
  readonly selectedCity = signal<SavedCity | null>(null);
  readonly cityToDelete = signal<SavedCity | null>(null);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly filtersForm = this.formBuilder.nonNullable.group({
    term: '',
    status: 'all' as SavedCityFilters['status'],
    country: '',
    sort: 'newest' as SavedCityFilters['sort'],
  });
  private readonly filters = signal<SavedCityFilters>(this.filtersForm.getRawValue());
  readonly filteredCities = computed(() => filterSavedCities(this.cities(), this.filters()));
  readonly countries = computed(() =>
    [...new Set(this.cities().map((city) => city.country))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    ),
  );

  constructor() {
    this.auth.user$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set('');
        }),
        switchMap((user) =>
          user
            ? this.savedCityService.getSavedCities(user.uid).pipe(
                catchError((error: Error) => {
                  this.error.set(error.message);
                  return of<SavedCity[]>([]);
                }),
              )
            : of<SavedCity[]>([]),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cities) => {
        this.cities.set(cities);
        this.loading.set(false);
      });

    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filters.set(this.filtersForm.getRawValue()));
  }

  clearFilters(): void {
    this.filtersForm.setValue({ term: '', status: 'all', country: '', sort: 'newest' });
  }

  editCity(city: SavedCity): void {
    this.selectedCity.set(city);
    this.feedback.set(null);
  }

  saveChanges(value: SavedCityFormValue): void {
    const city = this.selectedCity();
    const user = this.user();
    if (!city?.id || !user) return;

    this.saving.set(true);
    this.savedCityService
      .updateSavedCity(user.uid, city.id, value)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.selectedCity.set(null);
          this.feedback.set({ type: 'success', text: 'Ciudad actualizada correctamente.' });
        },
        error: (error: Error) => this.feedback.set({ type: 'error', text: error.message }),
      });
  }

  confirmDelete(city: SavedCity): void {
    this.cityToDelete.set(city);
  }

  deleteCity(): void {
    const city = this.cityToDelete();
    const user = this.user();
    if (!city?.id || !user) return;

    this.deleting.set(true);
    this.savedCityService
      .deleteSavedCity(user.uid, city.id)
      .pipe(
        finalize(() => this.deleting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.cityToDelete.set(null);
          this.feedback.set({ type: 'success', text: 'Ciudad eliminada correctamente.' });
        },
        error: (error: Error) => this.feedback.set({ type: 'error', text: error.message }),
      });
  }

  viewWeather(city: SavedCity): void {
    void this.router.navigate(['/clima', city.cityExternalId], {
      queryParams: {
        name: city.name,
        country: city.country,
        countryCode: city.countryCode,
        admin1: city.admin1 ?? null,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone ?? null,
      },
    });
  }

  statusLabel(status: SavedCity['status']): string {
    return { interested: 'Me interesa', planned: 'Planificada', visited: 'Visitada' }[status];
  }

  createdLabel(city: SavedCity): string {
    return city.createdAt
      ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(city.createdAt.toDate())
      : 'Recién creada';
  }
}
