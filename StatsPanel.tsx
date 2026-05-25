import { UITheme } from './SettingsModal';
import { ElementType, ELEMENTS } from '../game/constants';

interface StatsPanelProps {
  onClose: () => void;
  theme: UITheme;
  totalSpawned: number;
  points: number;
  timePlayedSeconds: number;
  elementsUsed: Set<string>;
  canvasCleared: number;
  shopItemsBought: number;
  fps: number;
  currentElement: ElementType;
  autoFarm: boolean;
  hasPremium: boolean;
  hasSuperPremium: boolean;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}j ${m}m ${s}d`;
  if (m > 0) return `${m}m ${s}d`;
  return `${s}d`;
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n.toString();
}

export default function StatsPanel({ onClose, theme, totalSpawned, points, timePlayedSeconds, elementsUsed, canvasCleared, shopItemsBought, fps, currentElement, autoFarm, hasPremium, hasSuperPremium }: StatsPanelProps) {
  const spawnsPerMin = timePlayedSeconds > 0 ? Math.round((totalSpawned / timePlayedSeconds) * 60) : 0;
  const coinsPerMin = timePlayedSeconds > 0 ? Math.round((points / timePlayedSeconds) * 60) : 0;
  const elInfo = ELEMENTS[currentElement];

  const stats = [
    { label: 'Total Spawned', value: formatNum(totalSpawned), emoji: '🧱', color: '#fbbf24' },
    { label: 'Total Poin', value: formatNum(points), emoji: '🪙', color: '#fde047' },
    { label: 'Waktu Main', value: formatTime(timePlayedSeconds), emoji: '⏱️', color: '#60a5fa' },
    { label: 'Spawn/Menit', value: formatNum(spawnsPerMin), emoji: '⚡', color: '#fb923c' },
    { label: 'Poin/Menit', value: formatNum(coinsPerMin), emoji: '📈', color: '#4ade80' },
    { label: 'Elemen Dicoba', value: `${elementsUsed.size}`, emoji: '🧪', color: '#c084fc' },
    { label: 'Canvas Cleared', value: `${canvasCleared}x`, emoji: '🗑️', color: '#f87171' },
    { label: 'Item Dibeli', value: `${shopItemsBought}`, emoji: '🛍️', color: '#fde047' },
    { label: 'FPS', value: `${fps}`, emoji: '🖥️', color: '#22d3ee' },
    { label: 'Auto Farm', value: autoFarm ? 'ON' : 'OFF', emoji: '🤖', color: autoFarm ? '#4ade80' : '#6b7280' },
    { label: 'Premium', value: hasSuperPremium ? '💎 Super' : hasPremium ? '👑 Aktif' : '❌ Belum', emoji: '✨', color: hasSuperPremium ? '#67e8f9' : hasPremium ? '#fbbf24' : '#6b7280' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: '16px' }}>
      <div style={{ background: '#0d0d1f', border: `1px solid ${theme.primary}66`, borderRadius: '20px', width: '100%', maxWidth: '420px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.primary}33`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '16px', margin: 0 }}>Statistik Game</h2>
            <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0' }}>Live stats kamu!</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Current element highlight */}
        <div style={{ margin: '12px 16px 0', background: `${theme.primary}22`, border: `1px solid ${theme.primary}44`, borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>{elInfo.emoji}</span>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '10px', margin: '0 0 2px' }}>Elemen Aktif</p>
            <p style={{ color: '#fff', fontWeight: 900, fontSize: '14px', margin: 0 }}>{elInfo.label}</p>
            <p style={{ color: '#6b7280', fontSize: '10px', margin: '2px 0 0' }}>{elInfo.description}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>{s.emoji}</span>
                <span style={{ color: '#6b7280', fontSize: '10px', fontWeight: 600 }}>{s.label}</span>
              </div>
              <span style={{ color: s.color, fontWeight: 900, fontSize: '18px', lineHeight: 1 }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div style={{ padding: '10px 16px 14px', borderTop: `1px solid rgba(255,255,255,0.06)`, textAlign: 'center' }}>
          <p style={{ color: '#374151', fontSize: '10px', margin: 0 }}>💡 Terus main untuk unlock achievement & kumpulin lebih banyak poin!</p>
        </div>
      </div>
    </div>
  );
}
