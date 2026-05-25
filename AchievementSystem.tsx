import { useState, useEffect, useCallback } from 'react';
import { UITheme } from './SettingsModal';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  condition: (stats: GameStats) => boolean;
  reward: number;
  secret?: boolean;
}

export interface GameStats {
  totalSpawned: number;
  points: number;
  hasPremium: boolean;
  hasSuperPremium: boolean;
  elementsUsed: Set<string>;
  canvasCleared: number;
  timePlayedSeconds: number;
  shopItemsBought: number;
  autoFarmUsed: boolean;
  seasonChanges: number;
  maxSpeed: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_block',   emoji: '🧱', title: 'Langkah Pertama',   desc: 'Spawn blok pertama!',              condition: s => s.totalSpawned >= 1,       reward: 5    },
  { id: 'hundred',       emoji: '💯', title: 'Seratus!',           desc: 'Spawn 100 blok',                   condition: s => s.totalSpawned >= 100,     reward: 10   },
  { id: 'thousand',      emoji: '🔢', title: 'Seribu!',            desc: 'Spawn 1.000 blok',                 condition: s => s.totalSpawned >= 1000,    reward: 25   },
  { id: 'tenk',          emoji: '🚀', title: 'Sepuluh Ribu!',      desc: 'Spawn 10.000 blok',                condition: s => s.totalSpawned >= 10000,   reward: 100  },
  { id: 'hundredk',      emoji: '🌟', title: 'Seratus Ribu!',      desc: 'Spawn 100.000 blok!',              condition: s => s.totalSpawned >= 100000,  reward: 500  },
  { id: 'millionaire',   emoji: '💎', title: 'Jutawan Blok!',      desc: 'Spawn 1 juta blok!',               condition: s => s.totalSpawned >= 1000000, reward: 2000 },
  { id: 'rich',          emoji: '🤑', title: 'Tajir Melintir',     desc: 'Kumpulin 1.000 poin',              condition: s => s.points >= 1000,          reward: 50   },
  { id: 'super_rich',    emoji: '💰', title: 'Sultan!',            desc: 'Kumpulin 10.000 poin',             condition: s => s.points >= 10000,         reward: 200  },
  { id: 'mega_rich',     emoji: '🏦', title: 'Konglomerat!',       desc: 'Kumpulin 100.000 poin',            condition: s => s.points >= 100000,        reward: 1000 },
  { id: 'premium',       emoji: '👑', title: 'Royalti',            desc: 'Beli Premium!',                    condition: s => s.hasPremium,              reward: 100  },
  { id: 'superpremium',  emoji: '💎', title: 'SuperPremium!',      desc: 'Beli SuperPremium!',               condition: s => s.hasSuperPremium,         reward: 500  },
  { id: 'explorer',      emoji: '🗺️', title: 'Penjelajah',        desc: 'Coba 10 elemen berbeda',           condition: s => s.elementsUsed.size >= 10, reward: 30   },
  { id: 'collector',     emoji: '🎒', title: 'Kolektor',           desc: 'Coba 25 elemen berbeda',           condition: s => s.elementsUsed.size >= 25, reward: 75   },
  { id: 'master',        emoji: '🎓', title: 'Master Elemen',      desc: 'Coba 50 elemen berbeda',           condition: s => s.elementsUsed.size >= 50, reward: 200  },
  { id: 'shopper',       emoji: '🛍️', title: 'Shopaholic',        desc: 'Beli 5 item di Shop',              condition: s => s.shopItemsBought >= 5,    reward: 30   },
  { id: 'big_shopper',   emoji: '🏪', title: 'Big Spender',        desc: 'Beli 20 item di Shop',             condition: s => s.shopItemsBought >= 20,   reward: 100  },
  { id: 'cleaner',       emoji: '🧹', title: 'Bersih-Bersih',      desc: 'Clear canvas 5x',                  condition: s => s.canvasCleared >= 5,      reward: 15   },
  { id: 'destructive',   emoji: '💥', title: 'Destruktif!',        desc: 'Clear canvas 20x',                 condition: s => s.canvasCleared >= 20,     reward: 50   },
  { id: 'speed_demon',   emoji: '⚡', title: 'Speed Demon',        desc: 'Pakai speed 5x atau lebih',        condition: s => s.maxSpeed >= 5,           reward: 40   },
  { id: 'ultra_speed',   emoji: '🚄', title: 'Ultra Speed',        desc: 'Pakai speed 10x atau lebih',       condition: s => s.maxSpeed >= 10,          reward: 100  },
  { id: 'farmer',        emoji: '🤖', title: 'Auto Farmer',        desc: 'Aktifkan Auto Farm',               condition: s => s.autoFarmUsed,            reward: 25   },
  { id: 'seasonal',      emoji: '🌸', title: 'Pengganti Musim',    desc: 'Ganti musim 4x',                   condition: s => s.seasonChanges >= 4,      reward: 30   },
  { id: 'veteran',       emoji: '🏆', title: 'Veteran',            desc: 'Main selama 30 menit',             condition: s => s.timePlayedSeconds >= 1800,reward: 150 },
  { id: 'legend',        emoji: '🌟', title: 'Legenda!',           desc: 'Main selama 2 jam',                condition: s => s.timePlayedSeconds >= 7200,reward: 500 },
  { id: 'secret_admin',  emoji: '🔐', title: '???',                desc: 'Temukan panel tersembunyi',        condition: s => s.maxSpeed >= 20,          reward: 999, secret: true },
];

