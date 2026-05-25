// ══════════════════════════════════════════════════
//  SEASONS SYSTEM
// ══════════════════════════════════════════════════

export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Season {
  id: SeasonId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  bgGradient: string;
  effects: {
    autoSnow?: boolean;
    autoRain?: boolean;
    autoLeaf?: boolean;
    windLeft?: boolean;
    windRight?: boolean;
    extraHeat?: boolean;
  };
  durationSeconds: number;
}

export const SEASONS: Season[] = [
  {
    id: 'spring',
    name: 'Semi',
    emoji: '🌸',
    description: 'Hujan ringan & tanaman tumbuh subur!',
    color: '#86efac',
    bgGradient: 'from-green-900/30 to-emerald-900/20',
    effects: { autoRain: true },
    durationSeconds: 60,
  },
  {
    id: 'summer',
    name: 'Panas',
    emoji: '☀️',
    description: 'Terik! Api menyebar lebih cepat, air menguap!',
    color: '#fde047',
    bgGradient: 'from-yellow-900/30 to-orange-900/20',
    effects: { extraHeat: true },
    durationSeconds: 60,
  },
  {
    id: 'autumn',
    name: 'Gugur',
    emoji: '🍂',
    description: 'Daun berguguran dari langit dengan angin!',
    color: '#f97316',
    bgGradient: 'from-orange-900/30 to-amber-900/20',
    effects: { autoLeaf: true, windRight: true },
    durationSeconds: 60,
  },
  {
    id: 'winter',
    name: 'Dingin',
    emoji: '❄️',
    description: 'Salju turun deras, air membeku!',
    color: '#93c5fd',
    bgGradient: 'from-blue-900/30 to-indigo-900/20',
    effects: { autoSnow: true },
    durationSeconds: 60,
  },
];

export function getNextSeason(current: SeasonId): SeasonId {
  const idx = SEASONS.findIndex(s => s.id === current);
  return SEASONS[(idx + 1) % SEASONS.length].id;
}
