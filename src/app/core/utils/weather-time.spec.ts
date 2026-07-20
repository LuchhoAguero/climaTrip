import { formatWeatherTime } from './weather-time';

describe('formatWeatherTime', () => {
  it('formats API ISO-like local times as HH:mm', () => {
    expect(formatWeatherTime('2026-07-16T07:42')).toBe('07:42');
  });

  it('keeps already readable time values as HH:mm', () => {
    expect(formatWeatherTime('18:05:00')).toBe('18:05');
  });
});
