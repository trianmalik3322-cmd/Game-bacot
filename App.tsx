import { useState, useCallback, useRef, useEffect } from 'react';
import { createGrid, Grid } from './game/simulation';
import { initAudio, playElementSound, playCoinSound, playAchievementSound, playBuySound, setSoundEnabled, setSoundVolume } from './game/sounds';
import { ElementType, ELEMENTS, MAP_SIZES, MapSizeId, setMapSize, refreshDimensions } from './game/constants';
import { OwnedItems } from './game/shop';
import { SeasonId, SEASONS, getNextSeason } from './game/seasons';
import GameCanvas from './components/GameCanvas';
import ShopModal from './components/ShopModal';
import SettingsModal, { UI_THEMES, UITheme } from './components/SettingsModal';
import AdminPanel from './components/AdminPanel';
import AutoFarmModal from './components/AutoFarmModal';
import { AchievementNotification, AchievementModal, useAchievements } from './components/AchievementSystem';
import type { Achievement } from './components/AchievementSystem';
import StatsPanel from './components/StatsPanel';

const CATEGORIES = [
  { id: 'basic',        label: '🧱',  fullLabel: 'Basic'        },
  { id: 'earth',        label: '🌍',  fullLabel: 'Earth'        },
  { id: 'weather',      label: '⛅',  fullLabel: 'Weather'      },
  { id: 'special',      label: '⚗️', fullLabel: 'Special'      },
  { id: 'experimental', label: '🧬', fullLabel: 'Experimental' },
  { id: 'life',         label: '🐾',  fullLabel: 'Makhluk'      },
  { id: 'shop',         label: '🛍️', fullLabel: 'Shop'         },
  { id: 'auto',         label: '🔄',  fullLabel: 'Auto'         },
];

const ELEMENT_BG: Record<ElementType, string> = {
  empty:       '#374151',
  sand:        '#ca8a04',
  water:       '#2563eb',
  stone:       '#6b7280',
  fire:        '#ea580c',
  wood:        '#92400e',
  lava:        '#c2410c',
  smoke:       '#9ca3af',
  ice:         '#67e8f9',
  plant:       '#16a34a',
  explosion:   '#f59e0b',
  oil:         '#78350f',
  acid:        '#84cc16',
  mud:         '#a16207',
  steam:       '#cbd5e1',
  gunpowder:   '#4b5563',
  glass:       '#a5f3fc',
  salt:        '#f1f5f9',
  saltwater:   '#1d4ed8',
  snow:        '#dbeafe',
  cloud:       '#e2e8f0',
  lightning:   '#fde047',
  metal:       '#94a3b8',
  rust:        '#b45309',
  virus:       '#9333ea',
  crystal:     '#7c3aed',
  honey:       '#d97706',
  bubble:      '#7dd3fc',
  concrete:    '#9ca3af',
  void:        '#030712',
  clone:       '#10b981',
  gasoline:    '#4ade80',
  leaf:        '#f97316',
  // LIFE
  ant:         '#3c1e0a',
  fish:        '#1e78ff',
  bird:        '#ffc832',
  worm:        '#b45050',
  frog:        '#32b432',
  crab:        '#dc3c1e',
  bee:         '#f0b400',
  mushroom:    '#c85028',
  // SHOP CREATURES
  babydragon:  '#ff5014',
  unicorn:     '#ff96dc',
  ghost:       '#c8d2e6',
  robot:       '#96aabe',
  alien:       '#64dc64',
  shark:       '#5078b4',
  cat:         '#dcaa78',
  spider:      '#3c3c50',
  penguin:     '#323c50',
  snake:       '#3c9664',
  butterfly:   '#c864ff',
  phoenix:     '#ffa000',
  whale:       '#3c64c8',
  dinosaur:    '#50b43c',
  demon:       '#b41414',
  // SHOP ELEMENTS
  antimatter:  '#8b00ff',
  plasma:      '#00c8ff',
  magma:       '#dc3c00',
  blackhole:   '#0a0014',
  rainbow:     '#ff64c8',
  dragonfire:  '#ff3200',
  timesand:    '#c8b432',
  antigravity: '#6464ff',
  meteor:      '#c87832',
  tornado:     '#96c8dc',
  electricity: '#ffff00',
  poison:      '#64c832',
  magnet:      '#c83232',
  diamond:     '#96dcff',
  // NEW SHOP ELEMENTS
  quicksand:   '#b48c3c',
  superlava:   '#ff1e00',
  holywater:   '#c8f0ff',
  bluefire:    '#0064ff',
  c4:          '#dc2828',
  nuclearwaste:'#64dc1e',
  wind:        '#c8e6ff',
  seed:        '#50a028',
  fog:         '#b4bec8',
  web:         '#dcdce6',
  potion:      '#b432dc',
  tar:         '#1e1914',
  obsidian:    '#140a1e',
  tidalwave:   '#0050c8',
  stardust:    '#ffdc64',
  cryo:        '#64c8ff',
  trident:     '#3296ff',
  nebula:      '#781eb4',
  mindblow:    '#ff32c8',
  party:       '#ff6464',
  // NEW SHOP CREATURES
  wolf:        '#786e64',
  lion:        '#d2aa50',
  octopus:     '#b450a0',
  eagle:       '#a0783c',
  turtle:      '#3c8c3c',
  rabbit:      '#e6d2c8',
  bear:        '#785028',
  jellyfish:   '#dc64dc',
  kingcrab:    '#dc321e',
  queenbee:    '#ffc800',
  elderdragon: '#c83232',
  angel:       '#ffffc8',
  kraken:      '#282864',
  titan:       '#645a50',
  sandgod:     '#ffb400',
  // MISSING SHOP ELEMENTS
  nuke:        '#64dc1e',
  slime:       '#64c832',
  soapbubble:  '#96dcff',
  cheese:      '#dcbe32',
  glue:        '#d2a050',
  prism:       '#dc96ff',
  rubber:      '#505050',
  mirror:      '#c8dcf0',
  portal:      '#b450ff',
  warp:        '#50c8c8',
  darkmatter:  '#1e1428',
  thunderstorm:'#b4b450',
  toxicmud:    '#786428',
  dryice:      '#96dcf0',
  gravitywell: '#281450',
  colorbomb:   '#ff64c8',
  stormcloud:  '#4a5568',
  // NEW FREE ELEMENTS
  gravel:      '#827870',
  charcoal:    '#282320',
  chalk:       '#e6e1dc',
  bedrock:     '#1e1e23',
  mercury:     '#b4bec8',
  gel:         '#9632c8',
  glue2:       '#dcb43c',
  mist:        '#bec8d7',
  spark:       '#ffdc64',
  whirlwind:   '#b4d2e6',
  grass:       '#3cb43c',
  wheat:       '#c8aa3c',
  cactus:      '#32a032',
  fungi:       '#b45032',
  firework:    '#ff64c8',
  magicfire:   '#9632ff',
  plasma2:     '#c864ff',
  frostfire:   '#64c8ff',
  swamp:       '#506428',
  coral:       '#ff7864',
  quickclay:   '#a07850',
  lavarock:    '#64321e',
  ember:       '#ff7820',
  ash:         '#968c82',
  ironore:     '#504650',
  goldore:     '#c8a014',
  marble:      '#dcd7d2',
  sulfur:      '#dcc81e',
  nitroglycerin:'#ff3264',
  wax:         '#f0dcb4',
  cotton:      '#f5f0eb',
  rope:        '#a0783c',
  paper:       '#f0ebe0',
  glass2:      '#b4dcf0',
  sponge:      '#dcb43c',
  pumice:      '#c8c3be',
  // AUTO ELEMENTS
  autowater:   '#1E64C8',
  autosand:    '#B49650',
  autofire:    '#C83200',
  autolava:    '#C85000',
  autosnow:    '#AAC8E6',
  autosteam:   '#8CAABE',
  autoplant:   '#1E961E',
  autooil:     '#3C2810',
  autoacid:    '#28C80A',
  autospark:   '#C8AA32',
  autocloud:   '#A0AFB9',
  autowind:    '#A0BED2',
  autonuclear: '#46B414',
  autodark:    '#190F23',
  autoparty:   '#C85096',
  automud:     '#503219',
  autoice:     '#78B4D2',
  autovirus:   '#A028A0',
  autosmoke:   '#646473',
  autobluefire:'#0050C8',
};

