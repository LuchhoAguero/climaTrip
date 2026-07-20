import { SavedCity } from '../models/saved-city.model';

export function nextPlannedCity(cities: SavedCity[], today = new Date()): SavedCity | null {
  const todayKey = dateKey(today);
  return (
    cities
      .filter((city) => city.status === 'planned')
      .map((city) => ({ city, plannedDate: parseDateKey(city.plannedDate) }))
      .filter(
        (entry): entry is { city: SavedCity; plannedDate: string } =>
          entry.plannedDate !== null && entry.plannedDate >= todayKey,
      )
      .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))[0]?.city ?? null
  );
}

function parseDateKey(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : value;
}

function dateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
