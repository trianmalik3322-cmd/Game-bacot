import { useState } from 'react';
import { SEASONS, SeasonId } from '../game/seasons';
import { MapSizeId } from '../game/constants';
import { OwnedItems } from '../game/shop';

export type UITheme = {
  id: string; name: string; emoji: string;
  primary: string; secondary: string; accent: string;
  bg: string; border: string; headerBg: string; panelBg: string;
  text: string; subtext: string;
};

export const UI_THEMES: UITheme[] = [
  { id:'purple', name:'Galaxy', emoji:'🌌', primary:'#7c3aed', secondary:'#a855f7', accent:'#c084fc', bg:'#07070f', border:'#4c1d95', headerBg:'#0d0d1f', panelBg:'#0a0a18', text:'#ffffff', subtext:'#9ca3af' },
  { id:'ocean', name:'Ocean', emoji:'🌊', primary:'#0369a1', secondary:'#0ea5e9', accent:'#38bdf8', bg:'#020b14', border:'#075985', headerBg:'#041a2e', panelBg:'#031525', text:'#ffffff', subtext:'#94a3b8' },
  { id:'fire', name:'Inferno', emoji:'🔥', primary:'#b91c1c', secondary:'#ef4444', accent:'#fb923c', bg:'#0f0500', border:'#7f1d1d', headerBg:'#1c0700', panelBg:'#150500', text:'#ffffff', subtext:'#fca5a5' },
  { id:'forest', name:'Forest', emoji:'🌲', primary:'#15803d', secondary:'#22c55e', accent:'#86efac', bg:'#030f06', border:'#14532d', headerBg:'#071a0d', panelBg:'#051208', text:'#ffffff', subtext:'#86efac' },
  { id:'neon', name:'Neon', emoji:'💫', primary:'#db2777', secondary:'#ec4899', accent:'#f0abfc', bg:'#09000f', border:'#831843', headerBg:'#12001e', panelBg:'#0d0017', text:'#ffffff', subtext:'#f9a8d4' },
  { id:'gold', name:'Golden', emoji:'✨', primary:'#b45309', secondary:'#f59e0b', accent:'#fde68a', bg:'#0c0800', border:'#78350f', headerBg:'#1a1000', panelBg:'#130c00', text:'#ffffff', subtext:'#fde68a' },
];

