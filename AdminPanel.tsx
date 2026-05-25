import { useState } from 'react';
import { UITheme } from './SettingsModal';
import { ElementType, ELEMENTS } from '../game/constants';

interface AdminPanelProps {
  onClose: () => void;
  theme: UITheme;
  points: number;
  onSetPoints: (p: number) => void;
  hasPremium: boolean;
  onSetPremium: (v: boolean) => void;
  ownedItems: Set<string>;
  onUnlockAll: () => void;
  onClearCanvas: () => void;
  onSetElement: (e: ElementType) => void;
  onSetSpeed: (s: number) => void;
  speed: number;
  totalSpawned: number;
  onSetSpawned: (n: number) => void;
  onFillCanvas: (el: ElementType) => void;
}

const ADMIN_ELEMENTS: ElementType[] = [
  'sand','water','fire','lava','stone','ice','snow','cloud','lightning',
  'antimatter','blackhole','plasma','dragonfire','tornado','virus','void',
  'rainbow','timesand','antigravity','acid','explosion','electricity',
];

function stopAll(e: React.SyntheticEvent) {
  e.stopPropagation();
}

// Numpad component — no keyboard needed!
function NumPad({ value, onChange, onConfirm, color }: {
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  color: string;
}) {
  const press = (key: string) => {
    if (key === 'C') { onChange('0'); return; }
    if (key === '⌫') { onChange(value.length > 1 ? value.slice(0, -1) : '0'); return; }
    if (key === '000') { onChange(value === '0' ? '0' : value + '000'); return; }
    if (value === '0') { onChange(key); return; }
    if (value.length >= 9) return;
    onChange(value + key);
  };

  const KEYS = [
    ['7','8','9'],
    ['4','5','6'],
    ['1','2','3'],
    ['C','0','⌫'],
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginTop:'8px' }}>
      {/* Display */}
      <div style={{
        background:'rgba(0,0,0,0.5)',
        border:`2px solid ${color}66`,
        borderRadius:'12px',
        padding:'12px 16px',
        textAlign:'right',
        fontSize:'28px',
        fontWeight:900,
        color:'#fff',
        fontFamily:'monospace',
        letterSpacing:'2px',
        boxShadow:`inset 0 0 20px ${color}22`,
      }}>
        {parseInt(value).toLocaleString()}
      </div>

      {/* Keys */}
      {KEYS.map((row, ri) => (
        <div key={ri} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px' }}>
          {row.map(key => (
            <button
              key={key}
              onPointerDown={e => { e.stopPropagation(); press(key); }}
              style={{
                padding:'16px 8px',
                borderRadius:'12px',
                fontSize: key === '⌫' || key === 'C' ? '16px' : '20px',
                fontWeight:900,
                border:`1px solid ${key === 'C' ? '#ef444466' : key === '⌫' ? '#f9731666' : color + '44'}`,
                cursor:'pointer',
                background: key === 'C' ? 'rgba(239,68,68,0.2)' : key === '⌫' ? 'rgba(249,115,22,0.2)' : `${color}22`,
                color: key === 'C' ? '#f87171' : key === '⌫' ? '#fb923c' : '#fff',
                transition:'all 0.1s',
                userSelect:'none',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* Extra row: +1K, +10K, +100K */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px' }}>
        {['000', '+1K', '+10K'].map(key => (
          <button
            key={key}
            onPointerDown={e => {
              e.stopPropagation();
              if (key === '000') press('000');
              else if (key === '+1K') onChange(String(parseInt(value) + 1000));
              else onChange(String(parseInt(value) + 10000));
            }}
            style={{
              padding:'10px 8px',
              borderRadius:'12px',
              fontSize:'13px',
              fontWeight:900,
              border:`1px solid ${color}44`,
              cursor:'pointer',
              background:`${color}33`,
              color:'#fff',
              userSelect:'none',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Confirm button */}
      <button
        onPointerDown={e => { e.stopPropagation(); onConfirm(); }}
        style={{
          padding:'14px',
          borderRadius:'12px',
          fontSize:'15px',
          fontWeight:900,
          border:'none',
          cursor:'pointer',
          background:`linear-gradient(135deg, ${color}, ${color}bb)`,
          color:'#fff',
          boxShadow:`0 4px 20px ${color}55`,
          userSelect:'none',
        }}
      >
        ✓ SET
      </button>
    </div>
  );
}

export default function AdminPanel({
  onClose, theme, points, onSetPoints, hasPremium, onSetPremium,
  ownedItems, onUnlockAll, onClearCanvas, onSetElement, onSetSpeed,
  speed, totalSpawned, onSetSpawned, onFillCanvas,
}: AdminPanelProps) {
  const [tab, setTab] = useState<'economy'|'game'|'elements'|'cheats'>('economy');
  const [pointInput, setPointInput] = useState(String(points));
  const [spawnInput, setSpawnInput] = useState(String(totalSpawned));
  const [log, setLog] = useState<string[]>(['🔐 Admin Panel Aktif!']);
  const [numpadTarget, setNumpadTarget] = useState<'points'|'spawned'>('points');
  const [showNumpad, setShowNumpad] = useState(false);

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);

  const TABS = [
    { id: 'economy', label: '💰' },
    { id: 'game',    label: '🎮' },
    { id: 'elements',label: '⚗️' },
    { id: 'cheats',  label: '🎯' },
  ] as const;

  const panelBg = '#0a0a1a';
  const border = theme.primary + '55';
  const cardBg = 'rgba(255,255,255,0.04)';
  const textColor = '#e2e8f0';
  const subText = '#94a3b8';

  function Btn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
    return (
      <button
        onPointerDown={e => { e.stopPropagation(); onClick(); }}
        style={{ padding:'8px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:800, border:'none', cursor:'pointer', background:color, color:'#fff', userSelect:'none' }}
      >
        {label}
      </button>
    );
  }

  const currentNumpadValue = numpadTarget === 'points' ? pointInput : spawnInput;
  const setCurrentNumpadValue = numpadTarget === 'points' ? setPointInput : setSpawnInput;

  const handleNumpadConfirm = () => {
    const v = parseInt(currentNumpadValue) || 0;
    if (numpadTarget === 'points') {
      onSetPoints(v);
      addLog(`💰 Set points ke ${v.toLocaleString()}`);
    } else {
      onSetSpawned(v);
      addLog(`🎯 Set spawned ke ${v.toLocaleString()}`);
    }
    setShowNumpad(false);
  };

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', padding:'12px' }}
      onPointerDown={stopAll}
      onTouchStart={stopAll}
      onTouchEnd={stopAll}
      onTouchMove={stopAll}
      onClick={stopAll}
    >
      <div style={{ background:panelBg, border:`2px solid ${theme.primary}88`, borderRadius:'20px', width:'100%', maxWidth:'440px', maxHeight:'94vh', display:'flex', flexDirection:'column', boxShadow:`0 0 60px ${theme.primary}44, 0 25px 60px rgba(0,0,0,0.9)` }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${border}`, background:`linear-gradient(135deg, ${theme.primary}22, ${theme.accent}11)`, borderRadius:'18px 18px 0 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', boxShadow:`0 0 20px ${theme.primary}66` }}>
              ⚡
            </div>
            <div>
              <h2 style={{ color:'#fff', fontWeight:900, fontSize:'16px', margin:0 }}>Admin Panel</h2>
              <p style={{ color:subText, fontSize:'10px', margin:0 }}>🔐 God Mode Aktif</p>
            </div>
          </div>
          <button onPointerDown={e => { e.stopPropagation(); onClose(); }} style={{ color:subText, background:'rgba(255,255,255,0.08)', border:'none', borderRadius:'8px', width:'32px', height:'32px', fontSize:'16px', cursor:'pointer' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', padding:'10px 12px', borderBottom:`1px solid ${border}` }}>
          {TABS.map(t => (
            <button key={t.id}
              onPointerDown={e => { e.stopPropagation(); setTab(t.id); setShowNumpad(false); }}
              style={{ flex:1, padding:'10px 4px', borderRadius:'10px', fontSize:'18px', fontWeight:800, border:'none', cursor:'pointer', transition:'all 0.2s',
                background: tab === t.id ? theme.primary : 'rgba(255,255,255,0.05)',
                color: tab === t.id ? '#fff' : subText,
                boxShadow: tab === t.id ? `0 0 12px ${theme.primary}66` : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:'8px' }}>

          {/* ECONOMY TAB */}
          {tab === 'economy' && !showNumpad && (
            <>
              <p style={{ color:theme.primary, fontWeight:900, fontSize:'11px', textTransform:'uppercase', margin:'0 0 4px' }}>💰 Kelola Points</p>

              {/* Points display card */}
              <div style={{ background:cardBg, borderRadius:'14px', padding:'14px', border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ color:subText, fontSize:'10px', margin:'0 0 4px' }}>POINTS SAAT INI</p>
                  <p style={{ color:'#fde68a', fontSize:'24px', fontWeight:900, margin:0 }}>🪙 {points.toLocaleString()}</p>
                </div>
                <button
                  onPointerDown={e => { e.stopPropagation(); setNumpadTarget('points'); setPointInput(String(points)); setShowNumpad(true); }}
                  style={{ padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:900, border:`2px solid ${theme.primary}`, cursor:'pointer', background:`${theme.primary}33`, color:'#fff', userSelect:'none' }}
                >
                  ✏️ Edit
                </button>
              </div>

              {/* Quick add buttons */}
              <p style={{ color:subText, fontSize:'10px', fontWeight:700, margin:'4px 0 0' }}>TAMBAH CEPAT:</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px' }}>
                {[100, 500, 1000, 5000, 10000, 99999].map(amt => (
                  <button key={amt}
                    onPointerDown={e => { e.stopPropagation(); onSetPoints(points + amt); addLog(`💰 +${amt} points`); }}
                    style={{ padding:'10px 4px', borderRadius:'10px', fontSize:'12px', fontWeight:800, border:`1px solid ${theme.primary}44`, cursor:'pointer', background:`${theme.primary}22`, color:textColor, userSelect:'none' }}>
                    +{amt >= 1000 ? `${amt/1000}K` : amt} 🪙
                  </button>
                ))}
              </div>

              <Btn label="🗑️ Reset Points ke 0" color="#dc2626" onClick={() => { onSetPoints(0); addLog('💰 Points di-reset ke 0'); }}/>

              <div style={{ height:'1px', background:border }}/>
              <p style={{ color:theme.primary, fontWeight:900, fontSize:'11px', textTransform:'uppercase', margin:'4px 0' }}>🎯 Total Spawned</p>

              {/* Spawned display */}
              <div style={{ background:cardBg, borderRadius:'14px', padding:'14px', border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ color:subText, fontSize:'10px', margin:'0 0 4px' }}>TOTAL SPAWNED</p>
                  <p style={{ color:'#86efac', fontSize:'20px', fontWeight:900, margin:0 }}>🧱 {totalSpawned.toLocaleString()}</p>
                </div>
                <button
                  onPointerDown={e => { e.stopPropagation(); setNumpadTarget('spawned'); setSpawnInput(String(totalSpawned)); setShowNumpad(true); }}
                  style={{ padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:900, border:`2px solid #16a34a`, cursor:'pointer', background:'rgba(22,163,74,0.2)', color:'#fff', userSelect:'none' }}
                >
                  ✏️ Edit
                </button>
              </div>

              <div style={{ height:'1px', background:border }}/>
              <p style={{ color:theme.primary, fontWeight:900, fontSize:'11px', textTransform:'uppercase', margin:'4px 0' }}>👑 Premium & Items</p>

              <div style={{ background:cardBg, borderRadius:'14px', padding:'14px', border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ color:subText, fontSize:'10px', margin:'0 0 4px' }}>STATUS PREMIUM</p>
                  <p style={{ color: hasPremium ? '#4ade80' : '#f87171', fontSize:'16px', fontWeight:900, margin:0 }}>{hasPremium ? '✅ Aktif' : '❌ Tidak Aktif'}</p>
                </div>
                <Btn label={hasPremium ? '❌ Cabut' : '✅ Aktifkan'} color={hasPremium ? '#dc2626' : '#16a34a'} onClick={() => { onSetPremium(!hasPremium); addLog(`👑 Premium ${!hasPremium ? 'diaktifkan' : 'dicabut'}`); }}/>
              </div>

              <div style={{ background:cardBg, borderRadius:'14px', padding:'14px', border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ color:subText, fontSize:'10px', margin:'0 0 4px' }}>ITEMS TERBELI</p>
                  <p style={{ color:'#a78bfa', fontSize:'16px', fontWeight:900, margin:0 }}>🔓 {ownedItems.size} items</p>
                </div>
                <Btn label="🔓 Unlock Semua" color="#7c3aed" onClick={() => { onUnlockAll(); addLog('🔓 Semua item di-unlock!'); }}/>
              </div>
            </>
          )}

          {/* NUMPAD OVERLAY inside Economy tab */}
          {tab === 'economy' && showNumpad && (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <p style={{ color:theme.primary, fontWeight:900, fontSize:'13px', margin:0 }}>
                  {numpadTarget === 'points' ? '💰 Set Points' : '🎯 Set Total Spawned'}
                </p>
                <button
                  onPointerDown={e => { e.stopPropagation(); setShowNumpad(false); }}
                  style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'8px', color:'#fff', padding:'6px 12px', fontSize:'12px', cursor:'pointer', userSelect:'none' }}
                >
                  ← Kembali
                </button>
              </div>
              <NumPad
                value={currentNumpadValue}
                onChange={setCurrentNumpadValue}
                onConfirm={handleNumpadConfirm}
                color={numpadTarget === 'points' ? '#eab308' : '#16a34a'}
              />
            </div>
          )}

          {/* GAME TAB */}
          {tab === 'game' && (
            <>
              <p style={{ color:theme.primary, fontWeight:900, fontSize:'11px', textTransform:'uppercase', margin:'0 0 4px' }}>🎮 Kontrol Game</p>

              <div style={{ background:cardBg, borderRadius:'14px', padding:'12px', border:`1px solid ${border}` }}>
                <p style={{ color:subText, fontSize:'10px', fontWeight:700, margin:'0 0 8px' }}>⚡ SPEED</p>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {[0.5,1,2,3,5,10,20].map(s => (
                    <button key={s}
                      onPointerDown={e => { e.stopPropagation(); onSetSpeed(s); addLog(`⚡ Speed set ke ${s}x`); }}
                      style={{ padding:'10px 14px', borderRadius:'10px', fontSize:'14px', fontWeight:900, border:'none', cursor:'pointer', userSelect:'none',
                        background: speed===s ? theme.primary : 'rgba(255,255,255,0.08)',
                        color: speed===s ? '#fff' : subText,
                        boxShadow: speed===s ? `0 0 12px ${theme.primary}66` : 'none',
                      }}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                {[
                  { label:'🗑️ Clear Canvas', color:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.4)', text:'#f87171', fn: () => { onClearCanvas(); addLog('🗑️ Canvas di-clear'); }},
                  { label:'💧 Fill Water',   color:'rgba(37,99,235,0.15)', border:'rgba(37,99,235,0.4)', text:'#60a5fa', fn: () => { onFillCanvas('water'); addLog('💧 Fill water'); }},
                  { label:'🏖️ Fill Sand',    color:'rgba(202,138,4,0.15)', border:'rgba(202,138,4,0.4)', text:'#fde047', fn: () => { onFillCanvas('sand'); addLog('🏖️ Fill sand'); }},
                  { label:'🔥 Fill Fire',    color:'rgba(234,88,12,0.15)', border:'rgba(234,88,12,0.4)', text:'#fb923c', fn: () => { onFillCanvas('fire'); addLog('🔥 Fill fire'); }},
                  { label:'🌋 Fill Lava',    color:'rgba(194,65,12,0.15)', border:'rgba(194,65,12,0.4)', text:'#f97316', fn: () => { onFillCanvas('lava'); addLog('🌋 Fill lava'); }},
                  { label:'❄️ Fill Ice',     color:'rgba(103,232,249,0.15)', border:'rgba(103,232,249,0.4)', text:'#67e8f9', fn: () => { onFillCanvas('ice'); addLog('❄️ Fill ice'); }},
                  { label:'🕳️ Fill Void',    color:'rgba(3,7,18,0.5)', border:'rgba(167,139,250,0.4)', text:'#a78bfa', fn: () => { onFillCanvas('void'); addLog('🕳️ Fill void!'); }},
                  { label:'💥 BOOM!',        color:'rgba(245,158,11,0.2)', border:'rgba(245,158,11,0.5)', text:'#fbbf24', fn: () => { onFillCanvas('explosion'); addLog('💥 BOOM!'); }},
                ].map((item, i) => (
                  <button key={i}
                    onPointerDown={e => { e.stopPropagation(); item.fn(); }}
                    style={{ padding:'14px', borderRadius:'12px', fontSize:'13px', fontWeight:800, border:`1px solid ${item.border}`, cursor:'pointer', background:item.color, color:item.text, userSelect:'none' }}>
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ELEMENTS TAB */}
          {tab === 'elements' && (
            <>
              <p style={{ color:theme.primary, fontWeight:900, fontSize:'11px', textTransform:'uppercase', margin:'0 0 4px' }}>⚗️ Pilih Elemen Langsung</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'6px' }}>
                {ADMIN_ELEMENTS.map(type => {
                  const info = ELEMENTS[type];
                  if (!info) return null;
                  return (
                    <button key={type}
                      onPointerDown={e => { e.stopPropagation(); onSetElement(type); addLog(`⚗️ Elemen: ${info.label}`); }}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', padding:'12px 4px', borderRadius:'12px', border:`1px solid rgba(255,255,255,0.08)`, cursor:'pointer', background:'rgba(255,255,255,0.04)', userSelect:'none' }}>
                      <span style={{ fontSize:'24px' }}>{info.emoji}</span>
                      <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'9px', fontWeight:700, textAlign:'center' }}>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* CHEATS TAB */}
          {tab === 'cheats' && (
            <>
              <p style={{ color:'#f87171', fontWeight:900, fontSize:'11px', textTransform:'uppercase', margin:'0 0 4px' }}>🎯 Cheat Codes</p>
              <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'10px 14px', marginBottom:'4px' }}>
                <p style={{ color:'#f87171', fontSize:'11px', margin:0 }}>⚠️ Cheats ini hanya untuk testing!</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {[
                  { label:'💰 Max Coins',    color:'#ca8a04', action: () => { onSetPoints(999999); addLog('💰 MAXED! 999,999 coins!'); }},
                  { label:'👑 God Mode',     color:'#7c3aed', action: () => { onSetPremium(true); onUnlockAll(); onSetPoints(999999); addLog('👑 GOD MODE ON!'); }},
                  { label:'🔓 Unlock All',   color:'#0891b2', action: () => { onUnlockAll(); addLog('🔓 Semua di-unlock!'); }},
                  { label:'💣 Nuke Canvas',  color:'#dc2626', action: () => { onFillCanvas('explosion'); addLog('💣 NUKE!'); }},
                  { label:'🌊 Flood',        color:'#1d4ed8', action: () => { onFillCanvas('water'); addLog('🌊 FLOOD!'); }},
                  { label:'☄️ Meteor',       color:'#c87832', action: () => { onFillCanvas('lava'); addLog('☄️ METEOR!'); }},
                  { label:'❄️ Ice Age',      color:'#06b6d4', action: () => { onFillCanvas('ice'); addLog('❄️ ICE AGE!'); }},
                  { label:'🌿 Jungle',       color:'#16a34a', action: () => { onFillCanvas('plant'); addLog('🌿 JUNGLE!'); }},
                  { label:'⚡ Turbo 20x',   color:'#eab308', action: () => { onSetSpeed(20); addLog('⚡ TURBO 20x!'); }},
                  { label:'🐌 Slow Mo',      color:'#6366f1', action: () => { onSetSpeed(0.5); addLog('🐌 SLOW MO!'); }},
                  { label:'+100K Coins',     color:'#16a34a', action: () => { onSetPoints(points + 100000); addLog('+100K coins!'); }},
                  { label:'🗑️ Clear All',   color:'#374151', action: () => { onClearCanvas(); addLog('🗑️ CLEARED!'); }},
                ].map((c,i) => (
                  <button key={i}
                    onPointerDown={e => { e.stopPropagation(); c.action(); }}
                    style={{ padding:'16px', borderRadius:'12px', fontSize:'13px', fontWeight:800, border:`1px solid ${c.color}44`, cursor:'pointer', background:`${c.color}22`, color:'#fff', textAlign:'left', userSelect:'none' }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* LOG */}
          <div style={{ marginTop:'8px', background:'rgba(0,0,0,0.4)', border:`1px solid ${border}`, borderRadius:'12px', padding:'10px' }}>
            <p style={{ color:subText, fontSize:'10px', fontWeight:700, textTransform:'uppercase', marginBottom:'6px' }}>📋 Log</p>
            <div style={{ maxHeight:'80px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'2px' }}>
              {log.map((l, i) => (
                <p key={i} style={{ color: i===0 ? '#4ade80' : '#4b5563', fontSize:'10px', margin:0, fontFamily:'monospace' }}>{l}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'10px 16px', borderTop:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:`${theme.primary}11`, borderRadius:'0 0 18px 18px' }}>
          <span style={{ color:subText, fontSize:'10px' }}>⚡ Admin Mode</span>
          <button onPointerDown={e => { e.stopPropagation(); onClose(); }} style={{ padding:'8px 18px', borderRadius:'10px', fontSize:'12px', fontWeight:800, border:'none', cursor:'pointer', background:theme.primary, color:'#fff', userSelect:'none' }}>
            Tutup ✕
          </button>
        </div>
      </div>
    </div>
  );
}
