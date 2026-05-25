// Responsive grid size based on device
const isMobile = window.innerWidth < 768;

export const BASE_CELL_SIZE = isMobile ? 6 : 5;
export const BASE_COLS = isMobile ? 60 : 120;
export const BASE_ROWS = isMobile ? 90 : 100;

// Dynamic map size — can be changed at runtime
export type MapSizeId = 'normal' | 'large' | 'super' | 'superpremium';

export interface MapSizeConfig {
  id: MapSizeId;
  label: string;
  emoji: string;
  colsMult: number;
  rowsMult: number;
  cellDiv: number; // divide cell size by this
  requiresSuperPremium?: boolean;
}

export const MAP_SIZES: MapSizeConfig[] = [
  { id: 'normal',       label: 'Normal',          emoji: '🗺️', colsMult: 1,   rowsMult: 1,   cellDiv: 1   },
  { id: 'large',        label: 'Besar',            emoji: '🌏', colsMult: 1.5, rowsMult: 1.5, cellDiv: 1.2 },
  { id: 'super',        label: 'Super Gede',       emoji: '🌌', colsMult: 2.2, rowsMult: 2,   cellDiv: 1.5 },
  { id: 'superpremium', label: 'SuperPremium Map', emoji: '🌠', colsMult: 4,   rowsMult: 3.5, cellDiv: 2,  requiresSuperPremium: true },
];

// These are set dynamically — default to normal
let _mapSize: MapSizeConfig = MAP_SIZES[0];

export function setMapSize(s: MapSizeConfig) { _mapSize = s; }
export function getMapSize(): MapSizeConfig { return _mapSize; }

export function getCellSize() { return Math.max(3, Math.floor(BASE_CELL_SIZE / _mapSize.cellDiv)); }
export function getCOLS()     { return Math.floor(BASE_COLS * _mapSize.colsMult); }
export function getROWS()     { return Math.floor(BASE_ROWS * _mapSize.rowsMult); }

// Legacy static exports (used internally — will use dynamic values)
export let CELL_SIZE = getCellSize();
export let COLS = getCOLS();
export let ROWS = getROWS();

export function refreshDimensions() {
  CELL_SIZE = getCellSize();
  COLS = getCOLS();
  ROWS = getROWS();
}

export type ElementType =
  | 'empty'
  | 'sand'
  | 'water'
  | 'stone'
  | 'fire'
  | 'wood'
  | 'lava'
  | 'smoke'
  | 'ice'
  | 'plant'
  | 'explosion'
  | 'oil'
  | 'acid'
  // EARTH
  | 'mud'
  | 'steam'
  | 'gunpowder'
  | 'glass'
  | 'salt'
  | 'saltwater'
  | 'snow'
  | 'cloud'
  | 'lightning'
  | 'metal'
  | 'rust'
  | 'virus'
  | 'crystal'
  | 'honey'
  | 'bubble'
  | 'concrete'
  | 'void'
  | 'clone'
  | 'gasoline'
  | 'leaf'
  // LIVING CREATURES (free)
  | 'ant'
  | 'fish'
  | 'bird'
  | 'worm'
  | 'frog'
  | 'crab'
  | 'bee'
  | 'mushroom'
  // LIVING CREATURES (shop)
  | 'babydragon'
  | 'unicorn'
  | 'ghost'
  | 'robot'
  | 'alien'
  | 'shark'
  | 'cat'
  | 'spider'
  | 'penguin'
  | 'snake'
  | 'butterfly'
  | 'phoenix'
  | 'whale'
  | 'dinosaur'
  | 'demon'
  // SHOP ELEMENTS
  | 'antimatter'
  | 'plasma'
  | 'magma'
  | 'blackhole'
  | 'rainbow'
  | 'dragonfire'
  | 'timesand'
  | 'antigravity'
  // NEW SHOP ELEMENTS
  | 'meteor'
  | 'tornado'
  | 'electricity'
  | 'poison'
  | 'magnet'
  | 'diamond'
  // NEW SHOP ELEMENTS
  | 'quicksand'
  | 'superlava'
  | 'holywater'
  | 'bluefire'
  | 'c4'
  | 'nuclearwaste'
  | 'wind'
  | 'seed'
  | 'fog'
  | 'web'
  | 'potion'
  | 'tar'
  | 'obsidian'
  | 'tidalwave'
  | 'stardust'
  | 'cryo'
  | 'trident'
  | 'nebula'
  | 'mindblow'
  | 'party'
  // NEW SHOP CREATURES
  | 'wolf'
  | 'lion'
  | 'octopus'
  | 'eagle'
  | 'turtle'
  | 'rabbit'
  | 'bear'
  | 'jellyfish'
  | 'kingcrab'
  | 'queenbee'
  | 'elderdragon'
  | 'angel'
  | 'kraken'
  | 'titan'
  | 'sandgod'
  // MISSING SHOP ELEMENTS
  | 'nuke'
  | 'slime'
  | 'soapbubble'
  | 'cheese'
  | 'glue'
  | 'prism'
  | 'rubber'
  | 'mirror'
  | 'portal'
  | 'warp'
  | 'darkmatter'
  | 'thunderstorm'
  | 'toxicmud'
  | 'dryice'
  | 'gravitywell'
  | 'colorbomb'
  | 'stormcloud'
  // NEW FREE ELEMENTS — Basic
  | 'gravel'
  | 'charcoal'
  | 'chalk'
  | 'bedrock'
  | 'mercury'
  | 'gel'
  | 'glue2'
  | 'mist'
  | 'spark'
  | 'whirlwind'
  | 'grass'
  | 'wheat'
  | 'cactus'
  | 'fungi'
  | 'firework'
  | 'magicfire'
  | 'plasma2'
  | 'frostfire'
  | 'swamp'
  | 'coral'
  | 'quickclay'
  | 'lavarock'
  | 'ember'
  | 'ash'
  | 'ironore'
  | 'goldore'
  | 'marble'
  | 'sulfur'
  | 'nitroglycerin'
  | 'wax'
  | 'cotton'
  | 'rope'
  | 'paper'
  | 'glass2'
  | 'sponge'
  | 'pumice'
  // AUTO ELEMENTS
  | 'autowater'
  | 'autosand'
  | 'autofire'
  | 'autolava'
  | 'autosnow'
  | 'autosteam'
  | 'autoplant'
  | 'autooil'
  | 'autoacid'
  | 'autospark'
  | 'autocloud'
  | 'autowind'
  | 'autonuclear'
  | 'autodark'
  | 'autoparty'
  | 'automud'
  | 'autoice'
  | 'autovirus'
  | 'autosmoke'
  | 'autobluefire';

export interface Element {
  type: ElementType;
  color: number;
  updated?: boolean;
  life?: number;
  meta?: number;
}

