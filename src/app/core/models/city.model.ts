export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  country: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: City[];
  generationtime_ms?: number;
}
