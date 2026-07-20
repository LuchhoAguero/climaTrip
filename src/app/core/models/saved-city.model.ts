import { Timestamp } from 'firebase/firestore';

export type SavedCityStatus = 'interested' | 'planned' | 'visited';

export interface SavedCity {
  id?: string;
  userId: string;
  cityExternalId: number;
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  status: SavedCityStatus;
  notes: string;
  plannedDate: string | null;
  visitedDate: string | null;
  preferredTemperature: number | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type SavedCityFormValue = Pick<
  SavedCity,
  'status' | 'notes' | 'plannedDate' | 'visitedDate' | 'preferredTemperature'
>;

export type SavedCityUpdate = Partial<SavedCityFormValue>;
