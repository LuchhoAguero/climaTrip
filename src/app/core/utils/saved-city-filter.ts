import { SavedCity } from '../models/saved-city.model';

export type SavedCitySort = 'name-asc' | 'name-desc' | 'newest' | 'oldest' | 'planned-date';

export interface SavedCityFilters {
  term: string;
  status: 'all' | SavedCity['status'];
  country: string;
  sort: SavedCitySort;
}

export function filterSavedCities(cities: SavedCity[], filters: SavedCityFilters): SavedCity[] {
  const normalizedTerm = filters.term.trim().toLocaleLowerCase('es-AR');
  const filtered = cities.filter((city) => {
    const matchesTerm = !normalizedTerm || `${city.name} ${city.country}`
      .toLocaleLowerCase('es-AR')
      .includes(normalizedTerm);
    const matchesStatus = filters.status === 'all' || city.status === filters.status;
    const matchesCountry = !filters.country || city.country === filters.country;
    return matchesTerm && matchesStatus && matchesCountry;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'name-asc') return a.name.localeCompare(b.name, 'es');
    if (filters.sort === 'name-desc') return b.name.localeCompare(a.name, 'es');
    if (filters.sort === 'planned-date') {
      const aDate = a.status === 'planned' ? a.plannedDate : null;
      const bDate = b.status === 'planned' ? b.plannedDate : null;
      return (aDate ?? '9999-12-31').localeCompare(bDate ?? '9999-12-31');
    }

    const aTime = a.createdAt?.toMillis() ?? 0;
    const bTime = b.createdAt?.toMillis() ?? 0;
    return filters.sort === 'newest' ? bTime - aTime : aTime - bTime;
  });
}