const GROUPED_ELEMENTS: Record<string, ElementType[]> = {
  basic:        ['sand','water','stone','fire','wood','lava','smoke','ice','plant','explosion','oil','acid','empty',
                 'gravel','charcoal','chalk','bedrock','mercury','gel','glue2'],
  earth:        ['mud','glass','concrete','crystal','rust',
                 'grass','wheat','cactus','fungi','swamp','coral','quickclay','lavarock','ironore','goldore','marble','pumice'],
  weather:      ['snow','cloud','steam','lightning','bubble',
                 'mist','spark','whirlwind'],
  special:      ['metal','gunpowder','salt','saltwater','honey','gasoline',
                 'firework','magicfire','plasma2','frostfire','ember','ash','sulfur','nitroglycerin','wax'],
  experimental: ['virus','void','clone','leaf',
                 'cotton','rope','paper','glass2','sponge'],
  life:         ['ant','fish','bird','worm','frog','crab','bee','mushroom',
                 'babydragon','unicorn','ghost','robot','alien','shark','cat','spider',
                 'penguin','snake','butterfly','phoenix','whale','dinosaur','demon',
                 'wolf','lion','octopus','eagle','turtle','rabbit','bear','jellyfish',
                 'kingcrab','queenbee','elderdragon','angel','kraken','titan','sandgod'],
  shop:         ['antimatter','plasma','magma','blackhole','rainbow','dragonfire','timesand','antigravity',
                 'meteor','tornado','electricity','poison','magnet','diamond',
                 'nuke','slime','soapbubble','cheese','glue','prism','rubber',
                 'mirror','portal','warp','darkmatter','thunderstorm','toxicmud','dryice','gravitywell','colorbomb',
                 'quicksand','superlava','holywater','bluefire','c4','nuclearwaste',
                 'wind','seed','fog','web','potion','tar','obsidian','tidalwave',
                 'stardust','cryo','trident','nebula','mindblow','party',
                 'stormcloud'],
  auto:         ['autowater','autosand','autofire','autolava','autosnow','autosteam',
                 'autoplant','autooil','autoacid','autospark','autocloud','autowind',
                 'autonuclear','autodark','autoparty','automud','autoice',
                 'autovirus','autosmoke','autobluefire'],
};

// shop effect map unused, handled in ShopModal directly


// Life elements always unlocked (free)
const LIFE_ELEMENTS_FREE: ElementType[] = ['ant','fish','bird','worm','frog','crab','bee','mushroom'];

// Shop creature elements (need unlock)
const LIFE_ELEMENTS_SHOP: ElementType[] = ['babydragon','unicorn','ghost','robot','alien','shark','cat','spider','penguin','snake','butterfly','phoenix','whale','dinosaur','demon','wolf','lion','octopus','eagle','turtle','rabbit','bear','jellyfish','kingcrab','queenbee','elderdragon','angel','kraken','titan','sandgod'];

// combined life elements list (used for reference)
const _ALL_LIFE = [...LIFE_ELEMENTS_FREE, ...LIFE_ELEMENTS_SHOP];
void _ALL_LIFE;

const ELEMENT_TO_SHOP_ID: Partial<Record<ElementType, string>> = {
  // shop elements — EXACT IDs from shop.ts
  antimatter:  'el_antimatter',
  plasma:      'el_plasma',
  magma:       'el_magma',
  blackhole:   'el_blackhole',
  rainbow:     'el_rainbow',
  dragonfire:  'el_dragon',   // shop.ts id = 'el_dragon'
  timesand:    'el_time',     // shop.ts id = 'el_time'
  antigravity: 'el_gravity',  // shop.ts id = 'el_gravity'
  meteor:      'el_meteor',
  tornado:     'el_tornado',
  electricity: 'el_electricity',
  poison:      'el_poison',
  magnet:      'el_magnet',
  diamond:     'el_diamond',
  // shop creatures — EXACT IDs from shop.ts
  babydragon:  'cr_dragon',
  unicorn:     'cr_unicorn',
  ghost:       'cr_ghost',
  robot:       'cr_robot',
  alien:       'cr_alien',
  shark:       'cr_shark',
  cat:         'cr_cat',
  spider:      'cr_spider',
  penguin:     'cr_penguin',
  snake:       'cr_snake',
  butterfly:   'cr_butterfly',
  phoenix:     'cr_phoenix',
  whale:       'cr_whale',
  dinosaur:    'cr_dinosaur',
  demon:       'cr_demon',
  // new shop elements
  quicksand:   'el_sand2',
  superlava:   'el_lava2',
  holywater:   'el_water2',
  bluefire:    'el_fire2',
  c4:          'el_explosion',
  nuclearwaste:'el_nuclear',
  wind:        'el_wind',
  seed:        'el_seed',
  fog:         'el_cloud2',
  web:         'el_web',
  potion:      'el_potion',
  tar:         'el_tar',
  obsidian:    'el_magma2',
  tidalwave:   'el_tidalwave',
  stardust:    'el_stardust',
  cryo:        'el_cryo',
  trident:     'el_trident',
  nebula:      'el_nebula',
  mindblow:    'el_mindblow',
  party:       'el_party',
  // missing shop elements
  nuke:        'el_nuke',
  slime:       'el_sticky',
  soapbubble:  'el_soap',
  cheese:      'el_cheese',
  glue:        'el_glue',
  prism:       'el_crystal2',
  rubber:      'el_rubber',
  mirror:      'el_mirror',
  portal:      'el_portal',
  warp:        'el_warp',
  darkmatter:  'el_dark',
  thunderstorm:'el_lightning2',
  toxicmud:    'el_mud2',
  dryice:      'el_ice2',
  gravitywell: 'el_gravity2',
  colorbomb:   'el_rainbow2',
  stormcloud:  'el_stormcloud',
  // new shop creatures
  wolf:        'cr_wolf',
  lion:        'cr_lion',
  octopus:     'cr_octopus',
  eagle:       'cr_eagle',
  turtle:      'cr_turtle',
  rabbit:      'cr_rabbit',
  bear:        'cr_bear',
  jellyfish:   'cr_jellyfish',
  kingcrab:    'cr_kingcrab',
  queenbee:    'cr_queenbee',
  elderdragon: 'cr_elderdragon',
  angel:       'cr_angel',
  kraken:      'cr_kraken',
  titan:       'cr_titan',
  sandgod:     'cr_sandgod',
};

const SPEED_OPTIONS = [
  { label: '½x',  value: 0.5 },
  { label: '1x',  value: 1   },
  { label: '2x',  value: 2   },
  { label: '3x',  value: 3   },
  { label: '5x',  value: 5,  isPremium: true },
  { label: '10x', value: 10, isSuperPremium: true },
  { label: '20x', value: 20, isSuperPremium: true },
];

const BRUSH_SIZES = [
  { label: '1', value: 1 },
  { label: '3', value: 3 },
  { label: '5', value: 5 },
  { label: '8', value: 8 },
];

