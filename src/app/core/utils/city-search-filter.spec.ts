import { City } from '../models/city.model';
import { filterCities, isMinimumPopulationValid, regionOptions } from './city-search-filter';

const cities: City[] = [
  {
    id: 1,
    name: 'Mendoza',
    country: 'Argentina',
    country_code: 'AR',
    admin1: 'Mendoza',
    latitude: 0,
    longitude: 0,
    population: 115041,
  },
  {
    id: 2,
    name: 'Buenos Aires',
    country: 'Argentina',
    country_code: 'AR',
    admin1: 'Buenos Aires',
    latitude: 0,
    longitude: 0,
    population: 2891082,
  },
  {
    id: 3,
    name: 'Madrid',
    country: 'España',
    country_code: 'ES',
    admin1: 'Madrid',
    latitude: 0,
    longitude: 0,
    population: 3255944,
  },
  {
    id: 4,
    name: 'Villa Nueva',
    country: 'Argentina',
    country_code: 'AR',
    admin1: 'Mendoza',
    latitude: 0,
    longitude: 0,
  },
];

describe('filterCities', () => {
  it('includes cities with known population greater than or equal to the minimum', () => {
    const result = filterCities(cities, {
      country: '',
      admin1: '',
      minPopulation: '115041',
      sort: 'name-asc',
    });
    expect(result.map((city) => city.name)).toContain('Mendoza');
  });

  it('excludes cities with known population below the minimum', () => {
    const result = filterCities(cities, {
      country: '',
      admin1: '',
      minPopulation: '200000',
      sort: 'name-asc',
    });
    expect(result.map((city) => city.name)).not.toContain('Mendoza');
  });

  it('excludes cities without population when a minimum is set', () => {
    const result = filterCities(cities, {
      country: '',
      admin1: '',
      minPopulation: '1',
      sort: 'name-asc',
    });
    expect(result.map((city) => city.name)).not.toContain('Villa Nueva');
  });

  it('keeps cities without population when the filter is empty or zero', () => {
    expect(
      filterCities(cities, { country: '', admin1: '', minPopulation: '', sort: 'name-asc' }).map(
        (city) => city.name,
      ),
    ).toContain('Villa Nueva');
    expect(
      filterCities(cities, { country: '', admin1: '', minPopulation: '0', sort: 'name-asc' }).map(
        (city) => city.name,
      ),
    ).toContain('Villa Nueva');
  });

  it('validates negative minimum populations', () => {
    expect(isMinimumPopulationValid('-1')).toBe(false);
    expect(isMinimumPopulationValid('0')).toBe(true);
    expect(isMinimumPopulationValid('')).toBe(true);
  });

  it('sorts by population with unknown values at the end in both directions', () => {
    expect(
      filterCities(cities, {
        country: '',
        admin1: '',
        minPopulation: '',
        sort: 'population-asc',
      }).map((city) => city.name),
    ).toEqual(['Mendoza', 'Buenos Aires', 'Madrid', 'Villa Nueva']);
    expect(
      filterCities(cities, {
        country: '',
        admin1: '',
        minPopulation: '',
        sort: 'population-desc',
      }).map((city) => city.name),
    ).toEqual(['Madrid', 'Buenos Aires', 'Mendoza', 'Villa Nueva']);
  });
});

describe('regionOptions', () => {
  it('returns all unique sorted regions when no country is selected', () => {
    expect(regionOptions(cities, '')).toEqual(['Buenos Aires', 'Madrid', 'Mendoza']);
  });

  it('returns unique sorted regions for the selected country only', () => {
    expect(regionOptions(cities, 'Argentina')).toEqual(['Buenos Aires', 'Mendoza']);
  });
});
