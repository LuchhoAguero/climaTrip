import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, retry, throwError } from 'rxjs';
import { City, GeocodingResponse } from '../models/city.model';
import { WeatherResponse } from '../models/weather.model';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_FIELDS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day',
  'precipitation', 'rain', 'showers', 'snowfall', 'weather_code', 'cloud_cover',
  'surface_pressure', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
].join(',');

const DAILY_FIELDS = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'apparent_temperature_max', 'apparent_temperature_min',
  'precipitation_probability_max', 'wind_speed_10m_max', 'sunrise', 'sunset',
].join(',');

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  private readonly http = inject(HttpClient);

  searchCities(term: string): Observable<City[]> {
    const name = term.trim();
    if (name.length < 3) return of([]);

    const params = new HttpParams()
      .set('name', name)
      .set('count', '10')
      .set('language', 'es')
      .set('format', 'json');

    return this.http.get<GeocodingResponse>(GEOCODING_URL, { params }).pipe(
      retry({ count: 1 }),
      map((response) => response.results ?? []),
      catchError(() => throwError(() => new Error('No se pudieron consultar las ciudades. Revisá tu conexión e intentá nuevamente.'))),
    );
  }

  getWeather(latitude: number, longitude: number): Observable<WeatherResponse> {
    const params = new HttpParams()
      .set('latitude', String(latitude))
      .set('longitude', String(longitude))
      .set('current', CURRENT_FIELDS)
      .set('daily', DAILY_FIELDS)
      .set('timezone', 'auto')
      .set('forecast_days', '7');

    return this.http.get<WeatherResponse>(FORECAST_URL, { params }).pipe(
      retry({ count: 1 }),
      catchError(() => throwError(() => new Error('No se pudo consultar el clima. Revisá tu conexión e intentá nuevamente.'))),
    );
  }
}