export const ELEMENTS: Record<ElementType, { label: string; emoji: string; description: string; rgb: [number,number,number]; category: string }> = {
  // === BASIC ===
  empty:       { label: 'Eraser',    emoji: '🧹', description: 'Hapus elemen',              rgb: [15,15,26],      category: 'basic' },
  sand:        { label: 'Sand',      emoji: '🏖️', description: 'Pasir yang jatuh',          rgb: [226,201,126],   category: 'basic' },
  water:       { label: 'Water',     emoji: '💧', description: 'Air yang mengalir',          rgb: [58,158,255],    category: 'basic' },
  stone:       { label: 'Stone',     emoji: '🪨', description: 'Batu solid',                rgb: [122,122,138],   category: 'basic' },
  fire:        { label: 'Fire',      emoji: '🔥', description: 'Api yang menyebar',          rgb: [255,69,0],      category: 'basic' },
  wood:        { label: 'Wood',      emoji: '🪵', description: 'Kayu yang bisa terbakar',    rgb: [139,94,60],     category: 'basic' },
  lava:        { label: 'Lava',      emoji: '🌋', description: 'Lava panas mengalir',        rgb: [255,106,0],     category: 'basic' },
  smoke:       { label: 'Smoke',     emoji: '💨', description: 'Asap yang naik',             rgb: [136,136,153],   category: 'basic' },
  ice:         { label: 'Ice',       emoji: '🧊', description: 'Es yang beku',               rgb: [168,216,234],   category: 'basic' },
  plant:       { label: 'Plant',     emoji: '🌿', description: 'Tanaman yang tumbuh',        rgb: [46,204,64],     category: 'basic' },
  explosion:   { label: 'Bomb',      emoji: '💣', description: 'Ledakan dahsyat!',           rgb: [255,221,0],     category: 'basic' },
  oil:         { label: 'Oil',       emoji: '🛢️', description: 'Minyak yang terbakar',       rgb: [90,62,27],      category: 'basic' },
  acid:        { label: 'Acid',      emoji: '🧪', description: 'Asam yang merusak',          rgb: [57,255,20],     category: 'basic' },

  // === EARTH ===
  mud:         { label: 'Mud',       emoji: '🟤', description: 'Lumpur lembek',              rgb: [101,67,33],     category: 'earth' },
  glass:       { label: 'Glass',     emoji: '🪟', description: 'Kaca dari pasir+api',        rgb: [190,230,255],   category: 'earth' },
  concrete:    { label: 'Concrete',  emoji: '🧱', description: 'Beton super solid',          rgb: [180,180,180],   category: 'earth' },
  crystal:     { label: 'Crystal',   emoji: '💎', description: 'Kristal tumbuh dari air',    rgb: [150,80,255],    category: 'earth' },
  rust:        { label: 'Rust',      emoji: '🦺', description: 'Karat dari metal+air',       rgb: [178,73,23],     category: 'earth' },

  // === WEATHER ===
  snow:        { label: 'Snow',      emoji: '❄️', description: 'Salju ringan jatuh',          rgb: [220,240,255],   category: 'weather' },
  cloud:       { label: 'Cloud',     emoji: '☁️', description: 'Awan hujan',                 rgb: [200,210,220],   category: 'weather' },
  steam:       { label: 'Steam',     emoji: '♨️', description: 'Uap panas naik',             rgb: [180,200,220],   category: 'weather' },
  lightning:   { label: 'Lightning', emoji: '⚡', description: 'Petir menyambar!',            rgb: [255,255,100],   category: 'weather' },
  bubble:      { label: 'Bubble',    emoji: '🫧', description: 'Gelembung naik',              rgb: [100,200,255],   category: 'weather' },

  // === SPECIAL ===
  metal:       { label: 'Metal',     emoji: '⚙️', description: 'Logam keras',                rgb: [192,192,192],   category: 'special' },
  gunpowder:   { label: 'GunPowder', emoji: '💥', description: 'Bubuk mesiu!',               rgb: [60,60,60],      category: 'special' },
  salt:        { label: 'Salt',      emoji: '🧂', description: 'Garam yang meleleh di air',  rgb: [240,240,245],   category: 'special' },
  saltwater:   { label: 'SaltWater', emoji: '🌊', description: 'Air garam',                  rgb: [30,130,220],    category: 'special' },
  honey:       { label: 'Honey',     emoji: '🍯', description: 'Madu kental lambat',          rgb: [220,150,30],    category: 'special' },
  gasoline:    { label: 'Gasoline',  emoji: '⛽', description: 'Bensin super mudah terbakar', rgb: [180,200,120],   category: 'special' },

  // === EXPERIMENTAL ===
  virus:       { label: 'Virus',     emoji: '🦠', description: 'Virus menginfeksi segalanya!',rgb: [200,50,200],   category: 'experimental' },
  void:        { label: 'Void',      emoji: '🕳️', description: 'Lubang hitam menyerap semua!',rgb: [5,0,15],      category: 'experimental' },
  clone:       { label: 'Clone',     emoji: '🔮', description: 'Kloning elemen sekitarnya!', rgb: [50,255,200],    category: 'experimental' },
  leaf:        { label: 'Leaf',      emoji: '🍂', description: 'Daun yang jatuh terbakar',   rgb: [180,120,30],    category: 'experimental' },

  // === LIVING CREATURES ===
  ant:         { label: 'Ant',       emoji: '🐜', description: 'Semut bergerak ke kiri-kanan, mati kena api!', rgb: [60,30,10],     category: 'life' },
  fish:        { label: 'Fish',      emoji: '🐟', description: 'Ikan berenang di dalam air!',                  rgb: [30,120,255],   category: 'life' },
  bird:        { label: 'Bird',      emoji: '🐦', description: 'Burung terbang ke atas & melayang!',           rgb: [255,200,50],   category: 'life' },
  worm:        { label: 'Worm',      emoji: '🪱', description: 'Cacing menggali tanah & pasir!',               rgb: [180,80,80],    category: 'life' },
  frog:        { label: 'Frog',      emoji: '🐸', description: 'Katak melompat-lompat, suka air!',             rgb: [50,180,50],    category: 'life' },
  crab:        { label: 'Crab',      emoji: '🦀', description: 'Kepiting bergerak menyamping di pasir!',       rgb: [220,60,30],    category: 'life' },
  bee:         { label: 'Bee',       emoji: '🐝', description: 'Lebah terbang bebas & menghasilkan madu!',     rgb: [240,180,0],    category: 'life' },
  mushroom:    { label: 'Mushroom',  emoji: '🍄', description: 'Jamur tumbuh di tanah lembab!',                rgb: [200,80,40],    category: 'life' },

  // === SHOP CREATURES ===
  babydragon:  { label: 'Baby Dragon', emoji: '🦕', description: 'Naga kecil mengeluarkan api kecil!',           rgb: [255,80,20],    category: 'life' },
  unicorn:     { label: 'Unicorn',     emoji: '🦄', description: 'Unicorn meninggalkan jejak pelangi!',           rgb: [255,150,220],  category: 'life' },
  ghost:       { label: 'Ghost',       emoji: '👻', description: 'Hantu melewati semua material!',                rgb: [200,210,230],  category: 'life' },
  robot:       { label: 'Robot',       emoji: '🤖', description: 'Robot mengumpulkan logam sekitarnya!',          rgb: [150,170,190],  category: 'life' },
  alien:       { label: 'Alien',       emoji: '👽', description: 'Alien mengubah elemen sekitar jadi aneh!',      rgb: [100,220,100],  category: 'life' },
  shark:       { label: 'Shark',       emoji: '🦈', description: 'Hiu berenang di air & menyerang!',             rgb: [80,120,180],   category: 'life' },
  cat:         { label: 'Cat',         emoji: '🐱', description: 'Kucing imut melompat-lompat!',                  rgb: [220,170,120],  category: 'life' },
  spider:      { label: 'Spider',      emoji: '🕷️', description: 'Laba-laba membuat jaring menjebak partikel!',  rgb: [60,60,80],     category: 'life' },
  penguin:     { label: 'Penguin',     emoji: '🐧', description: 'Penguin membekukan air & meluncur!',            rgb: [50,60,80],     category: 'life' },
  snake:       { label: 'Snake',       emoji: '🐍', description: 'Ular meliuk & menelan partikel kecil!',        rgb: [60,150,60],    category: 'life' },
  butterfly:   { label: 'Butterfly',  emoji: '🦋', description: 'Kupu-kupu terbang meninggalkan jejak bunga!',  rgb: [200,100,255],  category: 'life' },
  phoenix:     { label: 'Phoenix',     emoji: '🦅', description: 'Phoenix terbang meninggalkan api & terlahir!', rgb: [255,160,0],    category: 'life' },
  whale:       { label: 'Whale',       emoji: '🐳', description: 'Paus berenang & menyemprot air ke atas!',      rgb: [60,100,200],   category: 'life' },
  dinosaur:    { label: 'Dinosaur',   emoji: '🦖', description: 'Dino besar menghancurkan semua di jalurnya!',  rgb: [80,180,60],    category: 'life' },
  demon:       { label: 'Demon',       emoji: '😈', description: 'Iblis mengubah semua elemen jadi lava & api!', rgb: [180,20,20],    category: 'life' },

  // === SHOP ELEMENTS ===
  antimatter:  { label: 'Antimatter',emoji: '🌀', description: 'Menghancurkan semua dalam radius besar!',      rgb: [140,0,255],    category: 'shop' },
  plasma:      { label: 'Plasma',    emoji: '🔵', description: 'Plasma super panas, bakar semua!',             rgb: [0,200,255],    category: 'shop' },
  magma:       { label: 'Magma',     emoji: '🟠', description: 'Magma lebih pekat & merusak dari lava!',       rgb: [220,60,0],     category: 'shop' },
  blackhole:   { label: 'Black Hole',emoji: '⚫', description: 'Menarik & menelan semua partikel!',            rgb: [10,0,20],      category: 'shop' },
  rainbow:     { label: 'Rainbow',   emoji: '🌈', description: 'Partikel warna-warni berubah terus!',          rgb: [255,100,200],  category: 'shop' },
  dragonfire:  { label: 'Dragon Fire',emoji:'🐉', description: 'Api naga super kuat & menyebar luas!',        rgb: [255,50,0],     category: 'shop' },
  timesand:    { label: 'Time Sand', emoji: '⏳', description: 'Pasir waktu — membekukan semua!',              rgb: [200,180,50],   category: 'shop' },
  antigravity: { label: 'Anti-Grav', emoji: '🪐', description: 'Membuat partikel melayang ke atas!',          rgb: [100,100,255],  category: 'shop' },
  meteor:      { label: 'Meteor',    emoji: '☄️', description: 'Meteorit jatuh dan meledak besar!',           rgb: [200,120,50],   category: 'shop' },
  tornado:     { label: 'Tornado',   emoji: '🌪️', description: 'Angin puyuh menyedot semua partikel!',       rgb: [150,200,220],  category: 'shop' },
  electricity: { label: 'Electric',  emoji: '⚡', description: 'Listrik menjalar ke semua konduktor!',        rgb: [255,255,0],    category: 'shop' },
  poison:      { label: 'Poison',    emoji: '☠️', description: 'Racun mematikan semua makhluk hidup!',        rgb: [100,200,50],   category: 'shop' },
  magnet:      { label: 'Magnet',    emoji: '🧲', description: 'Menarik semua partikel logam ke sini!',       rgb: [200,50,50],    category: 'shop' },
  diamond:     { label: 'Diamond',   emoji: '💠', description: 'Diamond super keras, tak bisa dihancurkan!',  rgb: [150,220,255],  category: 'shop' },

  // === NEW SHOP ELEMENTS ===
  quicksand:   { label: 'Quicksand', emoji: '🌀', description: 'Pasir hisap — menarik semua ke bawah!',         rgb: [180,140,60],   category: 'shop' },
  superlava:   { label: 'Super Lava',emoji: '🔴', description: 'Lava 3x lebih panas & merusak!',               rgb: [255,30,0],     category: 'shop' },
  holywater:   { label: 'Holy Water',emoji: '✨', description: 'Air suci — hancurkan api, sembuhkan virus!',   rgb: [200,240,255],  category: 'shop' },
  bluefire:    { label: 'Blue Fire', emoji: '🔵', description: 'Api biru yang menyebar super cepat!',           rgb: [0,100,255],    category: 'shop' },
  c4:          { label: 'C4',        emoji: '💥', description: 'Ledakan DAHSYAT radius 15 cell!',              rgb: [220,40,40],    category: 'shop' },
  nuclearwaste:{ label: 'Nuclear',   emoji: '☢️', description: 'Limbah nuklir — infeksi semua partikel!',     rgb: [100,220,30],   category: 'shop' },
  wind:        { label: 'Wind',      emoji: '🌬️', description: 'Angin tiup partikel ringan ke kanan!',        rgb: [200,230,255],  category: 'shop' },
  seed:        { label: 'Seed',      emoji: '🌱', description: 'Benih tumbuh jadi tanaman kena air!',          rgb: [80,160,40],    category: 'shop' },
  fog:         { label: 'Fog',       emoji: '🌫️', description: 'Kabut melayang & sembunyikan partikel!',      rgb: [180,190,200],  category: 'shop' },
  web:         { label: 'Web',       emoji: '🕸️', description: 'Jaring laba-laba — perangkap partikel!',      rgb: [220,220,230],  category: 'shop' },
  potion:      { label: 'Potion',    emoji: '🍵', description: 'Ramuan ajaib ubah partikel jadi random!',     rgb: [180,50,220],   category: 'shop' },
  tar:         { label: 'Tar',       emoji: '⚫', description: 'Tar kental — mengalir lambat & lengket!',      rgb: [30,25,20],     category: 'shop' },
  obsidian:    { label: 'Obsidian',  emoji: '🖤', description: 'Super solid! Hanya bisa hancur oleh C4!',      rgb: [20,10,30],     category: 'shop' },
  tidalwave:   { label: 'Tidal Wave',emoji: '🌊', description: 'Gelombang besar menyapu ke kanan!',            rgb: [0,80,200],     category: 'shop' },
  stardust:    { label: 'Star Dust', emoji: '⭐', description: 'Debu bintang — ubah pasir jadi crystal!',     rgb: [255,220,100],  category: 'shop' },
  cryo:        { label: 'Cryo',      emoji: '❄️', description: 'Bekukan SEMUA dalam radius besar!',            rgb: [100,200,255],  category: 'shop' },
  trident:     { label: 'Trident',   emoji: '🔱', description: 'Meledak + spawn air + lightning!',             rgb: [50,150,255],   category: 'shop' },
  nebula:      { label: 'Nebula',    emoji: '🌌', description: 'Teleport partikel ke posisi random!',          rgb: [120,30,180],   category: 'shop' },
  mindblow:    { label: 'Mind Blow', emoji: '🤯', description: 'Ledakan chaos — hancur & spawn random!',       rgb: [255,50,200],   category: 'shop' },
  party:       { label: 'Party',     emoji: '🎉', description: 'Warna-warni pelangi menyebar terus!',          rgb: [255,100,100],  category: 'shop' },

  // === NEW SHOP CREATURES ===
  wolf:        { label: 'Wolf',      emoji: '🐺', description: 'Serigala berlari cepat & melompat tinggi!',   rgb: [120,110,100],  category: 'life' },
  lion:        { label: 'Lion',      emoji: '🦁', description: 'Singa berjalan gagah & kuat!',               rgb: [210,170,80],   category: 'life' },
  octopus:     { label: 'Octopus',   emoji: '🐙', description: 'Gurita berenang 8 arah di dalam air!',       rgb: [180,80,160],   category: 'life' },
  eagle:       { label: 'Eagle',     emoji: '🦅', description: 'Elang terbang cepat diagonal di udara!',     rgb: [160,120,60],   category: 'life' },
  turtle:      { label: 'Turtle',    emoji: '🐢', description: 'Kura-kura berjalan sangat lambat!',           rgb: [60,140,60],    category: 'life' },
  rabbit:      { label: 'Rabbit',    emoji: '🐰', description: 'Kelinci melompat-lompat cepat!',             rgb: [230,210,200],  category: 'life' },
  bear:        { label: 'Bear',      emoji: '🐻', description: 'Beruang besar berjalan pelan & kuat!',       rgb: [120,80,40],    category: 'life' },
  jellyfish:   { label: 'Jellyfish', emoji: '🪼', description: 'Ubur-ubur naik-turun di dalam air!',         rgb: [220,100,220],  category: 'life' },
  kingcrab:    { label: 'King Crab', emoji: '🦞', description: 'Kepiting raja berjalan menyamping cepat!',   rgb: [220,50,30],    category: 'life' },
  queenbee:    { label: 'Queen Bee', emoji: '👑', description: 'Ratu lebah terbang & spawn honey!',           rgb: [255,200,0],    category: 'life' },
  elderdragon: { label: 'Elder Dragon',emoji:'🐲',description: '💎 Naga tua — terbang & semburkan api!',    rgb: [200,50,50],    category: 'life' },
  angel:       { label: 'Angel',     emoji: '😇', description: '💎 Malaikat terbang & spawn holy water!',   rgb: [255,255,200],  category: 'life' },
  kraken:      { label: 'Kraken',    emoji: '🦑', description: '💎 Kraken berenang & semburkan tinta!',     rgb: [40,40,100],    category: 'life' },
  titan:       { label: 'Titan',     emoji: '🏔️', description: '💎 Titan raksasa menghancurkan lantai!',    rgb: [100,90,80],    category: 'life' },
  sandgod:     { label: 'Sand God',  emoji: '⚗️', description: '💎 Dewa pasir terbang & ubah semua jadi gold!', rgb: [255,180,0], category: 'life' },

  // === MISSING SHOP ELEMENTS ===
  nuke:        { label: 'Nuke',      emoji: '☢️', description: 'Bom nuklir — hancurkan seluruh canvas!',       rgb: [100,220,50],   category: 'shop' },
  slime:       { label: 'Slime',     emoji: '🟢', description: 'Lendir lengket yang menjebak semua!',           rgb: [100,200,50],   category: 'shop' },
  soapbubble:  { label: 'Soap Bubble',emoji:'🫧', description: 'Gelembung sabun naik & meledak indah!',        rgb: [150,220,255],  category: 'shop' },
  cheese:      { label: 'Cheese',    emoji: '🧀', description: 'Keju yang meleleh kena panas!',                 rgb: [220,190,50],   category: 'shop' },
  glue:        { label: 'Super Glue',emoji: '🔧', description: 'Lem super kuat — bekukan semua yang menempel!', rgb: [210,160,80],   category: 'shop' },
  prism:       { label: 'Prism',     emoji: '💎', description: 'Kristal prisma — pecah elemen jadi warna-warni!',rgb:[220,150,255], category: 'shop' },
  rubber:      { label: 'Rubber',    emoji: '⚫', description: 'Karet — memantulkan semua partikel!',            rgb: [80,80,80],     category: 'shop' },
  mirror:      { label: 'Mirror',    emoji: '🪞', description: 'Memantulkan partikel ke arah balik!',           rgb: [200,220,240],  category: 'shop' },
  portal:      { label: 'Portal',    emoji: '🔮', description: 'Teleportasi partikel ke portal lain!',          rgb: [180,80,255],   category: 'shop' },
  warp:        { label: 'Warp Zone', emoji: '🌀', description: 'Zona distorsi — percepat partikel sekitar!',    rgb: [80,200,200],   category: 'shop' },
  darkmatter:  { label: 'Dark Matter',emoji:'🌑', description: 'Materi gelap — serap cahaya & partikel pelan!', rgb: [30,20,40],     category: 'shop' },
  thunderstorm:{ label: 'Thunder',   emoji: '🌩️', description: 'Badai petir menyambar ke semua arah!',         rgb: [180,180,80],   category: 'shop' },
  toxicmud:    { label: 'Toxic Mud', emoji: '🟫', description: 'Lumpur beracun — racuni semua yang menyentuhnya!',rgb:[120,100,40], category: 'shop' },
  dryice:      { label: 'Dry Ice',   emoji: '🧊', description: 'Es kering — bekukan & keluarkan CO2!',          rgb: [150,220,240],  category: 'shop' },
  gravitywell: { label: 'Gravity Well',emoji:'🕳️',description: 'Lubang gravitasi — tarik semua ke satu titik!', rgb: [40,20,80],    category: 'shop' },
  colorbomb:   { label: 'Color Bomb', emoji: '🎆', description: 'Bom warna — meledak jadi partikel warna-warni!',rgb:[255,100,200], category: 'shop' },
  stormcloud:  { label: 'Storm Cloud',emoji: '⛈️', description: 'Awan badai bergerak & tembak petir ke bawah!', rgb:[74,85,104],   category: 'shop' },

  // === NEW FREE ELEMENTS ===
  gravel:      { label: 'Gravel',    emoji: '🪨', description: 'Kerikil jatuh lebih cepat dari pasir!',          rgb: [130,120,110],  category: 'basic' },
  charcoal:    { label: 'Charcoal',  emoji: '🖤', description: 'Arang — bisa terbakar & menghasilkan asap!',     rgb: [40,35,30],    category: 'basic' },
  chalk:       { label: 'Chalk',     emoji: '🤍', description: 'Kapur putih — larut di air!',                   rgb: [230,225,220], category: 'basic' },
  bedrock:     { label: 'Bedrock',   emoji: '⬛', description: 'Batu dasar — tidak bisa dihancurkan!',           rgb: [30,30,35],    category: 'basic' },
  mercury:     { label: 'Mercury',   emoji: '🪩', description: 'Merkuri — mengalir super cepat & beracun!',      rgb: [180,190,200], category: 'basic' },
  gel:         { label: 'Gel',       emoji: '🟣', description: 'Gel kental — mengalir sangat lambat!',           rgb: [150,50,200],  category: 'basic' },
  glue2:       { label: 'Glue',      emoji: '🟡', description: 'Lem — menempel & membekukan partikel!',          rgb: [220,180,60],  category: 'basic' },
  mist:        { label: 'Mist',      emoji: '🌫️', description: 'Kabut tipis yang naik pelan!',                  rgb: [190,200,215], category: 'weather' },
  spark:       { label: 'Spark',     emoji: '✨', description: 'Percikan api loncat ke konduktor!',              rgb: [255,220,100], category: 'weather' },
  whirlwind:   { label: 'Whirlwind', emoji: '🌪️', description: 'Angin berputar menarik partikel sekitar!',     rgb: [180,210,230], category: 'weather' },
  grass:       { label: 'Grass',     emoji: '🌿', description: 'Rumput tumbuh menyamping di atas tanah!',        rgb: [60,180,60],   category: 'earth' },
  wheat:       { label: 'Wheat',     emoji: '🌾', description: 'Gandum tumbuh ke atas, bisa jadi seed!',         rgb: [200,170,60],  category: 'earth' },
  cactus:      { label: 'Cactus',    emoji: '🌵', description: 'Kaktus tumbuh ke atas, tahan panas!',            rgb: [50,160,50],   category: 'earth' },
  fungi:       { label: 'Fungi',     emoji: '🍄', description: 'Fungi tumbuh di kegelapan & tempat lembab!',     rgb: [180,80,50],   category: 'earth' },
  firework:    { label: 'Firework',  emoji: '🎆', description: 'Kembang api meledak indah ke atas!',             rgb: [255,100,200], category: 'special' },
  magicfire:   { label: 'Magic Fire',emoji: '🔮', description: 'Api ajaib berwarna-warni & tidak membakar!',    rgb: [150,50,255],  category: 'special' },
  plasma2:     { label: 'Plasma Gas',emoji: '💜', description: 'Gas plasma naik & memancarkan cahaya!',          rgb: [200,100,255], category: 'special' },
  frostfire:   { label: 'Frost Fire',emoji: '❄️', description: 'Api beku — dingin tapi menyebar seperti api!',  rgb: [100,200,255], category: 'special' },
  swamp:       { label: 'Swamp',     emoji: '🟫', description: 'Rawa — campuran lumpur & air busuk!',            rgb: [80,100,40],   category: 'earth' },
  coral:       { label: 'Coral',     emoji: '🪸', description: 'Karang tumbuh di dalam air!',                   rgb: [255,120,100], category: 'earth' },
  quickclay:   { label: 'Quick Clay',emoji: '🟤', description: 'Tanah liat cair — mengalir kena tekanan!',       rgb: [160,120,80],  category: 'earth' },
  lavarock:    { label: 'Lava Rock', emoji: '🌋', description: 'Batu lava — terbentuk dari lava yang mendingin!',rgb: [100,50,30],   category: 'earth' },
  ember:       { label: 'Ember',     emoji: '🔥', description: 'Bara api yang jatuh & bisa menyulut kembali!',   rgb: [255,120,30],  category: 'special' },
  ash:         { label: 'Ash',       emoji: '🌫️', description: 'Abu sisa pembakaran — ringan dan naik!',        rgb: [150,140,130], category: 'special' },
  ironore:     { label: 'Iron Ore',  emoji: '⚫', description: 'Bijih besi — lebih berat dari batu biasa!',      rgb: [80,70,80],    category: 'earth' },
  goldore:     { label: 'Gold Ore',  emoji: '🟡', description: 'Bijih emas — berkilau & berharga!',              rgb: [200,160,20],  category: 'earth' },
  marble:      { label: 'Marble',    emoji: '🔘', description: 'Marmer halus — solid & indah!',                  rgb: [220,215,210], category: 'earth' },
  sulfur:      { label: 'Sulfur',    emoji: '🟡', description: 'Belerang — meledak kena api!',                   rgb: [220,200,30],  category: 'special' },
  nitroglycerin:{ label: 'Nitro',   emoji: '💢', description: 'Nitrogliserin — MELEDAK kena getaran!',           rgb: [255,50,100],  category: 'special' },
  wax:         { label: 'Wax',       emoji: '🕯️', description: 'Lilin — meleleh kena panas, terbakar!',         rgb: [240,220,180], category: 'special' },
  cotton:      { label: 'Cotton',    emoji: '🤍', description: 'Kapas — sangat mudah terbakar!',                 rgb: [245,240,235], category: 'experimental' },
  rope:        { label: 'Rope',      emoji: '🪢', description: 'Tali — menghubungkan partikel & bisa terbakar!', rgb: [160,120,60],  category: 'experimental' },
  paper:       { label: 'Paper',     emoji: '📄', description: 'Kertas — mudah terbakar & sobek kena air!',      rgb: [240,235,220], category: 'experimental' },
  glass2:      { label: 'Glass Shard',emoji:'🔷', description: 'Pecahan kaca — solid & memantulkan cahaya!',    rgb: [180,220,240], category: 'experimental' },
  sponge:      { label: 'Sponge',    emoji: '🧽', description: 'Spons — menyerap air & mengembang!',             rgb: [220,180,60],  category: 'experimental' },
  pumice:      { label: 'Pumice',      emoji: '⬜', description: 'Batu apung — sangat ringan, mengapung di air!',  rgb: [200,195,190], category: 'earth' },

  // === AUTO ELEMENTS ===
  autowater:   { label: 'Auto Water',  emoji: '💧', description: 'Generator air — terus mengalirkan air!',          rgb: [30,100,200],  category: 'auto' },
  autosand:    { label: 'Auto Sand',   emoji: '🏖️', description: 'Generator pasir — terus menjatuhkan pasir!',     rgb: [180,150,80],  category: 'auto' },
  autofire:    { label: 'Auto Fire',   emoji: '🔥', description: 'Generator api — terus menyemburkan api!',         rgb: [200,50,0],    category: 'auto' },
  autolava:    { label: 'Auto Lava',   emoji: '🌋', description: 'Generator lava — terus mengalirkan lava!',        rgb: [200,80,0],    category: 'auto' },
  autosnow:    { label: 'Auto Snow',   emoji: '❄️', description: 'Generator salju — terus menjatuhkan salju!',     rgb: [170,200,230], category: 'auto' },
  autosteam:   { label: 'Auto Steam',  emoji: '♨️', description: 'Generator uap — terus mengeluarkan uap!',        rgb: [140,170,190], category: 'auto' },
  autoplant:   { label: 'Auto Plant',  emoji: '🌿', description: 'Generator tanaman — terus menumbuhkan tanaman!', rgb: [30,150,30],   category: 'auto' },
  autooil:     { label: 'Auto Oil',    emoji: '🛢️', description: 'Generator minyak — terus mengalirkan minyak!',  rgb: [60,40,15],    category: 'auto' },
  autoacid:    { label: 'Auto Acid',   emoji: '🧪', description: 'Generator asam — terus meneteskan asam!',        rgb: [40,200,10],   category: 'auto' },
  autospark:   { label: 'Auto Spark',  emoji: '✨', description: 'Generator percikan — terus memercikan api!',     rgb: [200,170,50],  category: 'auto' },
  autocloud:   { label: 'Auto Cloud',  emoji: '☁️', description: 'Generator awan — terus membuat awan!',           rgb: [160,175,185], category: 'auto' },
  autowind:    { label: 'Auto Wind',   emoji: '🌬️', description: 'Generator angin — terus menghembuskan angin!', rgb: [160,190,210], category: 'auto' },
  autonuclear: { label: 'Auto Nuclear',emoji: '☢️', description: 'Generator nuklir — terus menyebarkan radiasi!', rgb: [70,180,20],   category: 'auto' },
  autodark:    { label: 'Auto Dark',   emoji: '🌑', description: 'Generator dark matter — terus menyebar!',        rgb: [25,15,35],    category: 'auto' },
  autoparty:   { label: 'Auto Party',  emoji: '🎉', description: 'Generator pesta — terus spawn partikel warna!', rgb: [200,80,150],  category: 'auto' },
  automud:     { label: 'Auto Mud',    emoji: '🟤', description: 'Generator lumpur — terus mengalirkan lumpur!',   rgb: [80,50,25],    category: 'auto' },
  autoice:     { label: 'Auto Ice',    emoji: '🧊', description: 'Generator es — terus membekukan sekitarnya!',    rgb: [120,180,210], category: 'auto' },
  autovirus:   { label: 'Auto Virus',  emoji: '🦠', description: 'Generator virus — terus menyebarkan virus!',    rgb: [160,40,160],  category: 'auto' },
  autosmoke:   { label: 'Auto Smoke',  emoji: '💨', description: 'Generator asap — terus mengeluarkan asap!',     rgb: [100,100,115], category: 'auto' },
  autobluefire:{ label: 'Auto BlueFire',emoji:'🔵', description: 'Generator api biru — terus menyembur api biru!',rgb: [0,80,200],    category: 'auto' },
};

