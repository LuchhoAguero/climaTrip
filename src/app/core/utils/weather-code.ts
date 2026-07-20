const WEATHER_CODES: Record<number, string> = {
  0: 'Despejado',
  1: 'Principalmente despejado',
  2: 'Parcialmente nublado',
  3: 'Cubierto',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna leve',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  56: 'Llovizna helada leve',
  57: 'Llovizna helada intensa',
  61: 'Lluvia leve',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  66: 'Lluvia helada leve',
  67: 'Lluvia helada intensa',
  71: 'Nieve leve',
  73: 'Nieve moderada',
  75: 'Nieve intensa',
  77: 'Granos de nieve',
  80: 'Chaparrones leves',
  81: 'Chaparrones moderados',
  82: 'Chaparrones intensos',
  85: 'Chaparrones de nieve leves',
  86: 'Chaparrones de nieve intensos',
  95: 'Tormenta',
  96: 'Tormenta con granizo leve',
  99: 'Tormenta con granizo intenso',
};

export function weatherCodeLabel(code: number): string {
  return WEATHER_CODES[code] ?? 'Condición meteorológica no disponible';
}

export function weatherCodeCategory(code: number): 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'rain';
}
