import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City } from '../../../core/models/city.model';
import { WeatherApiService } from '../../../core/services/weather-api.service';

type SortOption = 'name-asc' | 'name-desc' | 'population-desc' | 'population-asc';

interface SearchFilters {
  country: string;
  admin1: string;
  minPopulation: string;
  sort: SortOption;
}

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
    minPopulation: '',
    sort: 'name-asc' as SortOption,
  });

  readonly results = signal<City[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly searched = signal(false);
  private readonly filters = signal<SearchFilters>(this.filtersForm.getRawValue());

  readonly countries = computed(() => [...new Set(this.results().map((city) => city.country))].sort((a, b) => a.localeCompare(b, 'es')));
  readonly regions = computed(() => [...new Set(this.results().flatMap((city) => city.admin1 ? [city.admin1] : []))].sort((a, b) => a.localeCompare(b, 'es')));
  readonly filteredResults = computed(() => this.applyFilters(this.results(), this.filters()));

  constructor() {
    this.searchForm.controls.term.valueChanges.pipe(
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
      switchMap((term) => this.weatherApi.searchCities(term).pipe(
        catchError((error: Error) => {
          this.error.set(error.message);
          return of<City[]>([]);
        }),
        finalize(() => this.loading.set(false)),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((cities) => this.results.set(cities));

    this.filtersForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => this.filters.set(this.filtersForm.getRawValue()));
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
    return population === undefined ? 'Sin dato de población' : new Intl.NumberFormat('es-AR').format(population);
  }

  private applyFilters(cities: City[], filters: SearchFilters): City[] {
    const minimumPopulation = Number(filters.minPopulation);
    const filtered = cities.filter((city) => {
      const matchesCountry = !filters.country || city.country === filters.country;
      const matchesRegion = !filters.admin1 || city.admin1 === filters.admin1;
      const matchesPopulation = !minimumPopulation || city.population === undefined || city.population >= minimumPopulation;
      return matchesCountry && matchesRegion && matchesPopulation;
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === 'name-asc') return a.name.localeCompare(b.name, 'es');
      if (filters.sort === 'name-desc') return b.name.localeCompare(a.name, 'es');
      const aPopulation = a.population ?? -1;
      const bPopulation = b.population ?? -1;
      return filters.sort === 'population-desc' ? bPopulation - aPopulation : aPopulation - bPopulation;
    });
  }
}