// Pre-computed color palettes
function packRGB(r: number, g: number, b: number): number {
  return (255 << 24) | (b << 16) | (g << 8) | r;
}

export const FIRE_COLORS: number[] = [
  packRGB(255,69,0), packRGB(255,102,34), packRGB(255,136,0), packRGB(255,170,0), packRGB(255,204,0)
];
export const LAVA_COLORS: number[] = [
  packRGB(255,106,0), packRGB(255,69,0), packRGB(255,136,0)
];
export const WATER_COLORS: number[] = [
  packRGB(58,158,255), packRGB(42,142,239), packRGB(74,174,255), packRGB(26,126,223)
];
export const SMOKE_COLORS: number[] = Array.from({length:16},(_,i)=>{
  const v = 130 + i*8; return packRGB(v,v,v);
});
export const EXPLOSION_COLORS: number[] = [
  packRGB(255,221,0), packRGB(255,136,0), packRGB(255,68,0), packRGB(255,255,255)
];
export const ACID_COLORS: number[] = [
  packRGB(57,255,20), packRGB(0,255,68), packRGB(127,255,0)
];
export const SAND_COLORS: number[] = [
  packRGB(226,201,126), packRGB(212,185,106), packRGB(239,217,142), packRGB(201,168,92)
];
export const STEAM_COLORS: number[] = [
  packRGB(180,200,220), packRGB(190,210,230), packRGB(170,190,210), packRGB(200,215,235)
];
export const LIGHTNING_COLORS: number[] = [
  packRGB(255,255,100), packRGB(200,200,255), packRGB(255,255,255), packRGB(255,220,50)
];
export const VIRUS_COLORS: number[] = [
  packRGB(200,50,200), packRGB(220,80,220), packRGB(180,30,180), packRGB(255,100,255)
];
export const CRYSTAL_COLORS: number[] = [
  packRGB(150,80,255), packRGB(180,100,255), packRGB(120,60,220), packRGB(200,130,255)
];
export const SNOW_COLORS: number[] = [
  packRGB(220,240,255), packRGB(200,225,245), packRGB(235,245,255), packRGB(210,230,250)
];
export const CLOUD_COLORS: number[] = [
  packRGB(200,210,220), packRGB(210,220,230), packRGB(190,200,215), packRGB(215,225,235)
];
export const HONEY_COLORS: number[] = [
  packRGB(220,150,30), packRGB(230,165,40), packRGB(210,135,20), packRGB(240,175,50)
];
export const BUBBLE_COLORS: number[] = [
  packRGB(100,200,255), packRGB(120,210,255), packRGB(80,190,245), packRGB(140,220,255)
];
export const GASOLINE_COLORS: number[] = [
  packRGB(180,200,120), packRGB(190,210,130), packRGB(170,195,110), packRGB(200,215,140)
];
export const GUNPOWDER_COLORS: number[] = [
  packRGB(60,60,60), packRGB(70,65,60), packRGB(50,50,55), packRGB(80,75,70)
];
export const VOID_COLORS: number[] = [
  packRGB(5,0,15), packRGB(10,0,20), packRGB(0,0,10), packRGB(15,5,25)
];
export const ANTIMATTER_COLORS: number[] = [
  packRGB(140,0,255), packRGB(180,0,255), packRGB(100,0,200), packRGB(220,80,255), packRGB(60,0,180)
];
export const PLASMA_COLORS: number[] = [
  packRGB(0,200,255), packRGB(0,230,255), packRGB(50,220,255), packRGB(0,170,230), packRGB(100,240,255)
];
export const MAGMA_COLORS: number[] = [
  packRGB(220,60,0), packRGB(240,80,0), packRGB(200,40,0), packRGB(255,100,20), packRGB(180,30,0)
];
export const BLACKHOLE_COLORS: number[] = [
  packRGB(10,0,20), packRGB(20,0,40), packRGB(5,0,10), packRGB(30,0,60), packRGB(0,0,5)
];
export const RAINBOW_COLORS: number[] = [
  packRGB(255,0,0), packRGB(255,165,0), packRGB(255,255,0), packRGB(0,255,0),
  packRGB(0,0,255), packRGB(75,0,130), packRGB(238,130,238), packRGB(255,105,180)
];
export const DRAGONFIRE_COLORS: number[] = [
  packRGB(255,50,0), packRGB(255,100,0), packRGB(200,0,0), packRGB(255,150,50), packRGB(180,0,50)
];
export const TIMESAND_COLORS: number[] = [
  packRGB(200,180,50), packRGB(220,200,70), packRGB(180,160,30), packRGB(240,220,100), packRGB(160,140,20)
];
export const ANTIGRAVITY_COLORS: number[] = [
  packRGB(100,100,255), packRGB(130,130,255), packRGB(80,80,220), packRGB(160,160,255), packRGB(60,60,200)
];
export const ANT_COLORS: number[] = [
  packRGB(60,30,10), packRGB(80,40,15), packRGB(50,25,8), packRGB(70,35,12)
];
export const FISH_COLORS: number[] = [
  packRGB(30,120,255), packRGB(50,140,255), packRGB(20,100,230), packRGB(70,160,255)
];
export const BIRD_COLORS: number[] = [
  packRGB(255,200,50), packRGB(255,220,80), packRGB(240,180,30), packRGB(255,240,100)
];
export const WORM_COLORS: number[] = [
  packRGB(180,80,80), packRGB(200,100,100), packRGB(160,60,60), packRGB(210,110,110)
];
export const FROG_COLORS: number[] = [
  packRGB(50,180,50), packRGB(70,200,70), packRGB(40,160,40), packRGB(80,220,80)
];
export const CRAB_COLORS: number[] = [
  packRGB(220,60,30), packRGB(240,80,40), packRGB(200,40,20), packRGB(255,90,50)
];
export const BEE_COLORS: number[] = [
  packRGB(240,180,0), packRGB(255,200,0), packRGB(220,160,0), packRGB(255,220,30)
];
export const MUSHROOM_COLORS: number[] = [
  packRGB(200,80,40), packRGB(220,100,50), packRGB(180,60,30), packRGB(240,120,60)
];
export const BABYDRAGON_COLORS: number[] = [
  packRGB(255,80,20), packRGB(255,120,40), packRGB(220,60,10), packRGB(255,160,60)
];
export const UNICORN_COLORS: number[] = [
  packRGB(255,150,220), packRGB(255,180,240), packRGB(220,120,200), packRGB(255,200,255)
];
export const GHOST_COLORS: number[] = [
  packRGB(200,210,230), packRGB(220,230,245), packRGB(180,195,220), packRGB(240,245,255)
];
export const ROBOT_COLORS: number[] = [
  packRGB(150,170,190), packRGB(170,185,200), packRGB(130,155,175), packRGB(190,205,220)
];
export const ALIEN_COLORS: number[] = [
  packRGB(100,220,100), packRGB(120,240,120), packRGB(80,200,80), packRGB(140,255,140)
];
export const SHARK_COLORS: number[] = [
  packRGB(80,120,180), packRGB(100,140,200), packRGB(60,100,160), packRGB(120,160,210)
];
export const CAT_COLORS: number[] = [
  packRGB(220,170,120), packRGB(240,190,140), packRGB(200,150,100), packRGB(255,210,160)
];
export const SPIDER_COLORS: number[] = [
  packRGB(60,60,80), packRGB(80,80,100), packRGB(40,40,60), packRGB(100,100,120)
];
export const PENGUIN_COLORS: number[] = [
  packRGB(50,60,80), packRGB(70,80,100), packRGB(30,40,60), packRGB(90,100,120)
];
export const SNAKE_COLORS: number[] = [
  packRGB(60,150,60), packRGB(80,170,80), packRGB(40,130,40), packRGB(100,190,100)
];
export const BUTTERFLY_COLORS: number[] = [
  packRGB(200,100,255), packRGB(220,130,255), packRGB(180,80,230), packRGB(240,160,255)
];
export const PHOENIX_COLORS: number[] = [
  packRGB(255,160,0), packRGB(255,200,0), packRGB(230,120,0), packRGB(255,220,60)
];
export const WHALE_COLORS: number[] = [
  packRGB(60,100,200), packRGB(80,120,220), packRGB(40,80,180), packRGB(100,140,230)
];
export const DINOSAUR_COLORS: number[] = [
  packRGB(80,180,60), packRGB(100,200,80), packRGB(60,160,40), packRGB(120,220,100)
];
export const DEMON_COLORS: number[] = [
  packRGB(180,20,20), packRGB(220,40,40), packRGB(150,10,10), packRGB(255,60,60)
];
export const METEOR_COLORS: number[] = [
  packRGB(200,120,50), packRGB(230,150,60), packRGB(180,100,30), packRGB(255,180,80), packRGB(160,80,20)
];
export const TORNADO_COLORS: number[] = [
  packRGB(150,200,220), packRGB(170,215,230), packRGB(130,185,210), packRGB(190,225,240)
];
export const ELECTRICITY_COLORS: number[] = [
  packRGB(255,255,0), packRGB(255,255,100), packRGB(200,200,255), packRGB(255,255,200), packRGB(150,150,255)
];
export const POISON_COLORS: number[] = [
  packRGB(100,200,50), packRGB(120,220,60), packRGB(80,180,40), packRGB(140,240,70)
];
export const MAGNET_COLORS: number[] = [
  packRGB(200,50,50), packRGB(220,60,60), packRGB(180,40,40), packRGB(240,70,70)
];
export const DIAMOND_COLORS: number[] = [
  packRGB(150,220,255), packRGB(180,240,255), packRGB(130,200,240), packRGB(200,255,255)
];
export const QUICKSAND_COLORS: number[] = [
  packRGB(180,140,60), packRGB(200,160,70), packRGB(160,120,50), packRGB(220,180,80)
];
export const SUPERLAVA_COLORS: number[] = [
  packRGB(255,30,0), packRGB(255,60,10), packRGB(220,10,0), packRGB(255,100,30), packRGB(200,0,0)
];
export const HOLYWATER_COLORS: number[] = [
  packRGB(200,240,255), packRGB(220,250,255), packRGB(180,230,255), packRGB(240,255,255)
];
export const BLUEFIRE_COLORS: number[] = [
  packRGB(0,100,255), packRGB(0,150,255), packRGB(50,120,255), packRGB(0,200,255), packRGB(100,180,255)
];
export const C4_COLORS: number[] = [
  packRGB(220,40,40), packRGB(240,60,60), packRGB(200,20,20), packRGB(255,80,80)
];
export const NUCLEARWASTE_COLORS: number[] = [
  packRGB(100,220,30), packRGB(120,240,40), packRGB(80,200,20), packRGB(150,255,60)
];
export const WIND_COLORS: number[] = [
  packRGB(200,230,255), packRGB(220,240,255), packRGB(180,215,245), packRGB(240,250,255)
];
export const SEED_COLORS: number[] = [
  packRGB(80,160,40), packRGB(100,180,50), packRGB(60,140,30), packRGB(120,200,60)
];
export const FOG_COLORS: number[] = [
  packRGB(180,190,200), packRGB(190,200,210), packRGB(170,180,195), packRGB(200,210,220)
];
export const WEB_COLORS: number[] = [
  packRGB(220,220,230), packRGB(235,235,245), packRGB(200,200,215), packRGB(245,245,255)
];
export const POTION_COLORS: number[] = [
  packRGB(180,50,220), packRGB(200,80,240), packRGB(160,30,200), packRGB(220,100,255)
];
export const TAR_COLORS: number[] = [
  packRGB(30,25,20), packRGB(40,35,25), packRGB(20,15,10), packRGB(50,45,35)
];
export const OBSIDIAN_COLORS: number[] = [
  packRGB(20,10,30), packRGB(30,15,40), packRGB(10,5,20), packRGB(40,25,50)
];
export const TIDALWAVE_COLORS: number[] = [
  packRGB(0,80,200), packRGB(0,100,220), packRGB(0,60,180), packRGB(20,120,240)
];
export const STARDUST_COLORS: number[] = [
  packRGB(255,220,100), packRGB(255,240,130), packRGB(240,200,80), packRGB(255,255,160)
];
export const CRYO_COLORS: number[] = [
  packRGB(100,200,255), packRGB(130,220,255), packRGB(80,180,240), packRGB(160,240,255)
];
export const TRIDENT_COLORS: number[] = [
  packRGB(50,150,255), packRGB(80,180,255), packRGB(30,120,230), packRGB(100,200,255)
];
export const NEBULA_COLORS: number[] = [
  packRGB(120,30,180), packRGB(150,50,210), packRGB(100,20,160), packRGB(180,80,230)
];
export const MINDBLOW_COLORS: number[] = [
  packRGB(255,50,200), packRGB(255,80,220), packRGB(230,30,180), packRGB(255,120,240)
];
export const PARTY_COLORS: number[] = [
  packRGB(255,100,100), packRGB(100,255,100), packRGB(100,100,255),
  packRGB(255,255,100), packRGB(255,100,255), packRGB(100,255,255)
];
export const WOLF_COLORS: number[] = [
  packRGB(120,110,100), packRGB(140,130,120), packRGB(100,90,80), packRGB(160,150,140)
];
export const LION_COLORS: number[] = [
  packRGB(210,170,80), packRGB(230,190,100), packRGB(190,150,60), packRGB(250,210,120)
];
export const OCTOPUS_COLORS: number[] = [
  packRGB(180,80,160), packRGB(200,100,180), packRGB(160,60,140), packRGB(220,120,200)
];
export const EAGLE_COLORS: number[] = [
  packRGB(160,120,60), packRGB(180,140,80), packRGB(140,100,40), packRGB(200,160,100)
];
export const TURTLE_COLORS: number[] = [
  packRGB(60,140,60), packRGB(80,160,80), packRGB(40,120,40), packRGB(100,180,100)
];
export const RABBIT_COLORS: number[] = [
  packRGB(230,210,200), packRGB(245,230,220), packRGB(215,195,185), packRGB(255,245,240)
];
export const BEAR_COLORS: number[] = [
  packRGB(120,80,40), packRGB(140,100,60), packRGB(100,60,20), packRGB(160,120,80)
];
export const JELLYFISH_COLORS: number[] = [
  packRGB(220,100,220), packRGB(240,120,240), packRGB(200,80,200), packRGB(255,150,255)
];
export const KINGCRAB_COLORS: number[] = [
  packRGB(220,50,30), packRGB(240,70,50), packRGB(200,30,10), packRGB(255,90,70)
];
export const QUEENBEE_COLORS: number[] = [
  packRGB(255,200,0), packRGB(255,220,30), packRGB(240,180,0), packRGB(255,240,60)
];
export const ELDERDRAGON_COLORS: number[] = [
  packRGB(200,50,50), packRGB(220,70,70), packRGB(180,30,30), packRGB(255,100,80)
];
export const ANGEL_COLORS: number[] = [
  packRGB(255,255,200), packRGB(255,255,220), packRGB(240,240,180), packRGB(255,255,240)
];
export const KRAKEN_COLORS: number[] = [
  packRGB(40,40,100), packRGB(60,60,120), packRGB(20,20,80), packRGB(80,80,150)
];
export const TITAN_COLORS: number[] = [
  packRGB(100,90,80), packRGB(120,110,100), packRGB(80,70,60), packRGB(140,130,120)
];
export const SANDGOD_COLORS: number[] = [
  packRGB(255,180,0), packRGB(255,210,50), packRGB(240,160,0), packRGB(255,240,100)
];