interface AchievementNotif {
  id: number;
  achievement: Achievement;
}

let _notifId = 0;
void _notifId;

export function AchievementNotification({ notif, onDone }: { notif: AchievementNotif; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      border: '1px solid #6366f1',
      borderRadius: '16px',
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
      animation: 'slideInRight 0.4s ease',
      minWidth: '220px',
      maxWidth: '280px',
      position: 'relative',
      pointerEvents: 'auto',
      cursor: 'default',
    }}>
      <span style={{ fontSize: '28px', flexShrink: 0 }}>{notif.achievement.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#a5b4fc', fontSize: '9px', fontWeight: 800, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1px' }}>🏆 Achievement!</p>
        <p style={{ color: '#fff', fontSize: '12px', fontWeight: 900, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notif.achievement.title}</p>
        <p style={{ color: '#818cf8', fontSize: '10px', margin: 0 }}>{notif.achievement.desc}</p>
      </div>
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <p style={{ color: '#fde047', fontSize: '13px', fontWeight: 900, margin: 0 }}>+{notif.achievement.reward}🪙</p>
      </div>
      {/* Tombol Close — GEDE, gampang di-tap di HP */}
      <button
        onClick={(e) => { e.stopPropagation(); onDone(); }}
        onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onDone(); }}
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#ef4444',
          border: '2px solid #1e1b4b',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 900,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          zIndex: 10,
          pointerEvents: 'auto',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >✕</button>
    </div>
  );
}

export function AchievementModal({ onClose, unlockedIds, theme }: { onClose: () => void; unlockedIds: Set<string>; theme: UITheme }) {
  const [tab, setTab] = useState<'unlocked' | 'locked'>('unlocked');
  const unlocked = ACHIEVEMENTS.filter(a => unlockedIds.has(a.id) && !a.secret);
  const locked = ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id));
  const total = ACHIEVEMENTS.filter(a => !a.secret).length;
  const progress = Math.round((unlockedIds.size / total) * 100);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: '16px' }}>
      <div style={{ background: '#0d0d1f', border: `1px solid ${theme.primary}66`, borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.primary}33`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏆</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '16px', margin: 0 }}>Achievement</h2>
            <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0' }}>{unlockedIds.size}/{total} unlock • {progress}% selesai</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: '99px', transition: 'width 0.5s ease' }} />
          </div>
          <span style={{ color: theme.primary, fontWeight: 900, fontSize: '12px' }}>{progress}%</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', padding: '12px 20px 0' }}>
          {[{ id: 'unlocked', label: `✅ Unlocked (${unlocked.length})` }, { id: 'locked', label: `🔒 Locked (${locked.length})` }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, border: `1px solid ${tab === t.id ? theme.primary : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', background: tab === t.id ? `${theme.primary}33` : 'transparent', color: tab === t.id ? '#fff' : '#6b7280' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(tab === 'unlocked' ? unlocked : locked).map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: tab === 'unlocked' ? `${theme.primary}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${tab === 'unlocked' ? theme.primary + '44' : 'rgba(255,255,255,0.06)'}`, borderRadius: '14px', padding: '10px 14px' }}>
              <span style={{ fontSize: '28px', opacity: tab === 'locked' ? 0.4 : 1 }}>{a.secret && tab === 'locked' ? '❓' : a.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: tab === 'unlocked' ? '#fff' : '#6b7280', fontSize: '12px', fontWeight: 800, margin: 0 }}>{a.secret && tab === 'locked' ? '???' : a.title}</p>
                <p style={{ color: '#4b5563', fontSize: '10px', margin: '2px 0 0' }}>{a.secret && tab === 'locked' ? 'Rahasia...' : a.desc}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#fde047', fontWeight: 900, fontSize: '12px', margin: 0 }}>🪙 {a.reward}</p>
                {tab === 'unlocked' && <p style={{ color: '#4ade80', fontSize: '9px', margin: '2px 0 0' }}>✅ Selesai</p>}
              </div>
            </div>
          ))}
          {tab === 'unlocked' && unlocked.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '40px', margin: '0 0 8px' }}>🎮</p>
              <p style={{ color: '#4b5563', fontSize: '13px' }}>Belum ada achievement yang unlock!</p>
              <p style={{ color: '#374151', fontSize: '11px' }}>Main dulu yuk...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function useAchievements(onUnlock: (a: Achievement) => void) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const checkAchievements = useCallback((stats: GameStats) => {
    ACHIEVEMENTS.forEach(a => {
      if (!unlockedIds.has(a.id) && a.condition(stats)) {
        setUnlockedIds(prev => {
          if (prev.has(a.id)) return prev;
          const next = new Set(prev);
          next.add(a.id);
          return next;
        });
        onUnlock(a);
      }
    });
  }, [unlockedIds, onUnlock]);

  return { unlockedIds, checkAchievements };
}
