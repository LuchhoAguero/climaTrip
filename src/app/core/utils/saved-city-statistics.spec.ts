import { SavedCity } from '../models/saved-city.model';
import { nextPlannedCity } from './saved-city-statistics';

function city(name: string, status: SavedCity['status'], plannedDate: string | null): SavedCity {
  return {
    userId: 'user',
    cityExternalId: name.length,
    name,
    country: 'Argentina',
    countryCode: 'AR',
    latitude: 0,
    longitude: 0,
    status,
    notes: '',
    plannedDate,
    preferredTemperature: null,
  };
}

describe('nextPlannedCity', () => {
  const today = new Date('2026-07-16T10:00:00');

  it('ignores past dates and selects today when available', () => {
    const result = nextPlannedCity(
      [
        city('Pasada', 'planned', '2026-07-15'),
        city('Hoy', 'planned', '2026-07-16'),
        city('Futura', 'planned', '2026-07-20'),
      ],
      today,
    );
    expect(result?.name).toBe('Hoy');
  });

  it('selects the closest valid future date', () => {
    const result = nextPlannedCity(
      [city('Lejana', 'planned', '2026-08-01'), city('Cercana', 'planned', '2026-07-17')],
      today,
    );
    expect(result?.name).toBe('Cercana');
  });

  it('ignores invalid dates, missing dates and non planned cities', () => {
    const result = nextPlannedCity(
      [
        city('Invalida', 'planned', 'no-es-fecha'),
        city('Sin fecha', 'planned', null),
        city('Visitada', 'visited', '2026-07-17'),
      ],
      today,
    );
    expect(result).toBeNull();
  });
});