export const NUKE_COLORS: number[] = [packRGB(100,220,50),packRGB(120,240,60),packRGB(80,200,40),packRGB(150,255,70)];
export const SLIME_COLORS: number[] = [packRGB(100,200,50),packRGB(120,220,60),packRGB(80,180,40),packRGB(140,240,70)];
export const SOAPBUBBLE_COLORS: number[] = [packRGB(150,220,255),packRGB(170,235,255),packRGB(130,205,245),packRGB(190,245,255)];
export const CHEESE_COLORS: number[] = [packRGB(220,190,50),packRGB(240,210,60),packRGB(200,170,40),packRGB(255,225,70)];
export const GLUE_COLORS: number[] = [packRGB(210,160,80),packRGB(225,175,90),packRGB(195,145,65),packRGB(240,190,100)];
export const PRISM_COLORS: number[] = [packRGB(220,150,255),packRGB(240,170,255),packRGB(200,130,235),packRGB(255,190,255)];
export const RUBBER_COLORS: number[] = [packRGB(80,80,80),packRGB(100,100,100),packRGB(60,60,60),packRGB(120,120,120)];
export const MIRROR_COLORS: number[] = [packRGB(200,220,240),packRGB(215,235,250),packRGB(185,205,230),packRGB(230,245,255)];
export const PORTAL_COLORS: number[] = [packRGB(180,80,255),packRGB(200,100,255),packRGB(160,60,230),packRGB(220,130,255)];
export const WARP_COLORS: number[] = [packRGB(80,200,200),packRGB(100,220,220),packRGB(60,180,180),packRGB(120,240,240)];
export const DARKMATTER_COLORS: number[] = [packRGB(30,20,40),packRGB(45,30,55),packRGB(20,10,30),packRGB(60,40,70)];
export const THUNDERSTORM_COLORS: number[] = [packRGB(180,180,80),packRGB(200,200,100),packRGB(160,160,60),packRGB(220,220,120)];
export const TOXICMUD_COLORS: number[] = [packRGB(120,100,40),packRGB(140,120,50),packRGB(100,80,30),packRGB(160,140,60)];
export const DRYICE_COLORS: number[] = [packRGB(150,220,240),packRGB(170,235,250),packRGB(130,205,230),packRGB(190,245,255)];
export const GRAVITYWELL_COLORS: number[] = [packRGB(40,20,80),packRGB(60,30,100),packRGB(20,10,60),packRGB(80,40,120)];
export const COLORBOMB_COLORS: number[] = [packRGB(255,100,200),packRGB(100,255,200),packRGB(200,100,255),packRGB(255,200,100),packRGB(100,200,255)];
export const STORMCLOUD_COLORS: number[] = [packRGB(74,85,104),packRGB(90,100,120),packRGB(60,70,90),packRGB(110,120,140)];
export const GRAVEL_COLORS: number[] = [packRGB(130,120,110),packRGB(145,135,125),packRGB(115,105,95),packRGB(160,150,140)];
export const CHARCOAL_COLORS: number[] = [packRGB(40,35,30),packRGB(55,50,45),packRGB(30,25,20),packRGB(65,60,55)];
export const CHALK_COLORS: number[] = [packRGB(230,225,220),packRGB(240,238,235),packRGB(220,215,210),packRGB(248,245,242)];
export const BEDROCK_COLORS: number[] = [packRGB(30,30,35),packRGB(40,40,45),packRGB(20,20,25),packRGB(50,50,55)];
export const MERCURY_COLORS: number[] = [packRGB(180,190,200),packRGB(195,205,215),packRGB(165,175,185),packRGB(210,218,226)];
export const GEL_COLORS: number[] = [packRGB(150,50,200),packRGB(170,70,220),packRGB(130,30,180),packRGB(190,90,240)];
export const GLUE2_COLORS: number[] = [packRGB(220,180,60),packRGB(235,195,75),packRGB(205,165,45),packRGB(245,210,90)];
export const MIST_COLORS: number[] = [packRGB(190,200,215),packRGB(200,210,225),packRGB(180,190,205),packRGB(210,220,235)];
export const SPARK_COLORS: number[] = [packRGB(255,220,100),packRGB(255,240,150),packRGB(255,200,50),packRGB(255,255,200)];
export const WHIRLWIND_COLORS: number[] = [packRGB(180,210,230),packRGB(195,220,240),packRGB(165,198,220),packRGB(210,230,248)];
export const GRASS_COLORS: number[] = [packRGB(60,180,60),packRGB(80,200,70),packRGB(45,160,45),packRGB(100,220,80)];
export const WHEAT_COLORS: number[] = [packRGB(200,170,60),packRGB(215,185,75),packRGB(185,155,45),packRGB(230,200,90)];
export const CACTUS_COLORS: number[] = [packRGB(50,160,50),packRGB(65,175,60),packRGB(35,145,35),packRGB(80,190,70)];
export const FUNGI_COLORS: number[] = [packRGB(180,80,50),packRGB(195,95,65),packRGB(165,65,35),packRGB(210,110,80)];
export const FIREWORK_COLORS: number[] = [packRGB(255,100,200),packRGB(255,200,0),packRGB(0,200,255),packRGB(100,255,100),packRGB(255,50,50),packRGB(200,100,255)];
export const MAGICFIRE_COLORS: number[] = [packRGB(150,50,255),packRGB(200,100,255),packRGB(100,0,200),packRGB(255,150,255),packRGB(50,150,255)];
export const PLASMA2_COLORS: number[] = [packRGB(200,100,255),packRGB(220,130,255),packRGB(180,80,230),packRGB(240,160,255)];
export const FROSTFIRE_COLORS: number[] = [packRGB(100,200,255),packRGB(150,220,255),packRGB(50,180,255),packRGB(200,240,255)];
export const SWAMP_COLORS: number[] = [packRGB(80,100,40),packRGB(95,115,50),packRGB(65,85,30),packRGB(110,130,60)];
export const CORAL_COLORS: number[] = [packRGB(255,120,100),packRGB(255,150,130),packRGB(235,100,80),packRGB(255,180,160)];
export const QUICKCLAY_COLORS: number[] = [packRGB(160,120,80),packRGB(175,135,95),packRGB(145,105,65),packRGB(190,150,110)];
export const LAVAROCK_COLORS: number[] = [packRGB(100,50,30),packRGB(115,65,40),packRGB(85,35,20),packRGB(130,80,50)];
export const EMBER_COLORS: number[] = [packRGB(255,120,30),packRGB(255,150,50),packRGB(235,100,10),packRGB(255,180,80)];
export const ASH_COLORS: number[] = [packRGB(150,140,130),packRGB(165,155,145),packRGB(135,125,115),packRGB(180,170,160)];
export const IRONORE_COLORS: number[] = [packRGB(80,70,80),packRGB(95,85,95),packRGB(65,55,65),packRGB(110,100,110)];
export const GOLDORE_COLORS: number[] = [packRGB(200,160,20),packRGB(215,175,35),packRGB(185,145,10),packRGB(230,195,50)];
export const MARBLE_COLORS: number[] = [packRGB(220,215,210),packRGB(230,228,225),packRGB(210,205,200),packRGB(240,238,235)];
export const SULFUR_COLORS: number[] = [packRGB(220,200,30),packRGB(235,215,45),packRGB(205,185,15),packRGB(245,225,60)];
export const NITROGLYCERIN_COLORS: number[] = [packRGB(255,50,100),packRGB(255,80,120),packRGB(235,30,80),packRGB(255,110,140)];
export const WAX_COLORS: number[] = [packRGB(240,220,180),packRGB(250,232,195),packRGB(228,208,165),packRGB(255,245,210)];
export const COTTON_COLORS: number[] = [packRGB(245,240,235),packRGB(252,248,245),packRGB(238,233,228),packRGB(255,252,250)];
export const ROPE_COLORS: number[] = [packRGB(160,120,60),packRGB(175,135,75),packRGB(145,105,45),packRGB(190,150,90)];
export const PAPER_COLORS: number[] = [packRGB(240,235,220),packRGB(248,244,230),packRGB(232,226,210),packRGB(255,252,240)];
export const GLASS2_COLORS: number[] = [packRGB(180,220,240),packRGB(195,230,248),packRGB(165,210,232),packRGB(210,240,255)];
export const SPONGE_COLORS: number[] = [packRGB(220,180,60),packRGB(232,195,75),packRGB(208,165,45),packRGB(242,210,90)];
export const PUMICE_COLORS: number[] = [packRGB(200,195,190),packRGB(212,207,202),packRGB(188,183,178),packRGB(222,218,215)];

