import { useState } from 'react';
import { ElementType, ELEMENTS } from '../game/constants';
import { UITheme } from './SettingsModal';

const FARMABLE_ELEMENTS: { type: ElementType; emoji: string; label: string; coinsPerSec: string }[] = [
  { type: 'sand',      emoji: '🏖️', label: 'Sand',      coinsPerSec: '~6/s' },
  { type: 'water',     emoji: '💧', label: 'Water',     coinsPerSec: '~6/s' },
  { type: 'fire',      emoji: '🔥', label: 'Fire',      coinsPerSec: '~6/s' },
  { type: 'stone',     emoji: '🪨', label: 'Stone',     coinsPerSec: '~6/s' },
  { type: 'lava',      emoji: '🌋', label: 'Lava',      coinsPerSec: '~6/s' },
  { type: 'snow',      emoji: '❄️', label: 'Snow',      coinsPerSec: '~6/s' },
  { type: 'oil',       emoji: '🛢️', label: 'Oil',       coinsPerSec: '~6/s' },
  { type: 'plant',     emoji: '🌿', label: 'Plant',     coinsPerSec: '~6/s' },
];

const INTERVAL_OPTIONS = [
  { label: '🐢 Lambat',   value: 1000, coinsPerMin: '~30/m' },
  { label: '🚶 Normal',   value: 500,  coinsPerMin: '~60/m' },
  { label: '🏃 Cepet',    value: 250,  coinsPerMin: '~120/m' },
  { label: '⚡ Turbo',    value: 100,  coinsPerMin: '~300/m', isPremium: true },
  { label: '🚀 Max',      value: 50,   coinsPerMin: '~600/m', isSuperPremium: true },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: UITheme;
  autoFarm: boolean;
  autoFarmElement: ElementType;
  autoFarmInterval: number;
  hasPremium: boolean;
  hasSuperPremium: boolean;
  points: number;
  totalSpawned: number;
  onToggle: (v: boolean) => void;
  onElementChange: (el: ElementType) => void;
  onIntervalChange: (v: number) => void;
}

