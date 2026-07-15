import { Timestamp } from 'firebase/firestore';
import { SavedCity } from '../models/saved-city.model';
import { filterSavedCities } from './saved-city-filter';

const cities: SavedCity[] = [
  { id: '1', userId: 'user', cityExternalId: 1, name: 'Mendoza', country: 'Argentina', countryCode: 'AR', latitude: 0, longitude: 0, status: 'planned', notes: '', plannedDate: '2026-10-10', preferredTemperature: null, createdAt: Timestamp.fromMillis(2) },
  { id: '2', userId: 'user', cityExternalId: 2, name: 'Madrid', country: 'España', countryCode: 'ES', latitude: 0, longitude: 0, status: 'visited', notes: '', plannedDate: null, preferredTemperature: 22, createdAt: Timestamp.fromMillis(1) },
];

describe('filterSavedCities', () => {
  it('filters by name and status', () => {
    const result = filterSavedCities(cities, { term: 'men', status: 'planned', country: '', sort: 'name-asc' });
    expect(result.map((city) => city.name)).toEqual(['Mendoza']);
  });

  it('sorts cities by name descending', () => {
    const result = filterSavedCities(cities, { term: '', status: 'all', country: '', sort: 'name-desc' });
    expect(result.map((city) => city.name)).toEqual(['Mendoza', 'Madrid']);
  });
});
