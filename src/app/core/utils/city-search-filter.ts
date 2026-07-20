import { City } from '../models/city.model';

export type CitySearchSort = 'name-asc' | 'name-desc' | 'population-desc' | 'population-asc';

export interface CitySearchFilters {
  country: string;
  admin1: string;
  minPopulation: string;
  sort: CitySearchSort;
}

export function isMinimumPopulationValid(value: string): boolean {
  if (value.trim() === '') return true;
  const population = Number(value);
  return Number.isFinite(population) && population >= 0;
}

export function regionOptions(cities: City[], country: string): string[] {
  const source = country ? cities.filter((city) => city.country === country) : cities;
  return [...new Set(source.flatMap((city) => (city.admin1 ? [city.admin1] : [])))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function filterCities(cities: City[], filters: CitySearchFilters): City[] {
  const minimumPopulationValue =
    filters.minPopulation.trim() === '' ? null : Number(filters.minPopulation);
  const minimumPopulation =
    minimumPopulationValue && minimumPopulationValue > 0 ? minimumPopulationValue : null;
  const filtered = cities.filter((city) => {
    const matchesCountry = !filters.country || city.country === filters.country;
    const matchesRegion = !filters.admin1 || city.admin1 === filters.admin1;
    const matchesPopulation =
      minimumPopulation === null ||
      (city.population !== undefined && city.population >= minimumPopulation);
    return matchesCountry && matchesRegion && matchesPopulation;
  });

  return [...filtered].sort((a, b) => compareCities(a, b, filters.sort));
}

function compareCities(a: City, b: City, sort: CitySearchSort): number {
  if (sort === 'name-asc') return a.name.localeCompare(b.name, 'es');
  if (sort === 'name-desc') return b.name.localeCompare(a.name, 'es');

  const aPopulation = a.population;
  const bPopulation = b.population;
  const aKnown = aPopulation !== undefined;
  const bKnown = bPopulation !== undefined;
  if (!aKnown && !bKnown) return a.name.localeCompare(b.name, 'es');
  if (!aKnown) return 1;
  if (!bKnown) return -1;

  const comparison = aPopulation - bPopulation;
  return sort === 'population-desc' ? -comparison : comparison;
}