// AUTO ELEMENT COLORS
export const AUTOWATER_COLORS: number[] = [packRGB(30,100,200),packRGB(20,80,180),packRGB(40,120,220),packRGB(10,60,160)];
export const AUTOSAND_COLORS: number[] = [packRGB(180,150,80),packRGB(200,170,90),packRGB(160,130,70),packRGB(220,190,100)];
export const AUTOFIRE_COLORS: number[] = [packRGB(200,50,0),packRGB(220,70,10),packRGB(180,30,0),packRGB(240,90,20)];
export const AUTOLAVA_COLORS: number[] = [packRGB(200,80,0),packRGB(220,100,10),packRGB(180,60,0),packRGB(240,120,20)];
export const AUTOSNOW_COLORS: number[] = [packRGB(170,200,230),packRGB(185,215,240),packRGB(155,185,220),packRGB(200,225,245)];
export const AUTOSTEAM_COLORS: number[] = [packRGB(140,170,190),packRGB(155,185,205),packRGB(125,155,175),packRGB(170,200,220)];
export const AUTOPLANT_COLORS: number[] = [packRGB(30,150,30),packRGB(45,165,40),packRGB(20,135,20),packRGB(60,180,50)];
export const AUTOOIL_COLORS: number[] = [packRGB(60,40,15),packRGB(75,55,25),packRGB(45,30,10),packRGB(90,65,35)];
export const AUTOACID_COLORS: number[] = [packRGB(40,200,10),packRGB(55,215,20),packRGB(30,185,5),packRGB(70,230,30)];
export const AUTOSPARK_COLORS: number[] = [packRGB(200,170,50),packRGB(215,185,65),packRGB(185,155,35),packRGB(230,200,80)];
export const AUTOCLOUD_COLORS: number[] = [packRGB(160,175,185),packRGB(175,190,200),packRGB(145,160,170),packRGB(190,205,215)];
export const AUTOWIND_COLORS: number[] = [packRGB(160,190,210),packRGB(175,205,225),packRGB(145,175,195),packRGB(190,220,235)];
export const AUTONUCLEAR_COLORS: number[] = [packRGB(70,180,20),packRGB(85,200,30),packRGB(55,160,15),packRGB(100,220,40)];
export const AUTODARK_COLORS: number[] = [packRGB(25,15,35),packRGB(35,25,45),packRGB(15,10,25),packRGB(45,35,55)];
export const AUTOPARTY_COLORS: number[] = [packRGB(200,80,150),packRGB(150,80,200),packRGB(80,150,200),packRGB(200,150,80),packRGB(80,200,150)];
export const AUTOMUD_COLORS: number[] = [packRGB(80,50,25),packRGB(95,65,35),packRGB(65,40,15),packRGB(110,80,45)];
export const AUTOICE_COLORS: number[] = [packRGB(120,180,210),packRGB(135,195,225),packRGB(105,165,195),packRGB(150,210,235)];
export const AUTOVIRUS_COLORS: number[] = [packRGB(160,40,160),packRGB(180,55,180),packRGB(140,30,140),packRGB(200,70,200)];
export const AUTOSMOKE_COLORS: number[] = [packRGB(100,100,115),packRGB(115,115,130),packRGB(85,85,100),packRGB(130,130,145)];
export const AUTOBLUEFIRE_COLORS: number[] = [packRGB(0,80,200),packRGB(10,100,220),packRGB(0,60,180),packRGB(20,120,240)];

