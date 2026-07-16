import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { catchError, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SavedCity } from '../../core/models/saved-city.model';
import { AuthService } from '../../core/services/auth.service';
import { SavedCityService } from '../../core/services/saved-city.service';
import { nextPlannedCity } from '../../core/utils/saved-city-statistics';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  imports: [RouterLink],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics implements AfterViewInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly savedCities = inject(SavedCityService);
  private readonly destroyRef = inject(DestroyRef);
  private statusChart?: Chart;
  private countryChart?: Chart;
  private viewReady = false;

  @ViewChild('statusCanvas') statusCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('countryCanvas') countryCanvas?: ElementRef<HTMLCanvasElement>;

  readonly cities = signal<SavedCity[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly statusCounts = computed(() => ({
    interested: this.cities().filter((city) => city.status === 'interested').length,
    planned: this.cities().filter((city) => city.status === 'planned').length,
    visited: this.cities().filter((city) => city.status === 'visited').length,
  }));
  readonly countryCount = computed(() => new Set(this.cities().map((city) => city.country)).size);
  readonly averageTemperature = computed(() => {
    const temperatures = this.cities().flatMap((city) =>
      city.preferredTemperature === null ? [] : [city.preferredTemperature],
    );
    return temperatures.length
      ? temperatures.reduce((total, value) => total + value, 0) / temperatures.length
      : null;
  });
  readonly nextPlanned = computed(() => nextPlannedCity(this.cities()));

  constructor() {
    this.auth.user$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set('');
        }),
        switchMap((user) =>
          user
            ? this.savedCities.getSavedCities(user.uid).pipe(
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
        queueMicrotask(() => this.renderCharts());
      });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.statusChart?.destroy();
    this.countryChart?.destroy();
  }

  private renderCharts(): void {
    if (!this.viewReady || !this.statusCanvas || !this.countryCanvas) return;
    this.statusChart?.destroy();
    this.countryChart?.destroy();

    const status = this.statusCounts();
    this.statusChart = new Chart(this.statusCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Me interesa', 'Planificadas', 'Visitadas'],
        datasets: [
          {
            data: [status.interested, status.planned, status.visited],
            backgroundColor: ['#55b8ff', '#ffc84a', '#51cf66'],
            borderColor: '#132238',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#f4f8fc' } } },
      },
    });

    const countryData = [
      ...this.cities()
        .reduce((counts, city) => {
          counts.set(city.country, (counts.get(city.country) ?? 0) + 1);
          return counts;
        }, new Map<string, number>())
        .entries(),
    ]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    this.countryChart = new Chart(this.countryCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: countryData.map(([country]) => country),
        datasets: [
          {
            label: 'Ciudades',
            data: countryData.map(([, count]) => count),
            backgroundColor: '#66e0d2',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: '#9fb0c3' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#9fb0c3' },
            grid: { color: 'rgba(255,255,255,0.06)' },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }
}
