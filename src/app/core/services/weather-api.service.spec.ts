import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WeatherApiService } from './weather-api.service';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(WeatherApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('returns an empty list without calling the API for short terms', () => {
    service.searchCities('ab').subscribe((cities) => expect(cities).toEqual([]));
  });

  it('maps missing results to an empty list and sends required geocoding parameters', () => {
    service.searchCities('Mendoza').subscribe((cities) => expect(cities).toEqual([]));
    const request = httpTesting.expectOne('https://geocoding-api.open-meteo.com/v1/search?name=Mendoza&count=10&language=es&format=json');
    expect(request.request.method).toBe('GET');
    request.flush({ generationtime_ms: 1 });
  });

  it('returns a friendly error when the API fails', () => {
    service.searchCities('Mendoza').subscribe({
      error: (error: Error) => expect(error.message).toContain('No se pudieron consultar las ciudades'),
    });
    const request = httpTesting.expectOne('https://geocoding-api.open-meteo.com/v1/search?name=Mendoza&count=10&language=es&format=json');
    request.flush('Unavailable', { status: 503, statusText: 'Service unavailable' });
    const retry = httpTesting.expectOne('https://geocoding-api.open-meteo.com/v1/search?name=Mendoza&count=10&language=es&format=json');
    retry.flush('Unavailable', { status: 503, statusText: 'Service unavailable' });
  });
});