export default function AutoFarmModal({
  isOpen, onClose, theme,
  autoFarm, autoFarmElement, autoFarmInterval,
  hasPremium, hasSuperPremium,
  points, totalSpawned,
  onToggle, onElementChange, onIntervalChange,
}: Props) {
  const [tab, setTab] = useState<'farm'|'stats'>('farm');
  if (!isOpen) return null;

  const curInterval = INTERVAL_OPTIONS.find(x => x.value === autoFarmInterval) ?? INTERVAL_OPTIONS[1];
  const coinsPerMin = parseInt(curInterval.coinsPerMin) || 60;
  const coinsPerHour = coinsPerMin * 60;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', padding:'0' }}>
      <div style={{ background:'#0a0a1a', border:`2px solid ${theme.primary}66`, borderRadius:'24px 24px 0 0', width:'100%', maxWidth:'500px', maxHeight:'92vh', display:'flex', flexDirection:'column', boxShadow:`0 -20px 60px ${theme.primary}33` }}>
        
        {/* Header */}
        <div style={{ padding:'16px 20px 12px', borderBottom:`1px solid ${theme.primary}33`, background:`linear-gradient(180deg, ${theme.primary}22, transparent)` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'28px' }}>🤖</span>
              <div>
                <h2 style={{ color:'#fff', fontWeight:900, fontSize:'18px', margin:0 }}>Auto Farm</h2>
                <p style={{ color:theme.subtext, fontSize:'11px', margin:0 }}>Spawn otomatis & kumpulin coins!</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'#9ca3af', borderRadius:'10px', width:'34px', height:'34px', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>

          {/* Status bar */}
          <div style={{ marginTop:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', background: autoFarm ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', border:`1px solid ${autoFarm ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius:'12px', padding:'10px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:'10px', height:'10px', borderRadius:'50%', background: autoFarm ? '#4ade80' : '#6b7280', boxShadow: autoFarm ? '0 0 8px #4ade80' : 'none', animation: autoFarm ? 'pulse 1s infinite' : 'none' }}/>
              <span style={{ color: autoFarm ? '#4ade80' : '#9ca3af', fontWeight:800, fontSize:'13px' }}>
                {autoFarm ? '🟢 AUTO FARM AKTIF' : '⚫ AUTO FARM MATI'}
              </span>
              {autoFarm && (
                <span style={{ color:'#6b7280', fontSize:'11px' }}>
                  — {ELEMENTS[autoFarmElement]?.emoji} {ELEMENTS[autoFarmElement]?.label}
                </span>
              )}
            </div>
            <button
              onClick={() => onToggle(!autoFarm)}
              style={{ padding:'8px 18px', borderRadius:'10px', fontWeight:900, fontSize:'13px', border:'none', cursor:'pointer', transition:'all 0.2s',
                background: autoFarm ? 'rgba(239,68,68,0.8)' : 'rgba(34,197,94,0.8)',
                color:'#fff',
                boxShadow: autoFarm ? '0 0 15px rgba(239,68,68,0.4)' : '0 0 15px rgba(34,197,94,0.4)',
              }}>
              {autoFarm ? '⏹ STOP' : '▶ START'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:`1px solid ${theme.primary}22` }}>
          {(['farm','stats'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'10px', fontWeight:800, fontSize:'12px', border:'none', cursor:'pointer', transition:'all 0.2s',
                background: tab === t ? `${theme.primary}22` : 'transparent',
                color: tab === t ? theme.primary : '#6b7280',
                borderBottom: tab === t ? `2px solid ${theme.primary}` : '2px solid transparent',
              }}>
              {t === 'farm' ? '⚙️ Pengaturan' : '📊 Statistik'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
          {tab === 'farm' ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              
              {/* Element Picker */}
              <div>
                <p style={{ color:'#9ca3af', fontWeight:800, fontSize:'11px', textTransform:'uppercase', marginBottom:'10px', letterSpacing:'0.05em' }}>🎯 Pilih Elemen yang Di-Spawn</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                  {FARMABLE_ELEMENTS.map(({ type, emoji, label, coinsPerSec }) => {
                    const isSel = autoFarmElement === type;
                    return (
                      <button key={type} onClick={() => onElementChange(type)}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', padding:'10px 4px', borderRadius:'14px', border:`2px solid ${isSel ? theme.primary : 'rgba(255,255,255,0.08)'}`, cursor:'pointer', transition:'all 0.2s',
                          background: isSel ? `${theme.primary}33` : 'rgba(255,255,255,0.04)',
                        }}>
                        <span style={{ fontSize:'22px' }}>{emoji}</span>
                        <span style={{ color: isSel ? '#fff' : '#9ca3af', fontSize:'9px', fontWeight:800, textAlign:'center' }}>{label}</span>
                        <span style={{ color: isSel ? theme.primary : '#4b5563', fontSize:'9px', fontWeight:700 }}>{coinsPerSec}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speed Picker */}
              <div>
                <p style={{ color:'#9ca3af', fontWeight:800, fontSize:'11px', textTransform:'uppercase', marginBottom:'10px', letterSpacing:'0.05em' }}>⚡ Kecepatan Spawn</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {INTERVAL_OPTIONS.map(opt => {
                    const locked = (opt.isPremium && !hasPremium && !hasSuperPremium) || (opt.isSuperPremium && !hasSuperPremium);
                    const isSel = autoFarmInterval === opt.value;
                    return (
                      <button key={opt.value} onClick={() => !locked && onIntervalChange(opt.value)}
                        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:'12px', border:`1px solid ${isSel ? theme.primary : locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`, cursor: locked ? 'not-allowed' : 'pointer', transition:'all 0.2s',
                          background: isSel ? `${theme.primary}33` : locked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                          opacity: locked ? 0.5 : 1,
                        }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                          <span style={{ color: isSel ? '#fff' : '#9ca3af', fontWeight:800, fontSize:'13px' }}>{opt.label}</span>
                          {opt.isPremium && !opt.isSuperPremium && <span style={{ background:'rgba(245,158,11,0.2)', color:'#fbbf24', fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'6px' }}>👑 Premium</span>}
                          {opt.isSuperPremium && <span style={{ background:'rgba(6,182,212,0.2)', color:'#67e8f9', fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'6px' }}>💎 SuperPremium</span>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                          <span style={{ color:'#4ade80', fontWeight:900, fontSize:'12px' }}>{opt.coinsPerMin}</span>
                          {locked && <span style={{ fontSize:'14px' }}>{opt.isSuperPremium ? '💎' : '👑'}</span>}
                          
                          {isSel && <span style={{ color: theme.primary, fontSize:'14px' }}>✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info card */}
              <div style={{ background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.25)', borderRadius:'14px', padding:'12px 14px' }}>
                <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'20px' }}>💡</span>
                  <div>
                    <p style={{ color:'#fde047', fontWeight:800, fontSize:'12px', margin:'0 0 4px' }}>Cara Kerja Auto Farm</p>
                    <p style={{ color:'#d97706', fontSize:'11px', lineHeight:1.5, margin:0 }}>
                      Auto Farm otomatis spawn elemen di canvas setiap beberapa detik. Setiap 10 blok yang di-spawn = 1 koin. Makin cepet speed → makin banyak koin!
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              
              {/* Stats cards */}
              {[
                { label:'Total Coins', value: points.toLocaleString(), icon:'🪙', color:'#fde047' },
                { label:'Total Spawned', value: totalSpawned.toLocaleString(), icon:'⚗️', color:'#a78bfa' },
                { label:'Coins / Menit', value: autoFarm ? ('~' + coinsPerMin) : '-', icon:'📈', color:'#4ade80' },
                { label:'Coins / Jam', value: autoFarm ? ('~' + coinsPerHour.toLocaleString()) : '-', icon:'⏰', color:'#f97316' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ fontSize:'24px' }}>{icon}</span>
                    <span style={{ color:'#9ca3af', fontWeight:700, fontSize:'13px' }}>{label}</span>
                  </div>
                  <span style={{ color, fontWeight:900, fontSize:'18px' }}>{value}</span>
                </div>
              ))}

              {/* Progress bar */}
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ color:'#9ca3af', fontSize:'12px', fontWeight:700 }}>Progress ke 1000 coins</span>
                  <span style={{ color:'#fde047', fontWeight:900, fontSize:'12px' }}>{Math.min(points, 1000).toLocaleString()} / 1000</span>
                </div>
                <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:'99px', height:'8px', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:'99px', background:`linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, width:`${Math.min((points/1000)*100, 100)}%`, transition:'width 0.5s' }}/>
                </div>
              </div>

              {/* Farm status */}
              <div style={{ background: autoFarm ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border:`1px solid ${autoFarm ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius:'14px', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ color: autoFarm ? '#4ade80' : '#6b7280', fontWeight:800, fontSize:'13px' }}>
                  {autoFarm ? '🟢 Sedang farming...' : '⚫ Farm belum aktif'}
                </span>
                <button onClick={() => onToggle(!autoFarm)}
                  style={{ padding:'6px 14px', borderRadius:'8px', fontWeight:900, fontSize:'12px', border:'none', cursor:'pointer',
                    background: autoFarm ? 'rgba(239,68,68,0.7)' : 'rgba(34,197,94,0.7)', color:'#fff',
                  }}>
                  {autoFarm ? 'STOP' : 'START'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