export function getColorInt(type: ElementType): number {
  const ri = (Math.random() * 100) | 0;
  switch(type) {
    case 'fire':        return FIRE_COLORS[ri % FIRE_COLORS.length];
    case 'lava':        return LAVA_COLORS[ri % LAVA_COLORS.length];
    case 'water':       return WATER_COLORS[ri % WATER_COLORS.length];
    case 'smoke':       return SMOKE_COLORS[ri % SMOKE_COLORS.length];
    case 'explosion':   return EXPLOSION_COLORS[ri % EXPLOSION_COLORS.length];
    case 'acid':        return ACID_COLORS[ri % ACID_COLORS.length];
    case 'sand':        return SAND_COLORS[ri % SAND_COLORS.length];
    case 'steam':       return STEAM_COLORS[ri % STEAM_COLORS.length];
    case 'lightning':   return LIGHTNING_COLORS[ri % LIGHTNING_COLORS.length];
    case 'virus':       return VIRUS_COLORS[ri % VIRUS_COLORS.length];
    case 'crystal':     return CRYSTAL_COLORS[ri % CRYSTAL_COLORS.length];
    case 'snow':        return SNOW_COLORS[ri % SNOW_COLORS.length];
    case 'cloud':       return CLOUD_COLORS[ri % CLOUD_COLORS.length];
    case 'honey':       return HONEY_COLORS[ri % HONEY_COLORS.length];
    case 'bubble':      return BUBBLE_COLORS[ri % BUBBLE_COLORS.length];
    case 'gasoline':    return GASOLINE_COLORS[ri % GASOLINE_COLORS.length];
    case 'gunpowder':   return GUNPOWDER_COLORS[ri % GUNPOWDER_COLORS.length];
    case 'void':        return VOID_COLORS[ri % VOID_COLORS.length];
    case 'antimatter':  return ANTIMATTER_COLORS[ri % ANTIMATTER_COLORS.length];
    case 'plasma':      return PLASMA_COLORS[ri % PLASMA_COLORS.length];
    case 'magma':       return MAGMA_COLORS[ri % MAGMA_COLORS.length];
    case 'blackhole':   return BLACKHOLE_COLORS[ri % BLACKHOLE_COLORS.length];
    case 'rainbow':     return RAINBOW_COLORS[ri % RAINBOW_COLORS.length];
    case 'dragonfire':  return DRAGONFIRE_COLORS[ri % DRAGONFIRE_COLORS.length];
    case 'timesand':    return TIMESAND_COLORS[ri % TIMESAND_COLORS.length];
    case 'antigravity': return ANTIGRAVITY_COLORS[ri % ANTIGRAVITY_COLORS.length];
    case 'ant':         return ANT_COLORS[ri % ANT_COLORS.length];
    case 'fish':        return FISH_COLORS[ri % FISH_COLORS.length];
    case 'bird':        return BIRD_COLORS[ri % BIRD_COLORS.length];
    case 'worm':        return WORM_COLORS[ri % WORM_COLORS.length];
    case 'frog':        return FROG_COLORS[ri % FROG_COLORS.length];
    case 'crab':        return CRAB_COLORS[ri % CRAB_COLORS.length];
    case 'bee':         return BEE_COLORS[ri % BEE_COLORS.length];
    case 'mushroom':    return MUSHROOM_COLORS[ri % MUSHROOM_COLORS.length];
    case 'babydragon':  return BABYDRAGON_COLORS[ri % BABYDRAGON_COLORS.length];
    case 'unicorn':     return UNICORN_COLORS[ri % UNICORN_COLORS.length];
    case 'ghost':       return GHOST_COLORS[ri % GHOST_COLORS.length];
    case 'robot':       return ROBOT_COLORS[ri % ROBOT_COLORS.length];
    case 'alien':       return ALIEN_COLORS[ri % ALIEN_COLORS.length];
    case 'shark':       return SHARK_COLORS[ri % SHARK_COLORS.length];
    case 'cat':         return CAT_COLORS[ri % CAT_COLORS.length];
    case 'spider':      return SPIDER_COLORS[ri % SPIDER_COLORS.length];
    case 'penguin':     return PENGUIN_COLORS[ri % PENGUIN_COLORS.length];
    case 'snake':       return SNAKE_COLORS[ri % SNAKE_COLORS.length];
    case 'butterfly':   return BUTTERFLY_COLORS[ri % BUTTERFLY_COLORS.length];
    case 'phoenix':     return PHOENIX_COLORS[ri % PHOENIX_COLORS.length];
    case 'whale':       return WHALE_COLORS[ri % WHALE_COLORS.length];
    case 'dinosaur':    return DINOSAUR_COLORS[ri % DINOSAUR_COLORS.length];
    case 'demon':       return DEMON_COLORS[ri % DEMON_COLORS.length];
    case 'meteor':      return METEOR_COLORS[ri % METEOR_COLORS.length];
    case 'tornado':     return TORNADO_COLORS[ri % TORNADO_COLORS.length];
    case 'electricity': return ELECTRICITY_COLORS[ri % ELECTRICITY_COLORS.length];
    case 'poison':      return POISON_COLORS[ri % POISON_COLORS.length];
    case 'magnet':      return MAGNET_COLORS[ri % MAGNET_COLORS.length];
    case 'diamond':     return DIAMOND_COLORS[ri % DIAMOND_COLORS.length];
    case 'quicksand':   return QUICKSAND_COLORS[ri % QUICKSAND_COLORS.length];
    case 'superlava':   return SUPERLAVA_COLORS[ri % SUPERLAVA_COLORS.length];
    case 'holywater':   return HOLYWATER_COLORS[ri % HOLYWATER_COLORS.length];
    case 'bluefire':    return BLUEFIRE_COLORS[ri % BLUEFIRE_COLORS.length];
    case 'c4':          return C4_COLORS[ri % C4_COLORS.length];
    case 'nuclearwaste':return NUCLEARWASTE_COLORS[ri % NUCLEARWASTE_COLORS.length];
    case 'wind':        return WIND_COLORS[ri % WIND_COLORS.length];
    case 'seed':        return SEED_COLORS[ri % SEED_COLORS.length];
    case 'fog':         return FOG_COLORS[ri % FOG_COLORS.length];
    case 'web':         return WEB_COLORS[ri % WEB_COLORS.length];
    case 'potion':      return POTION_COLORS[ri % POTION_COLORS.length];
    case 'tar':         return TAR_COLORS[ri % TAR_COLORS.length];
    case 'obsidian':    return OBSIDIAN_COLORS[ri % OBSIDIAN_COLORS.length];
    case 'tidalwave':   return TIDALWAVE_COLORS[ri % TIDALWAVE_COLORS.length];
    case 'stardust':    return STARDUST_COLORS[ri % STARDUST_COLORS.length];
    case 'cryo':        return CRYO_COLORS[ri % CRYO_COLORS.length];
    case 'trident':     return TRIDENT_COLORS[ri % TRIDENT_COLORS.length];
    case 'nebula':      return NEBULA_COLORS[ri % NEBULA_COLORS.length];
    case 'mindblow':    return MINDBLOW_COLORS[ri % MINDBLOW_COLORS.length];
    case 'party':       return PARTY_COLORS[ri % PARTY_COLORS.length];
    case 'wolf':        return WOLF_COLORS[ri % WOLF_COLORS.length];
    case 'lion':        return LION_COLORS[ri % LION_COLORS.length];
    case 'octopus':     return OCTOPUS_COLORS[ri % OCTOPUS_COLORS.length];
    case 'eagle':       return EAGLE_COLORS[ri % EAGLE_COLORS.length];
    case 'turtle':      return TURTLE_COLORS[ri % TURTLE_COLORS.length];
    case 'rabbit':      return RABBIT_COLORS[ri % RABBIT_COLORS.length];
    case 'bear':        return BEAR_COLORS[ri % BEAR_COLORS.length];
    case 'jellyfish':   return JELLYFISH_COLORS[ri % JELLYFISH_COLORS.length];
    case 'kingcrab':    return KINGCRAB_COLORS[ri % KINGCRAB_COLORS.length];
    case 'queenbee':    return QUEENBEE_COLORS[ri % QUEENBEE_COLORS.length];
    case 'elderdragon': return ELDERDRAGON_COLORS[ri % ELDERDRAGON_COLORS.length];
    case 'angel':       return ANGEL_COLORS[ri % ANGEL_COLORS.length];
    case 'kraken':      return KRAKEN_COLORS[ri % KRAKEN_COLORS.length];
    case 'titan':       return TITAN_COLORS[ri % TITAN_COLORS.length];
    case 'sandgod':     return SANDGOD_COLORS[ri % SANDGOD_COLORS.length];
    case 'nuke':        return NUKE_COLORS[ri % NUKE_COLORS.length];
    case 'slime':       return SLIME_COLORS[ri % SLIME_COLORS.length];
    case 'soapbubble':  return SOAPBUBBLE_COLORS[ri % SOAPBUBBLE_COLORS.length];
    case 'cheese':      return CHEESE_COLORS[ri % CHEESE_COLORS.length];
    case 'glue':        return GLUE_COLORS[ri % GLUE_COLORS.length];
    case 'prism':       return PRISM_COLORS[ri % PRISM_COLORS.length];
    case 'rubber':      return RUBBER_COLORS[ri % RUBBER_COLORS.length];
    case 'mirror':      return MIRROR_COLORS[ri % MIRROR_COLORS.length];
    case 'portal':      return PORTAL_COLORS[ri % PORTAL_COLORS.length];
    case 'warp':        return WARP_COLORS[ri % WARP_COLORS.length];
    case 'darkmatter':  return DARKMATTER_COLORS[ri % DARKMATTER_COLORS.length];
    case 'thunderstorm':return THUNDERSTORM_COLORS[ri % THUNDERSTORM_COLORS.length];
    case 'toxicmud':    return TOXICMUD_COLORS[ri % TOXICMUD_COLORS.length];
    case 'dryice':      return DRYICE_COLORS[ri % DRYICE_COLORS.length];
    case 'gravitywell': return GRAVITYWELL_COLORS[ri % GRAVITYWELL_COLORS.length];
    case 'colorbomb':   return COLORBOMB_COLORS[ri % COLORBOMB_COLORS.length];
    case 'stormcloud':  return STORMCLOUD_COLORS[ri % STORMCLOUD_COLORS.length];
    case 'gravel':      return GRAVEL_COLORS[ri % GRAVEL_COLORS.length];
    case 'charcoal':    return CHARCOAL_COLORS[ri % CHARCOAL_COLORS.length];
    case 'chalk':       return CHALK_COLORS[ri % CHALK_COLORS.length];
    case 'bedrock':     return BEDROCK_COLORS[ri % BEDROCK_COLORS.length];
    case 'mercury':     return MERCURY_COLORS[ri % MERCURY_COLORS.length];
    case 'gel':         return GEL_COLORS[ri % GEL_COLORS.length];
    case 'glue2':       return GLUE2_COLORS[ri % GLUE2_COLORS.length];
    case 'mist':        return MIST_COLORS[ri % MIST_COLORS.length];
    case 'spark':       return SPARK_COLORS[ri % SPARK_COLORS.length];
    case 'whirlwind':   return WHIRLWIND_COLORS[ri % WHIRLWIND_COLORS.length];
    case 'grass':       return GRASS_COLORS[ri % GRASS_COLORS.length];
    case 'wheat':       return WHEAT_COLORS[ri % WHEAT_COLORS.length];
    case 'cactus':      return CACTUS_COLORS[ri % CACTUS_COLORS.length];
    case 'fungi':       return FUNGI_COLORS[ri % FUNGI_COLORS.length];
    case 'firework':    return FIREWORK_COLORS[ri % FIREWORK_COLORS.length];
    case 'magicfire':   return MAGICFIRE_COLORS[ri % MAGICFIRE_COLORS.length];
    case 'plasma2':     return PLASMA2_COLORS[ri % PLASMA2_COLORS.length];
    case 'frostfire':   return FROSTFIRE_COLORS[ri % FROSTFIRE_COLORS.length];
    case 'swamp':       return SWAMP_COLORS[ri % SWAMP_COLORS.length];
    case 'coral':       return CORAL_COLORS[ri % CORAL_COLORS.length];
    case 'quickclay':   return QUICKCLAY_COLORS[ri % QUICKCLAY_COLORS.length];
    case 'lavarock':    return LAVAROCK_COLORS[ri % LAVAROCK_COLORS.length];
    case 'ember':       return EMBER_COLORS[ri % EMBER_COLORS.length];
    case 'ash':         return ASH_COLORS[ri % ASH_COLORS.length];
    case 'ironore':     return IRONORE_COLORS[ri % IRONORE_COLORS.length];
    case 'goldore':     return GOLDORE_COLORS[ri % GOLDORE_COLORS.length];
    case 'marble':      return MARBLE_COLORS[ri % MARBLE_COLORS.length];
    case 'sulfur':      return SULFUR_COLORS[ri % SULFUR_COLORS.length];
    case 'nitroglycerin':return NITROGLYCERIN_COLORS[ri % NITROGLYCERIN_COLORS.length];
    case 'wax':         return WAX_COLORS[ri % WAX_COLORS.length];
    case 'cotton':      return COTTON_COLORS[ri % COTTON_COLORS.length];
    case 'rope':        return ROPE_COLORS[ri % ROPE_COLORS.length];
    case 'paper':       return PAPER_COLORS[ri % PAPER_COLORS.length];
    case 'glass2':      return GLASS2_COLORS[ri % GLASS2_COLORS.length];
    case 'sponge':      return SPONGE_COLORS[ri % SPONGE_COLORS.length];
    case 'pumice':       return PUMICE_COLORS[ri % PUMICE_COLORS.length];
    case 'autowater':    return AUTOWATER_COLORS[ri % AUTOWATER_COLORS.length];
    case 'autosand':     return AUTOSAND_COLORS[ri % AUTOSAND_COLORS.length];
    case 'autofire':     return AUTOFIRE_COLORS[ri % AUTOFIRE_COLORS.length];
    case 'autolava':     return AUTOLAVA_COLORS[ri % AUTOLAVA_COLORS.length];
    case 'autosnow':     return AUTOSNOW_COLORS[ri % AUTOSNOW_COLORS.length];
    case 'autosteam':    return AUTOSTEAM_COLORS[ri % AUTOSTEAM_COLORS.length];
    case 'autoplant':    return AUTOPLANT_COLORS[ri % AUTOPLANT_COLORS.length];
    case 'autooil':      return AUTOOIL_COLORS[ri % AUTOOIL_COLORS.length];
    case 'autoacid':     return AUTOACID_COLORS[ri % AUTOACID_COLORS.length];
    case 'autospark':    return AUTOSPARK_COLORS[ri % AUTOSPARK_COLORS.length];
    case 'autocloud':    return AUTOCLOUD_COLORS[ri % AUTOCLOUD_COLORS.length];
    case 'autowind':     return AUTOWIND_COLORS[ri % AUTOWIND_COLORS.length];
    case 'autonuclear':  return AUTONUCLEAR_COLORS[ri % AUTONUCLEAR_COLORS.length];
    case 'autodark':     return AUTODARK_COLORS[ri % AUTODARK_COLORS.length];
    case 'autoparty':    return AUTOPARTY_COLORS[ri % AUTOPARTY_COLORS.length];
    case 'automud':      return AUTOMUD_COLORS[ri % AUTOMUD_COLORS.length];
    case 'autoice':      return AUTOICE_COLORS[ri % AUTOICE_COLORS.length];
    case 'autovirus':    return AUTOVIRUS_COLORS[ri % AUTOVIRUS_COLORS.length];
    case 'autosmoke':    return AUTOSMOKE_COLORS[ri % AUTOSMOKE_COLORS.length];
    case 'autobluefire': return AUTOBLUEFIRE_COLORS[ri % AUTOBLUEFIRE_COLORS.length];
    default: {
      const [r,g,b] = ELEMENTS[type].rgb;
      return packRGB(r,g,b);
    }
  }
}

export function getHexColor(type: ElementType): string {
  const [r,g,b] = ELEMENTS[type].rgb;
  return `rgb(${r},${g},${b})`;
}
