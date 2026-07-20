export function formatWeatherTime(value: string): string {
  const match = /T(\d{2}):(\d{2})/.exec(value);
  if (match) return `${match[1]}:${match[2]}`;

  const timeOnly = /^(\d{2}):(\d{2})/.exec(value);
  return timeOnly ? `${timeOnly[1]}:${timeOnly[2]}` : value;
}
