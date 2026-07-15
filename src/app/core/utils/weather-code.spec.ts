import { weatherCodeLabel } from './weather-code';

describe('weatherCodeLabel', () => {
  it('translates known Open-Meteo codes', () => {
    expect(weatherCodeLabel(0)).toBe('Despejado');
    expect(weatherCodeLabel(95)).toBe('Tormenta');
  });

  it('uses a fallback for unknown codes', () => {
    expect(weatherCodeLabel(999)).toBe('Condición meteorológica no disponible');
  });
});
