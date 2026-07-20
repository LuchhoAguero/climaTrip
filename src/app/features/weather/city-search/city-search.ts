import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City } from '../../../core/models/city.model';
import { WeatherApiService } from '../../../core/services/weather-api.service';
import {
  CitySearchFilters,
  CitySearchSort,
  filterCities,
  isMinimumPopulationValid,
  regionOptions,
} from '../../../core/utils/city-search-filter';

@Component({
  selector: 'app-city-search',
  imports: [ReactiveFormsModule],
  templateUrl: './city-search.html',
  styleUrl: './city-search.scss',
})
export class CitySearch {
  private readonly formBuilder = inject(FormBuilder);
  private readonly weatherApi = inject(WeatherApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchForm = this.formBuilder.nonNullable.group({
    term: '',
  });
  readonly filtersForm = this.formBuilder.nonNullable.group({
    country: '',
    admin1: '',
    minPopulation: ['', [Validators.min(0)]],
    sort: 'name-asc' as CitySearchSort,
  });

  readonly results = signal<City[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly searched = signal(false);
  private readonly filters = signal<CitySearchFilters>(this.filtersForm.getRawValue());

  readonly countries = computed(() =>
    [...new Set(this.results().map((city) => city.country))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    ),
  );
  readonly regions = computed(() => regionOptions(this.results(), this.filters().country));
  readonly filteredResults = computed(() => {
    const filters = this.filters();
    return isMinimumPopulationValid(filters.minPopulation)
      ? filterCities(this.results(), filters)
      : [];
  });

  constructor() {
    this.searchForm.controls.term.valueChanges
      .pipe(
        map((term) => term.trim()),
        debounceTime(500),
        distinctUntilChanged(),
        tap((term) => {
          this.error.set('');
          this.searched.set(term.length >= 3);
          if (term.length < 3) {
            this.results.set([]);
            this.loading.set(false);
          }
        }),
        filter((term) => term.length >= 3),
        tap(() => this.loading.set(true)),
        switchMap((term) =>
          this.weatherApi.searchCities(term).pipe(
            catchError((error: Error) => {
              this.error.set(error.message);
              return of<City[]>([]);
            }),
            finalize(() => this.loading.set(false)),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cities) => this.results.set(cities));

    this.filtersForm.controls.country.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((country) => {
        const currentRegion = this.filtersForm.controls.admin1.value;
        if (currentRegion && !regionOptions(this.results(), country).includes(currentRegion)) {
          this.filtersForm.controls.admin1.setValue('');
        }
      });

    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filters.set(this.filtersForm.getRawValue()));
  }

  clearSearch(): void {
    this.searchForm.controls.term.setValue('');
    this.results.set([]);
    this.searched.set(false);
    this.error.set('');
  }

  clearFilters(): void {
    this.filtersForm.setValue({ country: '', admin1: '', minPopulation: '', sort: 'name-asc' });
  }

  viewWeather(city: City): void {
    void this.router.navigate(['/clima', city.id], {
      queryParams: {
        name: city.name,
        country: city.country,
        countryCode: city.country_code,
        admin1: city.admin1 ?? null,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone ?? null,
      },
    });
  }

  populationLabel(population?: number): string {
    return population === undefined
      ? 'Sin dato de población'
      : new Intl.NumberFormat('es-AR').format(population);
  }
}