interface SettingsModalProps {
  onClose: () => void;
  theme: UITheme; onThemeChange: (theme: UITheme) => void;
  seasonEnabled: boolean; onSeasonToggle: (v: boolean) => void;
  currentSeason: SeasonId; onSeasonChange: (s: SeasonId) => void;
  seasonSpeed: number; onSeasonSpeedChange: (v: number) => void;
  volume: number; onVolumeChange: (v: number) => void;
  soundEnabled?: boolean; onSoundToggle?: (v: boolean) => void;
  showFPS: boolean; onShowFPSToggle: (v: boolean) => void;
  particleGlow: boolean; onParticleGlowToggle: (v: boolean) => void;
  mapSizeId?: MapSizeId; onMapSizeChange?: (id: MapSizeId) => void;
  ownedMapSizes?: OwnedItems;
  hasPremium?: boolean;
  hasSuperPremium?: boolean;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)}`;
}

export default function SettingsModal({
  onClose, theme, onThemeChange,
  seasonEnabled, onSeasonToggle, currentSeason, onSeasonChange,
  seasonSpeed, onSeasonSpeedChange,
  volume, onVolumeChange,
  soundEnabled = true, onSoundToggle,
  showFPS, onShowFPSToggle,
  particleGlow, onParticleGlowToggle,
  mapSizeId, onMapSizeChange, ownedMapSizes,
}: SettingsModalProps) {
  const [tab, setTab] = useState<'ui' | 'season' | 'game' | 'map'>('ui');
  const tabs = [
    { id: 'ui' as const, label: '🎨 Tampilan' },
    { id: 'season' as const, label: '🌸 Musim' },
    { id: 'game' as const, label: '⚙️ Game' },
    { id: 'map' as const, label: '🗺️ Map' },
  ];
  const curSeason = SEASONS.find(s => s.id === currentSeason)!;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', padding:'16px' }}>
      <div style={{ background:'#0d0d1f', border:`1px solid ${theme.primary}66`, borderRadius:'20px', width:'100%', maxWidth:'480px', maxHeight:'88vh', display:'flex', flexDirection:'column', boxShadow:'0 25px 60px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`1px solid ${theme.primary}33` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'20px' }}>⚙️</span>
            <span style={{ color:'#fff', fontWeight:900, fontSize:'15px' }}>Pengaturan</span>
          </div>
          <button onClick={onClose} style={{ color:'#9ca3af', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'10px', width:'30px', height:'30px', fontSize:'15px', cursor:'pointer' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', padding:'10px 14px 0', borderBottom:`1px solid ${theme.primary}22`, overflowX:'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1, padding:'7px 4px', borderRadius:'10px 10px 0 0', border:'none', fontWeight:800, fontSize:'10px', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
                background: tab === t.id ? theme.primary : 'rgba(255,255,255,0.04)',
                color: tab === t.id ? '#fff' : '#9ca3af',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'14px', WebkitOverflowScrolling:'touch' as any }}>

          {/* ── UI TAB ── */}
          {tab === 'ui' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div>
                <p style={{ color:'#9ca3af', fontSize:'10px', fontWeight:700, textTransform:'uppercase', marginBottom:'10px', letterSpacing:'1px' }}>🎨 Warna Tema</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
                  {UI_THEMES.map(t => (
                    <button key={t.id} onClick={() => onThemeChange(t)}
                      style={{ padding:'10px 6px', borderRadius:'12px', border:`2px solid ${theme.id===t.id ? t.primary : 'rgba(255,255,255,0.08)'}`,
                        background: theme.id===t.id ? t.primary+'33' : 'rgba(255,255,255,0.04)',
                        cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
                      <span style={{ fontSize:'22px' }}>{t.emoji}</span>
                      <span style={{ color: theme.id===t.id ? t.accent : '#9ca3af', fontSize:'10px', fontWeight:800 }}>{t.name}</span>
                      <div style={{ display:'flex', gap:'3px' }}>
                        {[t.primary,t.secondary,t.accent].map((c,i) => (
                          <div key={i} style={{ width:'7px', height:'7px', borderRadius:'50%', background:c }}/>
                        ))}
                      </div>
                      {theme.id===t.id && <span style={{ color:t.accent, fontSize:'11px' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background:theme.headerBg, border:`1px solid ${theme.border}66`, borderRadius:'12px', padding:'12px' }}>
                <p style={{ color:theme.subtext, fontSize:'10px', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>Preview</p>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {['🏖️ Sand','💧 Water','🔥 Fire','🪨 Stone'].map((el,i) => (
                    <div key={i} style={{ background:theme.primary+'33', border:`1px solid ${theme.primary}66`, borderRadius:'8px', padding:'4px 10px', color:theme.accent, fontSize:'11px', fontWeight:700 }}>{el}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SEASON TAB ── */}
          {tab === 'season' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:'13px', margin:0 }}>Auto Musim</p>
                  <p style={{ color:'#9ca3af', fontSize:'10px', margin:'2px 0 0' }}>Musim berganti otomatis</p>
                </div>
                <button onClick={() => onSeasonToggle(!seasonEnabled)}
                  style={{ width:'46px', height:'24px', borderRadius:'12px', border:'none', cursor:'pointer', transition:'all 0.3s', position:'relative', background: seasonEnabled ? theme.primary : '#374151' }}>
                  <div style={{ position:'absolute', top:'3px', left: seasonEnabled ? '24px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'left 0.3s' }}/>
                </button>
              </div>
              <div style={{ background:`rgba(${hexToRgb(curSeason.color)},0.1)`, border:`1px solid ${curSeason.color}44`, borderRadius:'12px', padding:'12px' }}>
                <p style={{ color:'#9ca3af', fontSize:'10px', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>Musim Sekarang</p>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ fontSize:'28px' }}>{curSeason.emoji}</span>
                  <div>
                    <p style={{ color:curSeason.color, fontWeight:900, fontSize:'15px', margin:0 }}>{curSeason.name}</p>
                    <p style={{ color:'#9ca3af', fontSize:'10px', margin:'2px 0 0' }}>{curSeason.description}</p>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ color:'#9ca3af', fontSize:'10px', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>Pilih Musim Manual</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'6px' }}>
                  {SEASONS.map(s => (
                    <button key={s.id} onClick={() => onSeasonChange(s.id)}
                      style={{ padding:'10px', borderRadius:'12px', border:`2px solid ${currentSeason===s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
                        background: currentSeason===s.id ? `rgba(${hexToRgb(s.color)},0.15)` : 'rgba(255,255,255,0.03)',
                        cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
                      <span style={{ fontSize:'22px' }}>{s.emoji}</span>
                      <span style={{ color: currentSeason===s.id ? s.color : '#9ca3af', fontWeight:800, fontSize:'11px' }}>{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px', border:'1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color:'#fff', fontWeight:800, fontSize:'12px', margin:'0 0 8px' }}>⚡ Kecepatan Musim</p>
                <div style={{ display:'flex', gap:'5px' }}>
                  {[{l:'Lambat',v:0.5},{l:'Normal',v:1},{l:'Cepat',v:2},{l:'Super',v:4}].map(opt => (
                    <button key={opt.v} onClick={() => onSeasonSpeedChange(opt.v)}
                      style={{ flex:1, padding:'6px 3px', borderRadius:'8px', border:`1px solid ${seasonSpeed===opt.v ? theme.primary : 'rgba(255,255,255,0.1)'}`,
                        background: seasonSpeed===opt.v ? theme.primary+'44' : 'rgba(255,255,255,0.04)',
                        color: seasonSpeed===opt.v ? theme.accent : '#9ca3af', fontWeight:700, fontSize:'10px', cursor:'pointer' }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── GAME TAB ── */}
          {tab === 'game' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>

              {/* Sound toggle */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:'12px', margin:0 }}>🔊 Suara</p>
                  <p style={{ color:'#9ca3af', fontSize:'10px', margin:'2px 0 0' }}>Aktifkan/matikan efek suara</p>
                </div>
                <button onClick={() => onSoundToggle?.(!soundEnabled)}
                  style={{ width:'46px', height:'24px', borderRadius:'12px', border:'none', cursor:'pointer', transition:'all 0.3s', position:'relative', background: soundEnabled ? theme.primary : '#374151' }}>
                  <div style={{ position:'absolute', top:'3px', left: soundEnabled ? '24px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'left 0.3s' }}/>
                </button>
              </div>

              {/* Volume slider */}
              {soundEnabled && (
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                    <p style={{ color:'#fff', fontWeight:800, fontSize:'12px', margin:0 }}>🎚️ Volume</p>
                    <span style={{ color:theme.accent, fontWeight:900, fontSize:'12px' }}>{Math.round(volume * 100)}%</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.05" value={volume}
                    onChange={e => onVolumeChange(parseFloat(e.target.value))}
                    style={{ width:'100%', accentColor: theme.primary, cursor:'pointer' }}
                  />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
                    <span style={{ color:'#6b7280', fontSize:'10px' }}>🔇 0%</span>
                    <span style={{ color:'#6b7280', fontSize:'10px' }}>🔊 100%</span>
                  </div>
                </div>
              )}

              {/* Sound preview buttons */}
              {soundEnabled && (
                <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'12px', padding:'12px', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color:'#6b7280', fontSize:'10px', fontWeight:700, textTransform:'uppercase', margin:'0 0 8px' }}>Test Suara</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {[
                      { label:'🏖️ Sand', el:'sand' },
                      { label:'💧 Water', el:'water' },
                      { label:'🔥 Fire', el:'fire' },
                      { label:'💥 Boom', el:'bomb' },
                      { label:'⚡ Lightning', el:'lightning' },
                      { label:'🕳️ Void', el:'void' },
                    ].map(s => (
                      <button key={s.el}
                        onClick={() => {
                          import('../game/sounds').then(m => m.playElementSound(s.el));
                        }}
                        style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, background:theme.primary+'33', border:`1px solid ${theme.primary}55`, color:theme.accent, cursor:'pointer' }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {[
                { label:'📊 Tampilkan FPS', sub:'Lihat performa game di layar', val:showFPS, fn:onShowFPSToggle },
                { label:'✨ Particle Glow', sub:'Efek cahaya partikel (butuh GPU)', val:particleGlow, fn:onParticleGlowToggle },
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <p style={{ color:'#fff', fontWeight:800, fontSize:'12px', margin:0 }}>{item.label}</p>
                    <p style={{ color:'#9ca3af', fontSize:'10px', margin:'2px 0 0' }}>{item.sub}</p>
                  </div>
                  <button onClick={() => item.fn(!item.val)}
                    style={{ width:'46px', height:'24px', borderRadius:'12px', border:'none', cursor:'pointer', transition:'all 0.3s', position:'relative', background: item.val ? theme.primary : '#374151' }}>
                    <div style={{ position:'absolute', top:'3px', left: item.val ? '24px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'left 0.3s' }}/>
                  </button>
                </div>
              ))}
              <div style={{ background:theme.primary+'22', border:`1px solid ${theme.primary}44`, borderRadius:'12px', padding:'12px' }}>
                <p style={{ color:theme.accent, fontWeight:800, fontSize:'11px', margin:'0 0 5px' }}>💡 Info Game</p>
                <p style={{ color:'#9ca3af', fontSize:'10px', margin:0, lineHeight:1.5 }}>
                  SandBox World v3.0 — 40+ elemen, makhluk hidup, musim, shop, dan premium system!
                </p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'12px', padding:'12px', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color:'#6b7280', fontSize:'10px', fontWeight:700, textTransform:'uppercase', margin:'0 0 8px' }}>Keyboard Shortcuts</p>
                {[['Space','Play / Pause'],['C','Clear Canvas'],['S','Buka Shop']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ color:'#9ca3af', fontSize:'11px' }}>{v}</span>
                    <span style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'10px', fontWeight:700, padding:'1px 8px', borderRadius:'6px' }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MAP TAB ── */}
          {tab === 'map' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ background:theme.primary+'22', border:`1px solid ${theme.primary}44`, borderRadius:'12px', padding:'12px' }}>
                <p style={{ color:theme.accent, fontWeight:800, fontSize:'12px', margin:'0 0 5px' }}>🗺️ Ukuran Map</p>
                <p style={{ color:'#9ca3af', fontSize:'10px', lineHeight:1.5, margin:0 }}>
                  Beli ukuran map di Shop untuk unlock. Kamu bisa balik ke ukuran lebih kecil kapanpun di sini!
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {[
                  {
                    id:'normal' as MapSizeId, emoji:'📱', name:'Normal',
                    desc:'Ukuran default — ringan & cepat di semua HP',
                    shopId: null, badge: null, badgeColor:'',
                    borderColor: '#4ade80', glowColor:'rgba(74,222,128,0.15)',
                  },
                  {
                    id:'large' as MapSizeId, emoji:'🌏', name:'Besar (1.5x)',
                    desc:'Perlu item "Besarkan Map" dari Shop 🛍️',
                    shopId:'map_large', badge:'👑 Premium', badgeColor:'#fbbf24',
                    borderColor:'#fbbf24', glowColor:'rgba(251,191,36,0.15)',
                  },
                  {
                    id:'super' as MapSizeId, emoji:'🌌', name:'Super Gede (2x)',
                    desc:'Perlu item "Map Super Gede" dari Shop 🛍️',
                    shopId:'map_super', badge:'👑 Premium', badgeColor:'#fbbf24',
                    borderColor:'#a855f7', glowColor:'rgba(168,85,247,0.15)',
                  },
                  {
                    id:'superpremium' as MapSizeId, emoji:'🌠', name:'SuperPremium (5x)',
                    desc:'MEGA RAKSASA setara luas negara! Perlu SuperPremium 💎',
                    shopId:'map_superpremium', badge:'💎 SuperPremium', badgeColor:'#22d3ee',
                    borderColor:'#22d3ee', glowColor:'rgba(34,211,238,0.15)',
                  },
                ].map(opt => {
                  const isUnlocked = opt.shopId === null || (ownedMapSizes?.has(opt.shopId) ?? false);
                  const isActive = mapSizeId === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={() => isUnlocked && onMapSizeChange?.(opt.id)}
                      style={{
                        display:'flex', alignItems:'center', gap:'12px',
                        padding:'12px 14px', borderRadius:'14px', width:'100%',
                        border:`2px solid ${isActive ? opt.borderColor : isUnlocked ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
                        background: isActive ? opt.glowColor : isUnlocked ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.2)',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.45,
                        textAlign:'left', transition:'all 0.2s',
                        boxShadow: isActive ? `0 0 16px ${opt.glowColor}` : 'none',
                      }}>
                      <span style={{ fontSize:'28px' }}>{opt.emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                          <p style={{ color: isActive ? '#fff' : isUnlocked ? '#f3f4f6' : '#6b7280', fontWeight:900, fontSize:'13px', margin:0 }}>{opt.name}</p>
                          {opt.badge && (
                            <span style={{ background: opt.badgeColor+'22', border:`1px solid ${opt.badgeColor}66`, borderRadius:'6px', padding:'1px 6px', color: opt.badgeColor, fontSize:'9px', fontWeight:800 }}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p style={{ color:'#6b7280', fontSize:'10px', margin:'3px 0 0' }}>{opt.desc}</p>
                      </div>
                      {isActive && (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
                          <span style={{ color:'#4ade80', fontWeight:900, fontSize:'16px' }}>✓</span>
                          <span style={{ color:'#4ade80', fontSize:'9px', fontWeight:700 }}>AKTIF</span>
                        </div>
                      )}
                      {!isUnlocked && (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
                          <span style={{ fontSize:'18px' }}>🔒</span>
                          <span style={{ color:'#6b7280', fontSize:'9px' }}>Beli dulu</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Info tiers */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'10px', padding:'10px' }}>
                  <p style={{ color:'#fbbf24', fontWeight:800, fontSize:'11px', margin:'0 0 4px' }}>👑 Premium</p>
                  <p style={{ color:'#9ca3af', fontSize:'9px', margin:0, lineHeight:1.4 }}>Unlock Map Besar & Super Gede. Beli di Shop → Spesial</p>
                </div>
                <div style={{ background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.25)', borderRadius:'10px', padding:'10px' }}>
                  <p style={{ color:'#22d3ee', fontWeight:800, fontSize:'11px', margin:'0 0 4px' }}>💎 SuperPremium</p>
                  <p style={{ color:'#9ca3af', fontSize:'9px', margin:0, lineHeight:1.4 }}>Unlock Map SuperPremium 5x RAKSASA. Eksklusif!</p>
                </div>
              </div>

              <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'12px', padding:'12px' }}>
                <p style={{ color:'#f87171', fontWeight:800, fontSize:'11px', margin:'0 0 4px' }}>⚠️ Perhatian!</p>
                <p style={{ color:'#9ca3af', fontSize:'10px', lineHeight:1.5, margin:0 }}>
                  Mengubah ukuran map akan <span style={{ color:'#f87171', fontWeight:700 }}>menghapus canvas</span> yang ada. Screenshot dulu kalau perlu!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'10px 14px', borderTop:`1px solid ${theme.primary}22`, display:'flex', justifyContent:'flex-end' }}>
          <button onClick={onClose}
            style={{ background:theme.primary, color:'#fff', border:'none', borderRadius:'10px', padding:'9px 22px', fontWeight:800, fontSize:'12px', cursor:'pointer' }}>
            ✅ Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