// ── Tutorial ─────────────────────────────────────────────────────
function TutorialModal({ onClose, theme }: { onClose: () => void; theme: UITheme }) {
  const [page, setPage] = useState(0);
  const pages = [
    {
      title: '👋 Selamat Datang!',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          <p style={{ color:'#d1d5db', fontSize:'13px', textAlign:'center', lineHeight:1.6 }}>
            Game simulasi partikel fisika! Ada <span style={{ color:'#fde047', fontWeight:900 }}>40+ elemen</span>, <span style={{ color:'#c084fc', fontWeight:900 }}>Makhluk Hidup</span>, <span style={{ color:'#fbbf24', fontWeight:900 }}>Shop</span>, <span style={{ color:'#fbbf24', fontWeight:900 }}>Musim</span>, dan <span style={{ color:'#fbbf24', fontWeight:900 }}>Premium</span>!
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {[
              { e:'🎮', t:'Physics Sandbox', d:'Simulasi fisika real-time' },
              { e:'🐾', t:'Makhluk Hidup', d:'Ant, Fish, Bird, Frog...' },
              { e:'🌸', t:'Sistem Musim', d:'Semi, Panas, Gugur, Dingin' },
              { e:'🪙', t:'10 blok = 1 poin', d:'Kumpulin & belanja!' },
            ].map((x,i) => (
              <div key={i} style={{ background:`${theme.primary}22`, borderRadius:'14px', padding:'10px', border:`1px solid ${theme.primary}44`, display:'flex', alignItems:'flex-start', gap:'8px' }}>
                <span style={{ fontSize:'22px' }}>{x.e}</span>
                <div>
                  <p style={{ color:'#fff', fontSize:'11px', fontWeight:800, margin:0 }}>{x.t}</p>
                  <p style={{ color:'#9ca3af', fontSize:'10px', margin:'2px 0 0' }}>{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '🖱️ Cara Main',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {[
            { e:'👆', t:'Klik / Sentuh & Geser', d:'Tahan di canvas lalu geser untuk menggambar!' },
            { e:'🎨', t:'Pilih Elemen', d:'Tap tombol elemen di bawah (mobile) atau panel kiri' },
            { e:'🖌️', t:'Ukuran Brush', d:'Pilih 1, 3, 5, atau 8 untuk kuas berbeda' },
            { e:'⏸️', t:'Pause / Play', d:'Stop/lanjutkan simulasi kapanpun' },
            { e:'⚙️', t:'Pengaturan', d:'Ganti tema warna & atur musim di Settings' },
          ].map((x,i) => (
            <div key={i} style={{ display:'flex', gap:'10px', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'10px', border:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize:'18px', marginTop:'2px' }}>{x.e}</span>
              <div>
                <p style={{ color:'#fff', fontSize:'12px', fontWeight:800, margin:0 }}>{x.t}</p>
                <p style={{ color:'#9ca3af', fontSize:'11px', margin:'2px 0 0' }}>{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '🐾 Makhluk Hidup',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <p style={{ color:'#9ca3af', fontSize:'11px', textAlign:'center', margin:'0 0 4px' }}>Elemen hidup yang bergerak sendiri!</p>
          {[
            ['🐜 Semut', 'Bergerak ke kiri-kanan, mati kena api'],
            ['🐟 Ikan', 'Berenang di dalam air'],
            ['🐦 Burung', 'Terbang bebas ke atas'],
            ['🪱 Cacing', 'Menggali pasir & tanah'],
            ['🐸 Katak', 'Melompat-lompat, suka air'],
            ['🦀 Kepiting', 'Bergerak menyamping di pasir'],
            ['🐝 Lebah', 'Terbang bebas, hasilkan madu!'],
            ['🍄 Jamur', 'Tumbuh di tanah lembab'],
          ].map(([a,b],i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'8px 12px', border:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color:'#fff', fontSize:'12px', fontWeight:700 }}>{a}</span>
              <span style={{ color:'#9ca3af', fontSize:'11px' }}>{b}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '⚗️ Reaksi Keren',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {[
            ['🏖️ + 🔥','→ 🪟 Glass!'],
            ['💧 + 🧂','→ 🌊 Salt Water!'],
            ['⚙️ + 💧','→ 🦺 Rust!'],
            ['♨️ naik','→ ☁️ Cloud!'],
            ['🕳️ + apapun','→ 💀 Diserap!'],
            ['🐝 + 🌿','→ 🍯 Honey!'],
            ['🌋 + 💧','→ 🪨 Stone!'],
            ['☠️ + 🐜','→ 💀 Mati!'],
          ].map(([a,b],i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'8px 12px', border:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color:'#fff', fontSize:'12px', fontFamily:'monospace' }}>{a}</span>
              <span style={{ color:'#4ade80', fontSize:'12px', fontWeight:700 }}>{b}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];
  const cur = pages[page];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', padding:'16px' }}>
      <div style={{ background:'#0d0d1f', border:`1px solid ${theme.primary}88`, borderRadius:'20px', width:'100%', maxWidth:'440px', display:'flex', flexDirection:'column', maxHeight:'90vh', boxShadow:'0 25px 60px rgba(0,0,0,0.8)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${theme.primary}33` }}>
          <h2 style={{ color:'#fff', fontWeight:900, fontSize:'15px', margin:0 }}>{cur.title}</h2>
          <button onClick={onClose} style={{ color:'#9ca3af', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', width:'30px', height:'30px', fontSize:'15px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'14px' }}>{cur.content}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderTop:`1px solid ${theme.primary}33` }}>
          <div style={{ display:'flex', gap:'6px' }}>
            {pages.map((_,i) => (
              <button key={i} onClick={() => setPage(i)}
                style={{ borderRadius:'99px', border:'none', cursor:'pointer', transition:'all 0.2s', width: i===page ? '20px' : '8px', height:'8px', background: i===page ? theme.primary : `${theme.primary}44` }}/>
            ))}
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            {page > 0 && <button onClick={() => setPage(p=>p-1)} style={{ padding:'8px 16px', borderRadius:'10px', fontSize:'12px', fontWeight:700, background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', cursor:'pointer' }}>← Back</button>}
            {page < pages.length-1
              ? <button onClick={() => setPage(p=>p+1)} style={{ padding:'8px 18px', borderRadius:'10px', fontSize:'12px', fontWeight:700, background:theme.primary, border:'none', color:'#fff', cursor:'pointer' }}>Next →</button>
              : <button onClick={onClose} style={{ padding:'8px 18px', borderRadius:'10px', fontSize:'12px', fontWeight:700, background:'#16a34a', border:'none', color:'#fff', cursor:'pointer' }}>🎮 Mulai!</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toast System ─────────────────────────────────────────────────
interface ToastItem {
  id: number;
  type: 'points' | 'shop';
  pts?: number;
  msg?: string;
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position:'fixed', bottom:'90px', right:'12px', zIndex:9999, pointerEvents:'none', display:'flex', flexDirection:'column-reverse', alignItems:'flex-end', gap:'8px' }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastItem; onRemove: (id: number) => void }) {
  useEffect(() => {
    const duration = toast.type === 'points' ? 1200 : 2500;
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.type, onRemove]);

  if (toast.type === 'points') {
    return (
      <div style={{
        background:'linear-gradient(135deg,#ca8a04,#eab308)',
        color:'#000',
        fontWeight:900,
        fontSize:'14px',
        padding:'7px 18px',
        borderRadius:'99px',
        boxShadow:'0 4px 20px rgba(234,179,8,0.6)',
        animation:'fadeSlideIn 0.2s ease',
        whiteSpace:'nowrap',
      }}>
        +{toast.pts} 🪙
      </div>
    );
  }

  return (
    <div style={{
      background:'linear-gradient(135deg,#7c3aed,#4c1d95)',
      color:'#fff',
      fontWeight:800,
      fontSize:'13px',
      padding:'9px 20px',
      borderRadius:'14px',
      boxShadow:'0 4px 24px rgba(124,58,237,0.6)',
      whiteSpace:'nowrap',
      border:'1px solid #a78bfa',
      animation:'fadeSlideIn 0.2s ease',
    }}>
      {toast.msg}
    </div>
  );
}

// ── Season Banner ─────────────────────────────────────────────────
function SeasonBanner({ season, timeLeft }: { season: SeasonId; timeLeft: number; theme?: UITheme }) {
  const s = SEASONS.find(x => x.id === season)!;
  return (
    <div style={{ position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)', zIndex:10, pointerEvents:'none',
      background:'rgba(0,0,0,0.65)', border:`1px solid ${s.color}66`, borderRadius:'12px', padding:'4px 14px', display:'flex', alignItems:'center', gap:'8px' }}>
      <span style={{ fontSize:'16px' }}>{s.emoji}</span>
      <span style={{ color:s.color, fontWeight:800, fontSize:'12px' }}>Musim {s.name}</span>
      <span style={{ color:'#6b7280', fontSize:'11px' }}>{timeLeft}s</span>
    </div>
  );
}

// ── Element Sheet Mobile ─────────────────────────────────────────
function ElementSheet({
  open, onClose, selected, onSelect, activeCategory, onCategoryChange, ownedItems, onOpenShop, theme, hasPremium,
}: {
  open: boolean; onClose: () => void;
  selected: ElementType; onSelect: (e: ElementType) => void;
  activeCategory: string; onCategoryChange: (c: string) => void;
  ownedItems: Set<string>; onOpenShop: () => void; theme: UITheme;
  hasPremium: boolean;
}) {
  if (!open) return null;
  const elements = GROUPED_ELEMENTS[activeCategory] ?? [];
  const isShopCategory = activeCategory === 'shop';

  const isLocked = (type: ElementType) => {
    if (LIFE_ELEMENTS_FREE.includes(type)) return false;
    if (hasPremium) return false;
    const shopId = ELEMENT_TO_SHOP_ID[type];
    if (!shopId) return false;
    return !ownedItems.has(shopId);
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:40, display:'flex', alignItems:'flex-end' }} onClick={onClose}>
      <div style={{ width:'100%', background:theme.panelBg, borderTop:`1px solid ${theme.border}88`, borderRadius:'20px 20px 0 0', maxHeight:'78vh', display:'flex', flexDirection:'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'center', padding:'8px 0 4px' }}>
          <div style={{ width:'40px', height:'4px', borderRadius:'99px', background:'#374151' }}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 8px' }}>
          <h3 style={{ color:'#fff', fontWeight:900, fontSize:'14px', margin:0 }}>Pilih Elemen</h3>
          <button onClick={onClose} style={{ color:'#6b7280', fontSize:'18px', background:'none', border:'none', cursor:'pointer' }}>✕</button>
        </div>
        {/* Category tabs */}
        <div style={{ display:'flex', gap:'6px', padding:'0 12px 10px', overflowX:'auto' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onCategoryChange(cat.id)}
              style={{ shrink:0, display:'flex', alignItems:'center', gap:'4px', padding:'6px 12px', borderRadius:'10px', fontSize:'11px', fontWeight:700, border:`1px solid ${activeCategory === cat.id ? theme.primary : 'rgba(255,255,255,0.08)'}`, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s',
                background: activeCategory === cat.id ? theme.primary : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat.id ? '#fff' : '#9ca3af',
              } as any}>
              {cat.label} <span style={{ display:'none' }}>{cat.fullLabel}</span>
            </button>
          ))}
        </div>
        {isShopCategory && (
          <div style={{ margin:'0 12px 10px', background:'rgba(234,179,8,0.1)', border:'1px solid rgba(234,179,8,0.3)', borderRadius:'12px', padding:'8px 12px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'16px' }}>🛍️</span>
            <p style={{ color:'#fde047', fontSize:'11px', fontWeight:700, flex:1, margin:0 }}>Elemen premium! Beli dulu di Shop.</p>
            <button onClick={() => { onClose(); onOpenShop(); }} style={{ background:'rgba(234,179,8,0.2)', border:'1px solid rgba(234,179,8,0.4)', color:'#fde047', fontSize:'11px', fontWeight:800, padding:'4px 10px', borderRadius:'8px', cursor:'pointer' }}>Buka Shop</button>
          </div>
        )}
        <div style={{ overflowY:'auto', padding:'0 12px 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'8px' }}>
            {elements.map(type => {
              const info = ELEMENTS[type];
              const isSel = selected === type;
              const locked = isLocked(type);
              return (
                <button key={type}
                  onClick={() => { if (locked) { onClose(); onOpenShop(); return; } onSelect(type); onClose(); }}
                  style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', padding:'10px 4px', borderRadius:'14px', border:`2px solid ${isSel ? ELEMENT_BG[type] : 'rgba(255,255,255,0.06)'}`, cursor:'pointer', transition:'all 0.2s',
                    background: isSel ? ELEMENT_BG[type]+'44' : locked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                    opacity: locked ? 0.5 : 1,
                  }}>
                  <span style={{ fontSize:'22px', lineHeight:1 }}>{info.emoji}</span>
                  <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'9px', fontWeight:700, textAlign:'center', lineHeight:1.2 }}>{info.label}</span>
                  {locked && <span style={{ position:'absolute', top:'4px', right:'4px', fontSize:'10px' }}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [grid, setGrid] = useState<Grid>(() => createGrid());
  const [selected, setSelected] = useState<ElementType>('sand');
  const [brushSize, setBrushSize] = useState(3);
  const [isRunning, setIsRunning] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showElementSheet, setShowElementSheet] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAutoFarm, setShowAutoFarm] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const handleInstallPWA = useCallback(async () => {
    const { promptInstall } = await import('./pwa');
    const accepted = await promptInstall();
    if (accepted) {
      setPwaInstalled(true);
      setCanInstallPWA(false);
    }
  }, []);
  // Check installed on mount
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) setPwaInstalled(true);
    const h = (e: Event) => setCanInstallPWA((e as CustomEvent).detail.canInstall);
    window.addEventListener('pwa-installable', h);
    return () => window.removeEventListener('pwa-installable', h);
  }, []);
  const [achievementNotifs, setAchievementNotifs] = useState<Achievement[]>([]);
  const [elementsUsed, setElementsUsed] = useState<Set<string>>(new Set(['sand']));
  const [canvasCleared, setCanvasCleared] = useState(0);
  const [shopItemsBought, setShopItemsBought] = useState(0);
  const [timePlayedSeconds, setTimePlayedSeconds] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(1);
  const [seasonChanges, setSeasonChanges] = useState(0);
  const adminClickRef = useRef(0);
  const adminClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [speed, setSpeed] = useState(1);
  const [theme, setTheme] = useState<UITheme>(UI_THEMES[0]); // eslint-disable-line

  // Sound system
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [soundVolume, setSoundVolumeState] = useState(0.5);
  useEffect(() => { initAudio(); }, []);
  const handleSoundToggle = useCallback((val: boolean) => {
    setSoundEnabledState(val);
    setSoundEnabled(val);
  }, []);
  const handleVolumeChange = useCallback((val: number) => {
    setSoundVolumeState(val);
    setSoundVolume(val);
  }, []);

  // Season system
  const [seasonEnabled, setSeasonEnabled] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<SeasonId>('spring');
  const [seasonTimeLeft, setSeasonTimeLeft] = useState(60);
  const [seasonSpeed, setSeasonSpeed] = useState(1);
  const seasonTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Game settings
  const [showFPS, setShowFPS] = useState(false);
  const [particleGlow, setParticleGlow] = useState(false);

  // Economy
  // Map size
  const [mapSizeId, setMapSizeId] = useState<MapSizeId>('normal');

  const applyMapSize = useCallback((id: MapSizeId) => {
    const cfg = MAP_SIZES.find(m => m.id === id)!;
    setMapSize(cfg);
    refreshDimensions();
    setMapSizeId(id);
    setGrid(createGrid());
  }, []);

  const [points, setPoints] = useState(0);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [ownedItems, setOwnedItems] = useState<OwnedItems>(new Set<string>());
  const [hasPremium, setHasPremium] = useState(false);
  const [hasSuperPremium, setHasSuperPremium] = useState(false);
  const [pointMultiplier, setPointMultiplier] = useState(1);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((type: 'points' | 'shop', pts?: number, msg?: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev.slice(-4), { id, type, pts, msg }]);
    if (type === 'points') playCoinSound();
    if (type === 'shop') playBuySound();
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  const [activeBoost, setActiveBoost] = useState<string | null>(null);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const boostInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const multiplierRef = useRef(pointMultiplier);
  useEffect(() => { multiplierRef.current = pointMultiplier; }, [pointMultiplier]);

  // FPS counter - now handled by GameCanvas via onFpsUpdate
  const [fps, setFps] = useState(0);
  const handleFpsUpdate = useCallback((f: number) => {
    if (showFPS) setFps(f);
  }, [showFPS]);

  // Achievement system
  const { unlockedIds: unlockedAchievements, checkAchievements } = useAchievements(
    useCallback((a: Achievement) => {
      setAchievementNotifs(prev => [...prev, a]);
      setPoints(p => p + a.reward);
      addToast('shop', undefined, `🏆 ${a.title} +${a.reward}🪙`);
      playAchievementSound();
    }, [addToast])
  );

  // Timer — track time played
  useEffect(() => {
    const t = setInterval(() => setTimePlayedSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Check achievements — done later in the component after all state is declared

  // Auto Farm
  const [autoFarm, setAutoFarm] = useState(false);
  const [autoFarmElement, setAutoFarmElement] = useState<ElementType>('sand');
  const [autoFarmInterval, setAutoFarmIntervalState] = useState(500);
  const autoFarmRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoFarmCountRef = useRef(0);

  // Season timer
  useEffect(() => {
    if (!seasonEnabled) {
      if (seasonTimerRef.current) clearInterval(seasonTimerRef.current);
      return;
    }
    const s = SEASONS.find(x => x.id === currentSeason)!;
    const totalSec = Math.round(s.durationSeconds / seasonSpeed);
    setSeasonTimeLeft(totalSec);

    if (seasonTimerRef.current) clearInterval(seasonTimerRef.current);
    let left = totalSec;
    seasonTimerRef.current = setInterval(() => {
      left--;
      setSeasonTimeLeft(left);
      if (left <= 0) {
        const next = getNextSeason(currentSeason);
        setCurrentSeason(next);
        const ns = SEASONS.find(x => x.id === next)!;
        left = Math.round(ns.durationSeconds / seasonSpeed);
        setSeasonTimeLeft(left);
      }
    }, 1000);
    return () => { if (seasonTimerRef.current) clearInterval(seasonTimerRef.current); };
  }, [seasonEnabled, currentSeason, seasonSpeed]);

  // Keyboard shortcuts — disabled when any modal/panel is open or when typing in input/textarea
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Disable shortcuts if typing in any input, textarea, or select
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      // Disable shortcuts if any modal/panel is open
      if (showAdmin || showShop || showSettings || showTutorial || showAutoFarm) return;
      if (e.code === 'Space') { e.preventDefault(); setIsRunning(r => !r); }
      if (e.key === 'c' || e.key === 'C') handleClear();
      if (e.key === 's' || e.key === 'S') setShowShop(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showAdmin, showShop, showSettings, showTutorial, showAutoFarm]);

  function startBoost(mult: number, sec: number) {
    setPointMultiplier(mult);
    setActiveBoost(`${mult}x`);
    setBoostTimeLeft(sec);
    if (boostInterval.current) clearInterval(boostInterval.current);
    let left = sec;
    boostInterval.current = setInterval(() => {
      left--;
      setBoostTimeLeft(left);
      if (left <= 0) {
        clearInterval(boostInterval.current!);
        setPointMultiplier(1);
        setActiveBoost(null);
      }
    }, 1000);
  }

  const handleBlockSpawned = useCallback((count: number) => {
    setTotalSpawned(prev => {
      const newTotal = prev + count;
      const earned = (Math.floor(newTotal / 10) - Math.floor(prev / 10)) * multiplierRef.current;
      if (earned > 0) {
        setPoints(p => p + earned);
        addToast('points', earned);
      }
      return newTotal;
    });
  }, [addToast]);

  const handleSetGrid = useCallback((g: Grid) => setGrid([...g]), []);
  const handleClear = useCallback(() => {
    setGrid(createGrid());
    setCanvasCleared(c => c + 1);
  }, []);

  // Auto Farm logic
  useEffect(() => {
    if (autoFarm && canvasEffectRef.current) {
      autoFarmRef.current = setInterval(() => {
        if (handleFillRef.current) {
          // spawn in random positions via canvasEffectRef
          autoFarmCountRef.current += 50;
          handleBlockSpawned(50);
        }
        if (canvasEffectRef.current) {
          canvasEffectRef.current('autofarm_' + autoFarmElement);
        }
      }, autoFarmInterval);
    } else {
      if (autoFarmRef.current) clearInterval(autoFarmRef.current);
    }
    return () => { if (autoFarmRef.current) clearInterval(autoFarmRef.current); };
  }, [autoFarm, autoFarmElement, autoFarmInterval, handleBlockSpawned]);

  // Admin panel - click ⚡ 20x to open
  const handleAdminTrigger = useCallback(() => {
    adminClickRef.current += 1;
    if (adminClickTimer.current) clearTimeout(adminClickTimer.current);
    adminClickTimer.current = setTimeout(() => { adminClickRef.current = 0; }, 3000);
    if (adminClickRef.current >= 20) {
      adminClickRef.current = 0;
      setShowAdmin(true);
    }
  }, []);

  // Admin: fill entire canvas with element (communicated via ref)
  const handleFillRef = useRef<((el: ElementType) => void) | null>(null);
  const handleFillCanvas = useCallback((el: ElementType) => {
    if (handleFillRef.current) handleFillRef.current(el);
  }, []);

  // Canvas effect ref — for boost effects that spawn particles
  const canvasEffectRef = useRef<((effect: string) => void) | null>(null);

  // Screenshot ref — captures canvas as image
  const screenshotRef = useRef<(() => void) | null>(null);

  const handleScreenshot = useCallback(() => {
    if (screenshotRef.current) screenshotRef.current();
  }, []);

  // Check if screenshot is owned — ID di shop.ts adalah 'sp_screenshot'
  const hasScreenshot = ownedItems.has('sp_screenshot') || hasPremium;

  // Check if AdminPanel Basic is owned
  const hasAdminBasic = ownedItems.has('sp_adminbasic');

  // Admin: unlock all items
  const handleUnlockAll = useCallback(() => {
    // Use exact IDs from shop.ts
    const allIds = [
      // Elements
      'el_antimatter','el_plasma','el_magma','el_blackhole','el_rainbow',
      'el_dragon','el_time','el_gravity','el_meteor','el_tornado',
      'el_electricity','el_poison','el_magnet','el_diamond','el_nuke',
      'el_mirror','el_portal','el_warp','el_dark','el_lightning2',
      'el_sticky','el_soap','el_cheese','el_glue','el_crystal2',
      // Creatures
      'cr_dragon','cr_unicorn','cr_ghost','cr_robot','cr_alien',
      'cr_shark','cr_cat','cr_spider','cr_penguin','cr_snake',
      'cr_butterfly','cr_phoenix','cr_whale','cr_dinosaur','cr_demon',
      // Tools
      'tool_bigsplash','tool_circle','tool_spray','tool_line','tool_fill',
      'tool_dropper','tool_magicwand','tool_stamp','tool_eraser_big',
      'tool_mirror2','tool_gravity_brush','tool_text',
      // Boosts
      'boost_points2x','boost_points5x','boost_points10x','boost_autoclear',
      'boost_rain','boost_volcano','boost_snowstorm','boost_goldrain',
      'boost_megacoin','boost_earthquake','boost_gravity_flip','boost_rainbow_mode',
      // Map
      'map_large','map_super',
      // Nature
      'nat_jungle','nat_desert','nat_ocean','nat_volcano_biome','nat_arctic',
      'nat_meteor_shower','nat_aurora','nat_flood','nat_wildfire','nat_crystal_cave',
      // Weapons
      'wp_airstrike','wp_laser','wp_freeze_ray','wp_flamethrower',
      'wp_tsunami','wp_blackhole_bomb','wp_acid_rain','wp_supernova',
      // Special
      'sp_lucky','sp_megabox','sp_refund','sp_double_canvas',
      'sp_undo','sp_screenshot','sp_timelapse','sp_cheat',
      // Cosmetic
      'cos_fire_blue','cos_gold_sand','cos_neon_water','cos_lava_purple',
      'cos_pixel_art','cos_glow','cos_minimal','cos_retro','cos_cursor','cos_bg',
    ];
    setOwnedItems(new Set(allIds));
    setHasPremium(true);
  }, []);

  function startBoostLocal(mult: number, sec: number) {
    startBoost(mult, sec);
  }
  void startBoostLocal;

  // Track element usage + play sound
  const handleSelectElement = useCallback((el: ElementType) => {
    setSelected(el);
    setElementsUsed(prev => { const n = new Set(prev); n.add(el); return n; });
    playElementSound(el);
  }, []);

  // Track max speed
  const handleSetSpeed = useCallback((s: number) => {
    setSpeed(s);
    setMaxSpeed(prev => Math.max(prev, s));
  }, []);

  // Achievement check
  useEffect(() => {
    const stats = {
      totalSpawned, points, hasPremium, hasSuperPremium,
      elementsUsed, canvasCleared, timePlayedSeconds,
      shopItemsBought, autoFarmUsed: autoFarm, seasonChanges, maxSpeed,
    };
    checkAchievements(stats);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSpawned, points, hasPremium, hasSuperPremium, canvasCleared, timePlayedSeconds, shopItemsBought, autoFarm, seasonChanges, maxSpeed]);

  const selectedInfo = ELEMENTS[selected];
  const curSeason = SEASONS.find(s => s.id === currentSeason)!;

  const isLocked = (type: ElementType) => {
    if (LIFE_ELEMENTS_FREE.includes(type)) return false;
    if (hasPremium) return false;
    const shopId = ELEMENT_TO_SHOP_ID[type];
    if (!shopId) return false;
    return !ownedItems.has(shopId);
  };

  return (
    <div style={{ height:'100dvh', background:theme.bg, color:theme.text, display:'flex', flexDirection:'column', overflow:'hidden', userSelect:'none' }}>
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} theme={theme} />}
      {showShop && (
        <ShopModal
          isOpen={showShop}
          points={points}
          hasPremium={hasPremium}
          hasSuperPremium={hasSuperPremium}
          ownedItems={ownedItems}
          onClose={() => setShowShop(false)}
          onPointsChange={setPoints}
          onOwnItem={(id) => {
            setOwnedItems(prev => {
              const next = new Set<string>(prev);
              next.add(id);
              return next;
            });
            setShopItemsBought(n => n + 1);
          }}
          onPremium={() => {
            setHasPremium(true);
            setPoints(p => p + 200);
            setOwnedItems(prev => {
              const next = new Set<string>(prev);
              [
                'el_antimatter','el_plasma','el_magma','el_blackhole','el_rainbow',
                'el_dragon','el_time','el_gravity','el_meteor','el_tornado',
                'el_electricity','el_poison','el_magnet','el_diamond','el_nuke',
                'el_mirror','el_portal','el_warp','el_dark','el_lightning2',
                'el_sticky','el_soap','el_cheese','el_glue','el_crystal2',
                'cr_dragon','cr_unicorn','cr_ghost','cr_robot','cr_alien',
                'cr_shark','cr_cat','cr_spider','cr_penguin','cr_snake',
                'cr_butterfly','cr_phoenix','cr_whale','cr_dinosaur','cr_demon',
              ].forEach(id => next.add(id));
              return next;
            });
          }}
          onSuperPremium={() => {
            setHasSuperPremium(true);
            setHasPremium(true); // SuperPremium includes Premium
            setPoints(p => p + 5000);
            setPointMultiplier(10); // 10x point permanen
            // Unlock EVERYTHING including map_superpremium
            setOwnedItems(prev => {
              const next = new Set<string>(prev);
              [
                'el_antimatter','el_plasma','el_magma','el_blackhole','el_rainbow',
                'el_dragon','el_time','el_gravity','el_meteor','el_tornado',
                'el_electricity','el_poison','el_magnet','el_diamond','el_nuke',
                'el_mirror','el_portal','el_warp','el_dark','el_lightning2',
                'el_sticky','el_soap','el_cheese','el_glue','el_crystal2',
                'cr_dragon','cr_unicorn','cr_ghost','cr_robot','cr_alien',
                'cr_shark','cr_cat','cr_spider','cr_penguin','cr_snake',
                'cr_butterfly','cr_phoenix','cr_whale','cr_dinosaur','cr_demon',
                'map_large','map_super','map_superpremium',
                'sp_screenshot','sp_timelapse','sp_cheat',
                'tool_magicwand','tool_stamp','tool_mirror2','tool_text',
              ].forEach(id => next.add(id));
              return next;
            });
          }}
          onSelectElement={(el) => {
            const elType = el as ElementType;
            if (!(elType in ELEMENTS)) return;
            setSelected(elType);
            // Switch to correct tab automatically
            if (LIFE_ELEMENTS_SHOP.includes(elType) || LIFE_ELEMENTS_FREE.includes(elType)) {
              setActiveCategory('life');
            } else if (GROUPED_ELEMENTS['shop'].includes(elType)) {
              setActiveCategory('shop');
            }
            // Close shop so user can see element in picker
            setShowShop(false);
          }}
          onToast={(msg) => { addToast('shop', undefined, msg); }}
          onBoostEffect={(effect, bonus) => {
            if (!effect) return;

            // Coin boosts
            if (effect === 'coinrain') {
              const amt = bonus ?? 200;
              setPoints(p => p + amt);
              addToast('points', amt);
              return;
            }
            if (effect === 'megacoin') {
              const amt = bonus ?? 1000;
              setPoints(p => p + amt);
              addToast('points', amt);
              return;
            }

            // Speed boosts
            if (effect === '2x_60s') { startBoost(2, 60); return; }
            if (effect === '5x_30s') { startBoost(5, 30); return; }
            if (effect === '10x_20s') { startBoost(10, 20); return; }

            // Clear
            if (effect === 'autoclear') { handleClear(); return; }

            // Map size
            if (effect === 'map_large') { applyMapSize('large'); return; }
            if (effect === 'map_super') { applyMapSize('super'); return; }
            if (effect === 'map_superpremium') { applyMapSize('superpremium'); return; }

            // All canvas effects — rain, volcano, snowstorm, earthquake, luckybox, megaluckybox,
            // gravityflip, rainbowmode, nature biomes, weapons, special consumables
            if (canvasEffectRef.current) {
              canvasEffectRef.current(effect);
            }
          }}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          theme={theme} onThemeChange={setTheme}
          seasonEnabled={seasonEnabled} onSeasonToggle={setSeasonEnabled}
          currentSeason={currentSeason} onSeasonChange={(s) => { setCurrentSeason(s); setSeasonChanges(c => c + 1); }}
          seasonSpeed={seasonSpeed} onSeasonSpeedChange={setSeasonSpeed}
          volume={soundVolume} onVolumeChange={handleVolumeChange}
          soundEnabled={soundEnabled} onSoundToggle={handleSoundToggle}
          showFPS={showFPS} onShowFPSToggle={setShowFPS}
          particleGlow={particleGlow} onParticleGlowToggle={setParticleGlow}
          mapSizeId={mapSizeId}
          onMapSizeChange={applyMapSize}
          ownedMapSizes={ownedItems}
        />
      )}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          theme={theme}
          points={points}
          onSetPoints={setPoints}
          hasPremium={hasPremium}
          onSetPremium={setHasPremium}
          ownedItems={ownedItems}
          onUnlockAll={handleUnlockAll}
          onClearCanvas={handleClear}
          onSetElement={(el) => { setSelected(el); }}
          onSetSpeed={setSpeed}
          speed={speed}
          totalSpawned={totalSpawned}
          onSetSpawned={setTotalSpawned}
          onFillCanvas={handleFillCanvas}
        />
      )}
      {showAchievements && (
        <AchievementModal onClose={() => setShowAchievements(false)} unlockedIds={unlockedAchievements} theme={theme} />
      )}
      {showStats && (
        <StatsPanel
          onClose={() => setShowStats(false)} theme={theme}
          totalSpawned={totalSpawned} points={points}
          timePlayedSeconds={timePlayedSeconds} elementsUsed={elementsUsed}
          canvasCleared={canvasCleared} shopItemsBought={shopItemsBought}
          fps={fps} currentElement={selected}
          autoFarm={autoFarm} hasPremium={hasPremium} hasSuperPremium={hasSuperPremium}
        />
      )}
      {/* Achievement Notifications */}
      <div style={{ position:'fixed', bottom:'100px', right:'12px', zIndex:9999, display:'flex', flexDirection:'column', gap:'8px', pointerEvents:'auto' }}>
        {achievementNotifs.map((a, i) => (
          <AchievementNotification key={i} notif={{ id: i, achievement: a }} onDone={() => setAchievementNotifs(prev => prev.filter((_, j) => j !== i))} />
        ))}
      </div>
      {showElementSheet && (
        <ElementSheet open={showElementSheet} onClose={() => setShowElementSheet(false)}
          selected={selected} onSelect={handleSelectElement}
          activeCategory={activeCategory} onCategoryChange={setActiveCategory}
          ownedItems={ownedItems} onOpenShop={() => setShowShop(true)} theme={theme}
          hasPremium={hasPremium} />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showAutoFarm && (
        <AutoFarmModal
          isOpen={showAutoFarm}
          onClose={() => setShowAutoFarm(false)}
          theme={theme}
          autoFarm={autoFarm}
          autoFarmElement={autoFarmElement}
          autoFarmInterval={autoFarmInterval}
          hasPremium={hasPremium}
          hasSuperPremium={hasSuperPremium}
          points={points}
          totalSpawned={totalSpawned}
          onToggle={setAutoFarm}
          onElementChange={setAutoFarmElement}
          onIntervalChange={setAutoFarmIntervalState}
        />
      )}

      {/* ── HEADER ── */}
      <header style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 10px', background:theme.headerBg, borderBottom:`1px solid ${theme.border}66`, flexShrink:0, overflowX:'auto', WebkitOverflowScrolling:'touch' as any, scrollbarWidth:'none' as any, msOverflowStyle:'none' as any, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
          <span style={{ fontSize:'18px' }}>🌍</span>
          <span style={{ fontWeight:900, fontSize:'13px', whiteSpace:'nowrap', background:`linear-gradient(to right, ${theme.secondary}, ${theme.accent})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', display:'block' }}>SandBox World</span>
        </div>

        {/* Season indicator */}
        {seasonEnabled && (
          <div style={{ display:'flex', alignItems:'center', gap:'4px', background:`${curSeason.color}22`, border:`1px solid ${curSeason.color}55`, borderRadius:'8px', padding:'3px 8px', flexShrink:0 }}>
            <span style={{ fontSize:'12px' }}>{curSeason.emoji}</span>
            <span style={{ color:curSeason.color, fontSize:'10px', fontWeight:700, whiteSpace:'nowrap' }}>{curSeason.name}</span>
          </div>
        )}

        <div style={{ flexShrink:0, width:'12px' }}/>

        {/* FPS */}
        {showFPS && (
          <div style={{ background:'rgba(0,255,0,0.1)', border:'1px solid rgba(0,255,0,0.3)', borderRadius:'8px', padding:'3px 8px', flexShrink:0 }}>
            <span style={{ color:'#4ade80', fontWeight:700, fontSize:'10px', whiteSpace:'nowrap' }}>{fps}fps</span>
          </div>
        )}

        {/* Points */}
        <button onClick={() => setShowShop(true)}
          style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(234,179,8,0.15)', border:'1px solid rgba(234,179,8,0.4)', borderRadius:'10px', padding:'5px 10px', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}>
          <span style={{ fontSize:'14px' }}>🪙</span>
          <span style={{ color:'#fde047', fontWeight:900, fontSize:'13px' }}>{points}</span>
        </button>

        {/* Boost badge */}
        {activeBoost && (
          <div style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.4)', borderRadius:'8px', padding:'4px 8px', flexShrink:0 }}>
            <span style={{ color:'#4ade80', fontWeight:900, fontSize:'11px', whiteSpace:'nowrap' }}>⚡{activeBoost}</span>
            <span style={{ color:'#16a34a', fontSize:'10px', whiteSpace:'nowrap' }}>{boostTimeLeft}s</span>
          </div>
        )}

        {/* SuperPremium badge */}
        {hasSuperPremium && (
          <div style={{ background:'linear-gradient(90deg,rgba(6,182,212,0.2),rgba(168,85,247,0.2))', border:'1px solid rgba(168,85,247,0.5)', borderRadius:'8px', padding:'4px 8px', display:'flex', alignItems:'center', gap:'3px', flexShrink:0 }}>
            <span style={{ fontSize:'12px' }}>💎</span>
            <span style={{ color:'#c4b5fd', fontWeight:900, fontSize:'9px', whiteSpace:'nowrap' }}>SUPER</span>
          </div>
        )}
        {/* Premium badge */}
        {hasPremium && !hasSuperPremium && (
          <div style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:'8px', padding:'4px 8px', flexShrink:0 }}>
            <span style={{ fontSize:'12px' }}>👑</span>
          </div>
        )}

        {/* Speed — click ⚡ label 20x for admin panel */}
        <div style={{ display:'flex', alignItems:'center', background:`${theme.panelBg}`, border:`1px solid ${theme.border}55`, borderRadius:'10px', overflow:'hidden', flexShrink:0 }}>
          <button onClick={handleAdminTrigger} style={{ padding:'6px 8px', fontSize:'13px', background:'transparent', border:'none', cursor:'pointer', opacity:0.6, flexShrink:0 }} title="⚡">⚡</button>
          {SPEED_OPTIONS.map(s => {
            const locked = (s.isPremium && !hasPremium && !hasSuperPremium) || (s.isSuperPremium && !hasSuperPremium);
            const active = speed === s.value;
            return (
              <button key={s.value} onClick={() => !locked && handleSetSpeed(s.value)}
                title={locked ? (s.isSuperPremium ? '💎 SuperPremium only' : '👑 Premium only') : s.label}
                style={{ padding:'6px 9px', fontSize:'11px', fontWeight:900, position:'relative', border:'none', cursor: locked ? 'not-allowed' : 'pointer', transition:'all 0.15s', whiteSpace:'nowrap', flexShrink:0,
                  background: active ? theme.primary : 'transparent',
                  color: active ? '#fff' : locked ? '#4b5563' : '#9ca3af',
                }}>
                {s.label}
                {locked && <span style={{ position:'absolute', top:0, right:0, fontSize:'7px' }}>{s.isSuperPremium ? '💎' : '👑'}</span>}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <button onClick={() => setIsRunning(r => !r)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:`1px solid ${isRunning ? 'rgba(249,115,22,0.5)' : 'rgba(34,197,94,0.5)'}`, cursor:'pointer', background: isRunning ? 'rgba(249,115,22,0.15)' : 'rgba(34,197,94,0.15)', color: isRunning ? '#fb923c' : '#4ade80', flexShrink:0, whiteSpace:'nowrap' }}>
          {isRunning ? '⏸' : '▶️'}
        </button>
        <button onClick={handleClear}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(239,68,68,0.5)', cursor:'pointer', background:'rgba(239,68,68,0.15)', color:'#f87171', flexShrink:0 }}>
          🗑️
        </button>
        <button onClick={() => setShowSettings(true)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:`1px solid ${theme.border}66`, cursor:'pointer', background:`${theme.panelBg}`, color:theme.subtext, flexShrink:0 }}>
          ⚙️
        </button>
        <button onClick={() => setShowAutoFarm(true)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:`1px solid ${autoFarm ? 'rgba(34,197,94,0.6)' : 'rgba(34,197,94,0.3)'}`, cursor:'pointer', background: autoFarm ? 'rgba(34,197,94,0.25)' : 'rgba(34,197,94,0.1)', color: autoFarm ? '#4ade80' : '#86efac', display:'flex', alignItems:'center', gap:'3px', flexShrink:0, whiteSpace:'nowrap' }}>
          🤖{autoFarm && <span style={{ fontSize:'8px', fontWeight:900 }}>ON</span>}
        </button>
        <button onClick={() => setShowShop(true)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(234,179,8,0.4)', cursor:'pointer', background:'rgba(234,179,8,0.1)', color:'#fde047', flexShrink:0, whiteSpace:'nowrap' }}>
          🛍️
        </button>
        <button onClick={() => setShowTutorial(true)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:`1px solid ${theme.border}55`, cursor:'pointer', background:`${theme.panelBg}`, color:theme.subtext, flexShrink:0 }}>
          ❓
        </button>
        <button onClick={() => setShowAchievements(true)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(99,102,241,0.4)', cursor:'pointer', background:'rgba(99,102,241,0.15)', color:'#a5b4fc', flexShrink:0, whiteSpace:'nowrap' }}>
          🏆{unlockedAchievements.size > 0 && <span style={{ fontSize:'9px', marginLeft:'2px' }}>{unlockedAchievements.size}</span>}
        </button>
        <button onClick={() => setShowStats(true)}
          style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(34,211,238,0.4)', cursor:'pointer', background:'rgba(34,211,238,0.1)', color:'#67e8f9', flexShrink:0 }}>
          📊
        </button>

        {/* PWA Install button */}
        {canInstallPWA && !pwaInstalled && (
          <button onClick={handleInstallPWA}
            style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(34,197,94,0.5)', cursor:'pointer', background:'rgba(34,197,94,0.15)', color:'#4ade80', flexShrink:0, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'4px', animation:'pulse 2s infinite' }}>
            📲 Install App
          </button>
        )}
        {pwaInstalled && (
          <div style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.08)', color:'#4ade80', flexShrink:0, whiteSpace:'nowrap' }}>
            ✅ Installed
          </div>
        )}

        {/* Admin Basic button — shows when purchased from shop */}
        {hasAdminBasic && (
          <button onClick={() => setShowAdmin(true)}
            style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, border:'1px solid rgba(239,68,68,0.5)', cursor:'pointer', background:'rgba(239,68,68,0.15)', color:'#f87171', flexShrink:0, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'3px' }}>
            ⚙️🔐
          </button>
        )}
      </header>

      {/* ── MAIN ── */}
      <div style={{ display:'flex', flex:1, minHeight:0, overflow:'hidden' }}>

        {/* ── LEFT PANEL (Desktop) ── */}
        <aside style={{ display:'none', flexDirection:'column', width:'90px', background:theme.panelBg, borderRight:`1px solid ${theme.border}55`, flexShrink:0 }} className="md:flex md:flex-col">
          {/* Categories */}
          <div style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'8px', borderBottom:`1px solid ${theme.border}44` }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 8px', borderRadius:'8px', fontSize:'10px', fontWeight:700, border:`1px solid ${activeCategory === cat.id ? theme.primary : 'transparent'}`, cursor:'pointer', transition:'all 0.15s',
                  background: activeCategory === cat.id ? `${theme.primary}44` : 'transparent',
                  color: activeCategory === cat.id ? '#fff' : '#6b7280',
                }}>
                <span>{cat.label}</span>
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat.fullLabel}</span>
              </button>
            ))}
          </div>
          {/* Elements */}
          <div style={{ flex:1, overflowY:'auto', padding:'8px', display:'flex', flexDirection:'column', gap:'4px' }}>
            {(GROUPED_ELEMENTS[activeCategory] ?? []).map(type => {
              const info = ELEMENTS[type];
              const isSel = selected === type;
              const locked = isLocked(type);
              return (
                <button key={type} onClick={() => !locked && setSelected(type)}
                  title={locked ? '🔒 Beli di Shop' : info.description}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', padding:'8px 4px', borderRadius:'12px', border:`1px solid ${isSel ? ELEMENT_BG[type]+'aa' : 'transparent'}`, cursor: locked ? 'not-allowed' : 'pointer', transition:'all 0.15s', position:'relative',
                    background: isSel ? ELEMENT_BG[type]+'44' : 'transparent',
                    opacity: locked ? 0.4 : isSel ? 1 : 0.7,
                  }}>
                  <span style={{ fontSize:'20px', lineHeight:1 }}>{info.emoji}</span>
                  <span style={{ fontSize:'8px', fontWeight:700, color:'rgba(255,255,255,0.8)', textAlign:'center', lineHeight:1.2 }}>{info.label}</span>
                  {locked && <span style={{ position:'absolute', top:'2px', right:'2px', fontSize:'9px' }}>🔒</span>}
                </button>
              );
            })}
          </div>
          {/* Brush */}
          <div style={{ padding:'8px', borderTop:`1px solid ${theme.border}44` }}>
            <p style={{ color:'#4b5563', fontSize:'9px', fontWeight:700, textAlign:'center', textTransform:'uppercase', marginBottom:'6px' }}>Brush</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px' }}>
              {BRUSH_SIZES.map(b => (
                <button key={b.value} onClick={() => setBrushSize(b.value)}
                  style={{ padding:'4px', borderRadius:'6px', fontSize:'10px', fontWeight:900, border:'none', cursor:'pointer', transition:'all 0.15s',
                    background: brushSize === b.value ? theme.primary : 'rgba(255,255,255,0.06)',
                    color: brushSize === b.value ? '#fff' : '#9ca3af',
                  }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── CANVAS ── */}
        <main style={{ flex:1, position:'relative', minWidth:0, minHeight:0, background:'#0f0f1a' }}>
          <GameCanvas
            grid={grid} setGrid={handleSetGrid}
            selectedElement={selected} brushSize={brushSize}
            isRunning={isRunning} speed={speed}
            onBlockSpawned={handleBlockSpawned}
            onFpsUpdate={handleFpsUpdate}
            showFPS={showFPS}
            fillRef={handleFillRef}
            canvasEffectRef={canvasEffectRef}
            screenshotRef={screenshotRef}
            isModalOpen={showAdmin || showShop || showSettings || showTutorial || showAutoFarm || showElementSheet}
          />

          {/* Season banner on canvas */}
          {seasonEnabled && <SeasonBanner season={currentSeason} timeLeft={seasonTimeLeft} theme={theme} />}

          {/* Speed overlay */}
          {speed !== 1 && (
            <div style={{ position:'absolute', top:'8px', left:'8px', pointerEvents:'none', background:'rgba(0,0,0,0.7)', border:`1px solid ${theme.primary}66`, borderRadius:'8px', padding:'3px 10px' }}>
              <span style={{ color:theme.accent, fontWeight:900, fontSize:'11px' }}>⚡ {SPEED_OPTIONS.find(s=>s.value===speed)?.label}</span>
            </div>
          )}

          {/* Status dot */}
          <div style={{ position:'absolute', top:'8px', right:'8px', pointerEvents:'none' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: isRunning ? '#4ade80' : '#fbbf24' }}/>
          </div>

          {/* Selected element */}
          <div style={{ position:'absolute', bottom:'8px', left:'8px', pointerEvents:'none', background:'rgba(0,0,0,0.7)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'4px 10px', display:'flex', alignItems:'center', gap:'6px' }}>
            <span style={{ fontSize:'16px' }}>{selectedInfo.emoji}</span>
            <span style={{ color:'#fff', fontSize:'11px', fontWeight:700 }}>{selectedInfo.label}</span>
          </div>

          {/* Spawn count */}
          <div style={{ position:'absolute', bottom:'8px', right:'8px', pointerEvents:'none' }}>
            <span style={{ color:'#374151', fontSize:'10px' }}>🪙 {totalSpawned} spawned</span>
          </div>
        </main>

        {/* ── RIGHT PANEL (Desktop large) ── */}
        <aside style={{ display:'none', flexDirection:'column', width:'130px', background:theme.panelBg, borderLeft:`1px solid ${theme.border}55`, flexShrink:0, overflowY:'auto' }} className="lg:flex lg:flex-col">
          {/* Selected info */}
          <div style={{ padding:'12px', borderBottom:`1px solid ${theme.border}44`, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'36px' }}>{selectedInfo.emoji}</span>
            <p style={{ color:'#fff', fontSize:'12px', fontWeight:900, textAlign:'center', margin:0 }}>{selectedInfo.label}</p>
            <p style={{ color:'#6b7280', fontSize:'9px', textAlign:'center', lineHeight:1.4, margin:0 }}>{selectedInfo.description}</p>
          </div>

          {/* Season control */}
          <div style={{ margin:'10px', background:seasonEnabled ? `${curSeason.color}22` : 'rgba(255,255,255,0.03)', border:`1px solid ${seasonEnabled ? curSeason.color+'44' : 'rgba(255,255,255,0.06)'}`, borderRadius:'12px', padding:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ color: seasonEnabled ? curSeason.color : '#6b7280', fontSize:'10px', fontWeight:700 }}>🌸 Musim</span>
              <button onClick={() => setSeasonEnabled(e => !e)}
                style={{ width:'30px', height:'16px', borderRadius:'99px', border:'none', cursor:'pointer', position:'relative', background: seasonEnabled ? curSeason.color : '#374151', transition:'all 0.3s' }}>
                <div style={{ position:'absolute', top:'2px', left: seasonEnabled ? '14px' : '2px', width:'12px', height:'12px', borderRadius:'50%', background:'white', transition:'left 0.3s' }}/>
              </button>
            </div>
            {seasonEnabled && (
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ fontSize:'16px' }}>{curSeason.emoji}</span>
                <div>
                  <p style={{ color:curSeason.color, fontWeight:800, fontSize:'10px', margin:0 }}>{curSeason.name}</p>
                  <p style={{ color:'#6b7280', fontSize:'9px', margin:'1px 0 0' }}>{seasonTimeLeft}s tersisa</p>
                </div>
              </div>
            )}
          </div>

          {/* Shop shortcut */}
          <button onClick={() => setShowShop(true)}
            style={{ margin:'0 10px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', background:'rgba(234,179,8,0.1)', border:'1px solid rgba(234,179,8,0.3)', borderRadius:'12px', padding:'10px', cursor:'pointer', transition:'all 0.2s' }}>
            <span style={{ fontSize:'22px' }}>🛍️</span>
            <p style={{ color:'#fde047', fontWeight:900, fontSize:'11px', margin:0 }}>Shop</p>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <span style={{ color:'#fbbf24', fontSize:'13px' }}>🪙</span>
              <span style={{ color:'#fde047', fontWeight:900, fontSize:'14px' }}>{points}</span>
            </div>
          </button>

          {/* Premium */}
          {!hasPremium ? (
            <button onClick={() => setShowShop(true)}
              style={{ margin:'0 10px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'12px', padding:'10px', cursor:'pointer', transition:'all 0.2s' }}>
              <span style={{ fontSize:'22px' }}>👑</span>
              <p style={{ color:'#fbbf24', fontWeight:900, fontSize:'11px', margin:0 }}>Premium</p>
              <p style={{ color:'#6b7280', fontSize:'9px', margin:0 }}>🪙 310 pts</p>
            </button>
          ) : (
            <div style={{ margin:'0 10px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:'12px', padding:'10px' }}>
              <span style={{ fontSize:'22px' }}>👑</span>
              <p style={{ color:'#fbbf24', fontWeight:900, fontSize:'11px', margin:0 }}>Active!</p>
            </div>
          )}

          {/* Settings shortcut */}
          <button onClick={() => setShowSettings(true)}
            style={{ margin:'0 10px 10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', background:'rgba(255,255,255,0.04)', border:`1px solid ${theme.border}44`, borderRadius:'12px', padding:'8px', cursor:'pointer' }}>
            <span style={{ fontSize:'16px' }}>⚙️</span>
            <span style={{ color:'#9ca3af', fontSize:'11px', fontWeight:700 }}>Settings</span>
          </button>

          {/* Tips */}
          <div style={{ padding:'0 10px 12px' }}>
            <p style={{ color:'#374151', fontSize:'9px', fontWeight:700, textTransform:'uppercase', textAlign:'center', marginBottom:'6px' }}>Tips</p>
            {['🪙 10 blok = 1 poin','🐾 Makhluk hidup bergerak!','🌸 Aktifkan musim di Settings','🕳️ Void serap segalanya','🔮 Clone duplikat elemen','👑 310pts = Premium'].map((t,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'6px 8px', border:'1px solid rgba(255,255,255,0.04)', marginBottom:'4px' }}>
                <p style={{ color:'#4b5563', fontSize:'9px', margin:0 }}>{t}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ── MOBILE BOTTOM BAR ── */}
      <div style={{ display:'flex', flexDirection:'column', background:theme.headerBg, borderTop:`1px solid ${theme.border}66`, flexShrink:0 }} className="md:hidden">
        {/* Speed row - always visible on mobile */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'5px 10px 3px', borderBottom:`1px solid ${theme.border}22` }}>
          <span onClick={handleAdminTrigger} style={{ color:'#6b7280', fontSize:'10px', fontWeight:700, marginRight:'2px', cursor:'pointer', userSelect:'none' }}>⚡</span>
          {SPEED_OPTIONS.map(s => {
            const locked = (s.isPremium && !hasPremium && !hasSuperPremium) || (s.isSuperPremium && !hasSuperPremium);
            const active = speed === s.value;
            return (
              <button key={s.value} onClick={() => !locked && setSpeed(s.value)}
                style={{ padding:'4px 10px', fontSize:'11px', fontWeight:900, borderRadius:'8px', border:'none', cursor: locked ? 'not-allowed' : 'pointer', position:'relative',
                  background: active ? theme.primary : 'rgba(255,255,255,0.07)',
                  color: active ? '#fff' : locked ? '#374151' : '#9ca3af',
                }}>
                {s.label}
                {locked && <span style={{ position:'absolute', top:0, right:0, fontSize:'7px' }}>{s.isSuperPremium ? '💎' : '👑'}</span>}
              </button>
            );
          })}
        </div>

        {/* Main controls row */}
        <div style={{ display:'flex', alignItems:'center', padding:'5px 8px', gap:'6px' }}>
          {/* Element picker */}
          <button onClick={() => setShowElementSheet(true)}
            style={{ display:'flex', alignItems:'center', gap:'8px', flex:1, background:ELEMENT_BG[selected]+'22', border:`1px solid ${ELEMENT_BG[selected]}55`, borderRadius:'12px', padding:'7px 10px', cursor:'pointer' }}>
            <span style={{ fontSize:'22px' }}>{selectedInfo.emoji}</span>
            <div style={{ flex:1, textAlign:'left' }}>
              <p style={{ color:'#fff', fontWeight:900, fontSize:'12px', margin:0 }}>{selectedInfo.label}</p>
              <p style={{ color:'#6b7280', fontSize:'9px', margin:0 }}>Tap ganti ▲</p>
            </div>
          </button>

          {/* Brush */}
          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
            <p style={{ color:'#4b5563', fontSize:'9px', textAlign:'center', fontWeight:700, margin:0 }}>Brush</p>
            <div style={{ display:'flex', gap:'3px' }}>
              {BRUSH_SIZES.map(b => (
                <button key={b.value} onClick={() => setBrushSize(b.value)}
                  style={{ width:'28px', height:'28px', borderRadius:'7px', fontSize:'10px', fontWeight:900, border:'none', cursor:'pointer',
                    background: brushSize === b.value ? theme.primary : 'rgba(255,255,255,0.08)',
                    color: brushSize === b.value ? '#fff' : '#9ca3af',
                  }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Play/Pause + Clear */}
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            <button onClick={() => setIsRunning(r => !r)}
              style={{ width:'40px', height:'28px', borderRadius:'7px', fontSize:'14px', border:`1px solid ${isRunning ? 'rgba(249,115,22,0.4)' : 'rgba(34,197,94,0.4)'}`, cursor:'pointer', background: isRunning ? 'rgba(249,115,22,0.15)' : 'rgba(34,197,94,0.15)', color: isRunning ? '#fb923c' : '#4ade80' }}>
              {isRunning ? '⏸' : '▶️'}
            </button>
            <button onClick={handleClear}
              style={{ width:'40px', height:'28px', borderRadius:'7px', fontSize:'12px', border:'1px solid rgba(239,68,68,0.4)', cursor:'pointer', background:'rgba(239,68,68,0.15)', color:'#f87171' }}>
              🗑️
            </button>
          </div>

          {/* Shop + Settings + AutoFarm */}
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            <button onClick={() => setShowShop(true)}
              style={{ width:'40px', height:'28px', borderRadius:'7px', fontSize:'14px', fontWeight:700, background:'rgba(234,179,8,0.15)', border:'1px solid rgba(234,179,8,0.4)', color:'#fde047', cursor:'pointer' }}>
              🛍️
            </button>
            <button onClick={() => setShowSettings(true)}
              style={{ width:'40px', height:'28px', borderRadius:'7px', fontSize:'14px', fontWeight:700, background:`${theme.panelBg}`, border:`1px solid ${theme.border}55`, color:theme.subtext, cursor:'pointer' }}>
              ⚙️
            </button>
          </div>
          {/* Auto Farm button */}
          <button onClick={() => setShowAutoFarm(true)}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px', width:'44px', height:'59px', borderRadius:'10px', fontSize:'18px', fontWeight:700, border:`1px solid ${autoFarm ? 'rgba(34,197,94,0.6)' : 'rgba(34,197,94,0.3)'}`, cursor:'pointer', background: autoFarm ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.08)', color:'#4ade80', position:'relative' }}>
            🤖
            {autoFarm && (
              <span style={{ fontSize:'8px', fontWeight:900, color:'#4ade80', background:'rgba(34,197,94,0.3)', borderRadius:'4px', padding:'1px 3px' }}>ON</span>
            )}
          </button>

          {/* Screenshot button mobile */}
          {hasScreenshot && (
            <button onClick={handleScreenshot}
              style={{ width:'40px', height:'59px', borderRadius:'7px', fontSize:'18px', fontWeight:700, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.4)', color:'#a5b4fc', cursor:'pointer' }}
              title="Screenshot">
              📸
            </button>
          )}

          {/* Admin Basic button mobile */}
          {hasAdminBasic && (
            <button onClick={() => setShowAdmin(true)}
              style={{ width:'44px', height:'59px', borderRadius:'10px', fontSize:'16px', fontWeight:700, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.5)', color:'#f87171', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px' }}
              title="Admin Panel">
              <span>⚙️</span>
              <span style={{ fontSize:'8px', fontWeight:900, color:'#fca5a5' }}>ADMIN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
