export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  category: 'element' | 'tool' | 'boost' | 'creature' | 'special' | 'cosmetic' | 'weapon' | 'nature' | 'superpremium';
  isPremium?: boolean;
  isSuperPremium?: boolean;
  effect?: string;
  color: string;
  owned?: boolean;
  isConsumable?: boolean;
}

export interface PremiumTier {
  name: string;
  emoji: string;
  price: number;
  color: string;
  perks: string[];
  isSuperPremium?: boolean;
}

export const PREMIUM_TIER: PremiumTier = {
  name: 'SandBox Premium',
  emoji: '👑',
  price: 3100,
  color: 'from-yellow-500 via-amber-400 to-orange-500',
  perks: [
    '🔓 Unlock SEMUA elemen premium sekaligus',
    '⚡ Speed 5x tersedia',
    '🎨 Custom warna UI (6 tema)',
    '🌸 Akses sistem musim penuh + kontrol cuaca',
    '🌈 Neon particle glow effects',
    '🚀 No frame-skip di mobile (full 60fps)',
    '💥 Mega explosion radius 2x lebih besar',
    '🧲 Semua elemen magnet & tornado gratis',
    '☄️ Meteor, Diamond, Black Hole unlock gratis',
    '🐝 Akses SEMUA makhluk hidup premium',
    '📊 FPS counter & debug info lengkap',
    '🎁 Bonus 500 poin langsung setelah beli',
    '🏆 Badge Premium 👑 eksklusif di UI',
    '🎯 Precision brush mode (1px akurat)',
    '🌊 Mega wave effect tool',
    '🔮 Fortune teller — random elemen tiap klik!',
    '💎 Unlock semua cosmetic & skin elemen',
    '🗺️ Mini-map view canvas',
    '⏸️ Frame-by-frame advance mode',
    '🎵 Particle sound effects',
    '🎪 Custom cursor api bergerak',
    '🖼️ Canvas expand 1.5x otomatis',
    '📸 Screenshot & download PNG gratis',
    '🌟 Star particle trail effect',
    '🎭 Exclusive Premium avatar frame',
  ],
};

export const SUPER_PREMIUM_TIER: PremiumTier = {
  name: 'SandBox SuperPremium',
  emoji: '💎',
  price: 99999,
  color: 'from-cyan-400 via-purple-500 to-pink-500',
  isSuperPremium: true,
  perks: [
    '👑 Semua benefit Premium INCLUDED',
    '🌌 Unlock Map SuperPremium (5x MEGA BESAR)',
    '⚡ Speed hingga 20x (ULTRA TURBO MODE)',
    '🔥 10x Point Multiplier PERMANEN selamanya!',
    '🤖 Auto-spawn mode — partikel spawn otomatis!',
    '🎆 Fireworks effect setiap dapat poin',
    '🧬 Semua elemen Experimental unlock otomatis',
    '👁️ God View — lihat semua partikel detail',
    '💥 Super Explosion radius 5x lebih besar',
    '🌀 Wormhole element eksklusif SuperPremium',
    '⭐ Star Dust element — berkilau dan indah!',
    '🧊 Cryo element — pembekuan instan semua!',
    '🔱 Trident element — petir 3 arah sekaligus!',
    '🌠 Nebula element — efek galaksi di canvas!',
    '🐲 Elder Dragon — naga dewasa super kuat!',
    '👼 Angel — makhluk suci yang menyembuhkan!',
    '🤯 Mind Blow — meledakkan semua dalam chaos!',
    '🎯 Sniper Brush — presisi 1 piksel super akurat',
    '🎪 Party Mode — confetti & warna-warni terus!',
    '🏅 Badge SuperPremium 💎 EKSKLUSIF di UI',
    '🎁 Bonus 5000 poin langsung setelah beli!',
    '🔮 Lucky Draw otomatis tiap 10 menit',
    '🌈 Semua skin kosmetik unlock otomatis',
    '🦄 Semua makhluk SuperPremium unlock',
    '🗺️ Akses semua ukuran Map',
    '💌 Nama di credits game (coming soon)',
    '🎬 Timelapse recorder unlock gratis',
    '🃏 Cheat code akses gratis selamanya',
    '⚗️ Lab mode — mix elemen custom!',
    '🌐 Multiplayer sandbox (coming soon)',
  ],
};

export const SHOP_ITEMS: ShopItem[] = [

  // ══════════════════════════════════════════════════
  // 🧪 ELEMENTS — 40 items
  // ══════════════════════════════════════════════════
  { id: 'el_antimatter', name: 'Antimatter', emoji: '🌀', description: 'Menghancurkan semua partikel di radius besar secara instan!', price: 8000, category: 'element', effect: 'unlock_antimatter', color: 'from-violet-600 to-indigo-800' },
  { id: 'el_plasma', name: 'Plasma', emoji: '🔵', description: 'Plasma super panas, membakar lebih kuat dari lava!', price: 10000, category: 'element', effect: 'unlock_plasma', color: 'from-cyan-500 to-blue-700' },
  { id: 'el_magma', name: 'Magma', emoji: '🟠', description: 'Magma bawah tanah, lebih pekat dan merusak dari lava!', price: 7000, category: 'element', effect: 'unlock_magma', color: 'from-red-600 to-orange-800' },
  { id: 'el_blackhole', name: 'Black Hole', emoji: '⚫', description: 'Menarik partikel dari jarak jauh dan menyerapnya!', price: 15000, category: 'element', isPremium: true, effect: 'unlock_blackhole', color: 'from-gray-900 to-black' },
  { id: 'el_rainbow', name: 'Rainbow', emoji: '🌈', description: 'Partikel warna-warni yang berubah terus! Pure aesthetic.', price: 12000, category: 'element', isPremium: true, effect: 'unlock_rainbow', color: 'from-red-500 via-yellow-400 to-blue-500' },
  { id: 'el_dragon', name: 'Dragon Fire', emoji: '🐉', description: 'Api naga — membakar lebih lama dan menyebar lebih luas!', price: 18000, category: 'element', isPremium: true, effect: 'unlock_dragonfire', color: 'from-orange-500 to-red-700' },
  { id: 'el_time', name: 'Time Sand', emoji: '⏳', description: 'Pasir waktu — membekukan semua elemen di sekitarnya!', price: 20000, category: 'element', isPremium: true, effect: 'unlock_timesand', color: 'from-amber-400 to-yellow-600' },
  { id: 'el_gravity', name: 'Anti-Gravity', emoji: '🪐', description: 'Membuat partikel di sekitarnya melayang ke atas!', price: 14000, category: 'element', isPremium: true, effect: 'unlock_antigravity', color: 'from-indigo-400 to-purple-600' },
  { id: 'el_meteor', name: 'Meteor', emoji: '☄️', description: 'Meteorit jatuh dan meledak dahsyat meratakan segalanya!', price: 25000, category: 'element', isPremium: true, effect: 'unlock_meteor', color: 'from-orange-600 to-red-900' },
  { id: 'el_tornado', name: 'Tornado', emoji: '🌪️', description: 'Angin puyuh yang menyedot semua partikel di sekitarnya!', price: 16000, category: 'element', isPremium: true, effect: 'unlock_tornado', color: 'from-slate-400 to-blue-700' },
  { id: 'el_electricity', name: 'Electricity', emoji: '⚡', description: 'Listrik menjalar ke semua konduktor di sekitarnya!', price: 13000, category: 'element', effect: 'unlock_electricity', color: 'from-yellow-400 to-amber-600' },
  { id: 'el_poison', name: 'Poison Gas', emoji: '☠️', description: 'Gas beracun mematikan semua makhluk hidup dalam sekejap!', price: 9000, category: 'element', effect: 'unlock_poison', color: 'from-green-500 to-emerald-800' },
  { id: 'el_magnet', name: 'Magnet', emoji: '🧲', description: 'Menarik semua partikel logam & metal ke posisinya!', price: 11000, category: 'element', isPremium: true, effect: 'unlock_magnet', color: 'from-red-500 to-rose-800' },
  { id: 'el_diamond', name: 'Diamond', emoji: '💠', description: 'Diamond super keras, TIDAK bisa dihancurkan oleh apapun!', price: 30000, category: 'element', isPremium: true, effect: 'unlock_diamond', color: 'from-cyan-300 to-sky-600' },
  { id: 'el_nuke', name: 'Nuke', emoji: '☢️', description: 'Bom nuklir — meledak dan menghancurkan SELURUH canvas!', price: 50000, category: 'element', isPremium: true, effect: 'unlock_nuke', color: 'from-green-400 to-yellow-600' },
  { id: 'el_mirror', name: 'Mirror', emoji: '🪞', description: 'Memantulkan semua partikel yang mengenainya ke arah balik!', price: 12000, category: 'element', effect: 'unlock_mirror', color: 'from-slate-300 to-gray-500' },
  { id: 'el_portal', name: 'Portal', emoji: '🔮', description: 'Teleportasi partikel yang masuk ke portal lain!', price: 22000, category: 'element', isPremium: true, effect: 'unlock_portal', color: 'from-violet-500 to-fuchsia-700' },
  { id: 'el_warp', name: 'Warp Zone', emoji: '🌀', description: 'Zona distorsi — mempercepat semua partikel di sekitarnya!', price: 17000, category: 'element', isPremium: true, effect: 'unlock_warp', color: 'from-teal-400 to-cyan-700' },
  { id: 'el_dark', name: 'Dark Matter', emoji: '🌑', description: 'Materi gelap misterius yang menyerap cahaya & partikel pelan!', price: 28000, category: 'element', isPremium: true, effect: 'unlock_darkmatter', color: 'from-gray-800 to-gray-950' },
  { id: 'el_lightning2', name: 'Thunder Storm', emoji: '🌩️', description: 'Badai petir yang menyambar acak ke semua arah!', price: 14000, category: 'element', isPremium: true, effect: 'unlock_thunderstorm', color: 'from-yellow-500 to-indigo-700' },
  { id: 'el_sticky', name: 'Slime', emoji: '🟢', description: 'Lendir lengket yang menjebak semua partikel yang lewat!', price: 6000, category: 'element', effect: 'unlock_slime', color: 'from-green-400 to-lime-600' },
  { id: 'el_soap', name: 'Soap Bubble', emoji: '🫧', description: 'Gelembung sabun naik ke atas dan meledak indah!', price: 5000, category: 'element', effect: 'unlock_soapbubble', color: 'from-sky-300 to-blue-400' },
  { id: 'el_cheese', name: 'Cheese', emoji: '🧀', description: 'Keju! Bisa dimakan makhluk hidup, meleleh kena panas!', price: 4000, category: 'element', effect: 'unlock_cheese', color: 'from-yellow-400 to-amber-500' },
  { id: 'el_glue', name: 'Super Glue', emoji: '🔧', description: 'Lem super kuat yang membekukan semua yang menempel!', price: 8500, category: 'element', effect: 'unlock_glue', color: 'from-orange-300 to-amber-600' },
  { id: 'el_crystal2', name: 'Prism Crystal', emoji: '💎', description: 'Kristal prisma yang memecah elemen apapun jadi warna-warni!', price: 19000, category: 'element', isPremium: true, effect: 'unlock_prism', color: 'from-rose-300 to-purple-500' },
  { id: 'el_sand2', name: 'Quicksand', emoji: '🏜️', description: 'Pasir hisap yang menelan makhluk hidup perlahan!', price: 7500, category: 'element', effect: 'unlock_quicksand', color: 'from-yellow-600 to-orange-700' },
  { id: 'el_lava2', name: 'Super Lava', emoji: '🌋', description: 'Lava super panas 3x lebih merusak dari lava biasa!', price: 16000, category: 'element', isPremium: true, effect: 'unlock_superlava', color: 'from-red-700 to-orange-900' },
  { id: 'el_water2', name: 'Holy Water', emoji: '💦', description: 'Air suci yang menyembuhkan makhluk hidup & menghapus racun!', price: 9000, category: 'element', effect: 'unlock_holywater', color: 'from-blue-300 to-cyan-500' },
  { id: 'el_fire2', name: 'Blue Fire', emoji: '🔵🔥', description: 'Api biru — lebih dingin tapi 2x lebih merusak dari api merah!', price: 13000, category: 'element', isPremium: true, effect: 'unlock_bluefire', color: 'from-blue-500 to-cyan-600' },
  { id: 'el_cloud2', name: 'Storm Cloud', emoji: '⛈️', description: 'Awan badai yang otomatis mengirim petir ke bawah!', price: 11000, category: 'element', effect: 'unlock_stormcloud', color: 'from-gray-500 to-slate-700' },
  { id: 'el_mud2', name: 'Toxic Mud', emoji: '🟫', description: 'Lumpur beracun yang meracuni semua yang menyentuhnya!', price: 6500, category: 'element', effect: 'unlock_toxicmud', color: 'from-amber-700 to-green-800' },
  { id: 'el_ice2', name: 'Dry Ice', emoji: '🧊', description: 'Es kering yang langsung membekukan dan mengeluarkan CO2!', price: 10000, category: 'element', isPremium: true, effect: 'unlock_dryice', color: 'from-cyan-300 to-blue-500' },
  { id: 'el_explosion', name: 'C4', emoji: '💣', description: 'Bahan peledak yang meledak hanya kalau kena api!', price: 12000, category: 'element', isPremium: true, effect: 'unlock_c4', color: 'from-green-700 to-gray-800' },
  { id: 'el_magma2', name: 'Obsidian', emoji: '🖤', description: 'Batu obsidian super keras, terbentuk dari lava yang mendingin!', price: 8000, category: 'element', effect: 'unlock_obsidian', color: 'from-gray-900 to-black' },
  { id: 'el_gravity2', name: 'Gravity Well', emoji: '🕳️', description: 'Lubang gravitasi yang menarik semua partikel ke satu titik!', price: 20000, category: 'element', isPremium: true, effect: 'unlock_gravitywell', color: 'from-indigo-900 to-black' },
  { id: 'el_rainbow2', name: 'Color Bomb', emoji: '🎆', description: 'Bom warna yang meledak dan menyebarkan partikel warna-warni!', price: 15000, category: 'element', isPremium: true, effect: 'unlock_colorbomb', color: 'from-pink-500 via-yellow-400 to-blue-500' },
  { id: 'el_wind', name: 'Wind', emoji: '💨', description: 'Angin yang mendorong semua partikel ringan ke samping!', price: 5500, category: 'element', effect: 'unlock_wind', color: 'from-sky-300 to-blue-400' },
  { id: 'el_seed', name: 'Magic Seed', emoji: '🌱', description: 'Benih ajaib yang tumbuh jadi pohon kalau ada air & tanah!', price: 6000, category: 'element', effect: 'unlock_seed', color: 'from-green-500 to-lime-700' },
  { id: 'el_rubber', name: 'Rubber', emoji: '⚫', description: 'Karet yang memantulkan semua partikel yang mengenainya!', price: 7000, category: 'element', effect: 'unlock_rubber', color: 'from-gray-700 to-gray-900' },
  { id: 'el_nuclear', name: 'Nuclear Waste', emoji: '☣️', description: 'Limbah nuklir — meracuni area luas dan bertahan lama!', price: 24000, category: 'element', isPremium: true, effect: 'unlock_nuclear', color: 'from-green-400 to-yellow-600' },

  // ══════════════════════════════════════════════════
  // 🐾 CREATURES — 30 items
  // ══════════════════════════════════════════════════
  { id: 'cr_dragon', name: 'Baby Dragon', emoji: '🦕', description: 'Naga kecil yang bergerak dan mengeluarkan api kecil!', price: 20000, category: 'creature', isPremium: true, effect: 'unlock_babydragon', color: 'from-red-500 to-orange-700' },
  { id: 'cr_unicorn', name: 'Unicorn', emoji: '🦄', description: 'Unicorn mewah yang meninggalkan jejak pelangi!', price: 25000, category: 'creature', isPremium: true, effect: 'unlock_unicorn', color: 'from-pink-400 to-purple-600' },
  { id: 'cr_ghost', name: 'Ghost', emoji: '👻', description: 'Hantu yang bisa melewati semua material & menghantui elemen!', price: 15000, category: 'creature', isPremium: true, effect: 'unlock_ghost', color: 'from-gray-300 to-slate-500' },
  { id: 'cr_robot', name: 'Robot', emoji: '🤖', description: 'Robot yang mengumpulkan semua elemen logam di sekitarnya!', price: 18000, category: 'creature', isPremium: true, effect: 'unlock_robot', color: 'from-slate-400 to-gray-600' },
  { id: 'cr_alien', name: 'Alien', emoji: '👽', description: 'Alien misterius yang mengubah elemen sekitar jadi hal aneh!', price: 22000, category: 'creature', isPremium: true, effect: 'unlock_alien', color: 'from-green-400 to-teal-600' },
  { id: 'cr_shark', name: 'Shark', emoji: '🦈', description: 'Hiu yang berenang di air dan menghancurkan partikel lain!', price: 12000, category: 'creature', effect: 'unlock_shark', color: 'from-blue-500 to-slate-700' },
  { id: 'cr_cat', name: 'Cat', emoji: '🐱', description: 'Kucing imut yang melompat-lompat mengikuti gravitasi!', price: 8000, category: 'creature', effect: 'unlock_cat', color: 'from-orange-300 to-amber-500' },
  { id: 'cr_spider', name: 'Spider', emoji: '🕷️', description: 'Laba-laba yang membuat jaring dan menjebak partikel!', price: 10000, category: 'creature', effect: 'unlock_spider', color: 'from-gray-700 to-black' },
  { id: 'cr_penguin', name: 'Penguin', emoji: '🐧', description: 'Penguin lucu yang membeku air di sekitarnya dan meluncur!', price: 9000, category: 'creature', effect: 'unlock_penguin', color: 'from-slate-600 to-gray-800' },
  { id: 'cr_snake', name: 'Snake', emoji: '🐍', description: 'Ular yang bergerak meliuk dan menelan partikel kecil!', price: 11000, category: 'creature', effect: 'unlock_snake', color: 'from-green-600 to-emerald-800' },
  { id: 'cr_butterfly', name: 'Butterfly', emoji: '🦋', description: 'Kupu-kupu yang terbang meninggalkan jejak bunga!', price: 7000, category: 'creature', effect: 'unlock_butterfly', color: 'from-pink-400 to-rose-500' },
  { id: 'cr_phoenix', name: 'Phoenix', emoji: '🦅', description: 'Phoenix yang terbang meninggalkan api dan lahir kembali!', price: 35000, category: 'creature', isPremium: true, effect: 'unlock_phoenix', color: 'from-red-500 to-yellow-500' },
  { id: 'cr_whale', name: 'Whale', emoji: '🐳', description: 'Paus raksasa yang berenang dan menyemprot air ke atas!', price: 16000, category: 'creature', isPremium: true, effect: 'unlock_whale', color: 'from-blue-600 to-indigo-700' },
  { id: 'cr_dinosaur', name: 'Dinosaur', emoji: '🦖', description: 'Dino besar yang menghancurkan semua material di jalurnya!', price: 30000, category: 'creature', isPremium: true, effect: 'unlock_dinosaur', color: 'from-lime-500 to-green-700' },
  { id: 'cr_demon', name: 'Demon', emoji: '😈', description: 'Iblis yang mengubah semua elemen menjadi lava & api!', price: 40000, category: 'creature', isPremium: true, effect: 'unlock_demon', color: 'from-red-700 to-rose-900' },
  { id: 'cr_wolf', name: 'Wolf', emoji: '🐺', description: 'Serigala yang berlari cepat dan mengusir makhluk lain!', price: 13000, category: 'creature', effect: 'unlock_wolf', color: 'from-gray-500 to-slate-700' },
  { id: 'cr_lion', name: 'Lion', emoji: '🦁', description: 'Singa raja hutan yang menguasai semua makhluk di sekitarnya!', price: 18000, category: 'creature', isPremium: true, effect: 'unlock_lion', color: 'from-yellow-500 to-amber-700' },
  { id: 'cr_octopus', name: 'Octopus', emoji: '🐙', description: 'Gurita yang berenang di air dan menyemprotkan tinta hitam!', price: 14000, category: 'creature', effect: 'unlock_octopus', color: 'from-purple-500 to-violet-700' },
  { id: 'cr_eagle', name: 'Eagle', emoji: '🦅', description: 'Elang yang terbang tinggi dan menukik menangkap mangsa!', price: 20000, category: 'creature', isPremium: true, effect: 'unlock_eagle', color: 'from-amber-600 to-orange-800' },
  { id: 'cr_turtle', name: 'Turtle', emoji: '🐢', description: 'Kura-kura lambat tapi kuat, cangkangnya tahan api!', price: 8000, category: 'creature', effect: 'unlock_turtle', color: 'from-green-600 to-teal-700' },
  { id: 'cr_rabbit', name: 'Rabbit', emoji: '🐰', description: 'Kelinci yang melompat super cepat dan cepat berkembang biak!', price: 7000, category: 'creature', effect: 'unlock_rabbit', color: 'from-pink-300 to-rose-400' },
  { id: 'cr_bear', name: 'Bear', emoji: '🐻', description: 'Beruang besar yang sangat kuat dan tidak takut api!', price: 15000, category: 'creature', isPremium: true, effect: 'unlock_bear', color: 'from-amber-700 to-orange-800' },
  { id: 'cr_jellyfish', name: 'Jellyfish', emoji: '🪼', description: 'Ubur-ubur yang melayang di air dan menyetrum yang menyentuhnya!', price: 11000, category: 'creature', effect: 'unlock_jellyfish', color: 'from-pink-400 to-purple-500' },
  { id: 'cr_crab2', name: 'King Crab', emoji: '🦀', description: 'Kepiting raja besar yang berjalan menyamping sangat cepat!', price: 10000, category: 'creature', effect: 'unlock_kingcrab', color: 'from-red-600 to-orange-700' },
  { id: 'cr_bee2', name: 'Queen Bee', emoji: '🐝', description: 'Ratu lebah yang memanggil pasukan lebah dari sarangnya!', price: 16000, category: 'creature', isPremium: true, effect: 'unlock_queenbee', color: 'from-yellow-500 to-amber-600' },
  { id: 'cr_elder', name: 'Elder Dragon', emoji: '🐲', description: 'Naga dewasa raksasa — menyemburkan api ke semua arah!', price: 80000, category: 'creature', isSuperPremium: true, effect: 'unlock_elderdragon', color: 'from-red-600 via-orange-500 to-yellow-400' },
  { id: 'cr_angel', name: 'Angel', emoji: '👼', description: 'Malaikat suci yang menyembuhkan semua makhluk di sekitarnya!', price: 60000, category: 'creature', isSuperPremium: true, effect: 'unlock_angel', color: 'from-yellow-200 to-white' },
  { id: 'cr_kraken', name: 'Kraken', emoji: '🦑', description: 'Kraken raksasa yang muncul dari lautan dan menghancurkan semua!', price: 100000, category: 'creature', isSuperPremium: true, effect: 'unlock_kraken', color: 'from-indigo-700 to-slate-900' },
  { id: 'cr_titan', name: 'Titan', emoji: '👾', description: 'Titan kosmik yang mengubah semua partikel jadi energi!', price: 150000, category: 'creature', isSuperPremium: true, effect: 'unlock_titan', color: 'from-purple-600 to-indigo-900' },
  { id: 'cr_god', name: 'Sand God', emoji: '🌟', description: 'Dewa pasir yang menciptakan dan menghancurkan semua elemen!', price: 500000, category: 'creature', isSuperPremium: true, effect: 'unlock_sandgod', color: 'from-yellow-300 via-orange-400 to-red-500' },

  // ══════════════════════════════════════════════════
  // 🔧 TOOLS — 20 items
  // ══════════════════════════════════════════════════
  { id: 'tool_bigsplash', name: 'Big Splash', emoji: '💦', description: 'Brush radius 3x lebih besar dari ukuran max normal!', price: 5000, category: 'tool', effect: 'unlock_bigsplash', color: 'from-blue-500 to-cyan-700' },
  { id: 'tool_circle', name: 'Circle Brush', emoji: '⭕', description: 'Brush berbentuk lingkaran sempurna, bukan kotak!', price: 6000, category: 'tool', effect: 'unlock_circlebrush', color: 'from-teal-500 to-emerald-700' },
  { id: 'tool_spray', name: 'Spray Can', emoji: '🎨', description: 'Spray partikel acak dalam radius lebar seperti pilox!', price: 8000, category: 'tool', effect: 'unlock_spray', color: 'from-pink-500 to-rose-700' },
  { id: 'tool_line', name: 'Line Tool', emoji: '📏', description: 'Gambar garis lurus sempurna dari titik A ke B!', price: 7000, category: 'tool', effect: 'unlock_linetool', color: 'from-indigo-500 to-violet-700' },
  { id: 'tool_fill', name: 'Fill Bucket', emoji: '🪣', description: 'Isi seluruh area kosong sekaligus dengan satu klik!', price: 10000, category: 'tool', effect: 'unlock_fillbucket', color: 'from-orange-400 to-red-600' },
  { id: 'tool_dropper', name: 'Color Dropper', emoji: '💉', description: 'Ambil jenis elemen dari canvas — klik partikel untuk pilih!', price: 4000, category: 'tool', effect: 'unlock_dropper', color: 'from-rose-400 to-pink-600' },
  { id: 'tool_magicwand', name: 'Magic Wand', emoji: '🪄', description: 'Seleksi area dan transform semua partikel di dalamnya!', price: 15000, category: 'tool', isPremium: true, effect: 'unlock_magicwand', color: 'from-purple-400 to-fuchsia-600' },
  { id: 'tool_stamp', name: 'Stamp Tool', emoji: '🔖', description: 'Salin dan tempel area canvas ke lokasi lain!', price: 12000, category: 'tool', isPremium: true, effect: 'unlock_stamp', color: 'from-amber-400 to-orange-600' },
  { id: 'tool_eraser_big', name: 'Mega Eraser', emoji: '🧽', description: 'Penghapus raksasa 5x ukuran eraser biasa!', price: 3000, category: 'tool', effect: 'unlock_megaeraser', color: 'from-gray-400 to-slate-600' },
  { id: 'tool_mirror2', name: 'Mirror Draw', emoji: '🪞', description: 'Gambar di satu sisi, otomatis dicerminkan di sisi lain!', price: 13000, category: 'tool', isPremium: true, effect: 'unlock_mirrordraw', color: 'from-sky-400 to-blue-600' },
  { id: 'tool_gravity_brush', name: 'Gravity Brush', emoji: '🌀', description: 'Brush yang mendorong partikel sekitar menjauh saat menggambar!', price: 9000, category: 'tool', effect: 'unlock_gravitybrush', color: 'from-violet-400 to-purple-700' },
  { id: 'tool_text', name: 'Text Stamp', emoji: '✏️', description: 'Tulis teks dan stamp ke canvas sebagai partikel!', price: 20000, category: 'tool', isPremium: true, effect: 'unlock_textstamp', color: 'from-emerald-400 to-green-600' },
  { id: 'tool_shape', name: 'Shape Maker', emoji: '🔷', description: 'Buat bentuk geometri: kotak, segitiga, lingkaran!', price: 11000, category: 'tool', effect: 'unlock_shapemaker', color: 'from-blue-400 to-indigo-600' },
  { id: 'tool_rainbow_brush', name: 'Rainbow Brush', emoji: '🌈', description: 'Brush yang menggambar dengan warna pelangi bergantian!', price: 8000, category: 'tool', isPremium: true, effect: 'unlock_rainbowbrush', color: 'from-red-400 via-yellow-400 to-blue-500' },
  { id: 'tool_clone', name: 'Clone Brush', emoji: '👥', description: 'Salin partikel yang ada di canvas ke tempat lain!', price: 14000, category: 'tool', isPremium: true, effect: 'unlock_clonebrush', color: 'from-teal-400 to-cyan-600' },
  { id: 'tool_shrink', name: 'Shrink Ray', emoji: '🔬', description: 'Perkecil semua partikel dalam area menjadi 1x1 piksel!', price: 16000, category: 'tool', isPremium: true, effect: 'unlock_shrinkray', color: 'from-green-500 to-emerald-700' },
  { id: 'tool_vacuum', name: 'Vacuum', emoji: '🌪️', description: 'Sedot semua partikel dalam radius ke satu titik!', price: 10000, category: 'tool', effect: 'unlock_vacuum', color: 'from-gray-500 to-slate-700' },
  { id: 'tool_paint', name: 'Paint Roller', emoji: '🖌️', description: 'Cat seluruh baris atau kolom sekaligus dengan elemen aktif!', price: 7500, category: 'tool', effect: 'unlock_paintroller', color: 'from-orange-400 to-amber-600' },
  { id: 'tool_spiral', name: 'Spiral Draw', emoji: '🌀', description: 'Gambar spiral otomatis dari titik tengah keluar!', price: 12000, category: 'tool', isPremium: true, effect: 'unlock_spiral', color: 'from-purple-500 to-pink-600' },
  { id: 'tool_randomize', name: 'Randomizer', emoji: '🎲', description: 'Spawn elemen random setiap klik — surprise!', price: 5000, category: 'tool', effect: 'unlock_randomizer', color: 'from-yellow-400 to-green-500' },

  // ══════════════════════════════════════════════════
  // ⚡ BOOSTS — 18 items (consumable)
  // ══════════════════════════════════════════════════
  { id: 'boost_points2x', name: 'Points 2x', emoji: '⚡', description: '2x point dari spawn selama 60 detik!', price: 4000, category: 'boost', effect: 'boost_2x_60s', isConsumable: true, color: 'from-yellow-400 to-orange-500' },
  { id: 'boost_points5x', name: 'Points 5x', emoji: '🚀', description: '5x point dari spawn selama 30 detik!', price: 9000, category: 'boost', effect: 'boost_5x_30s', isConsumable: true, color: 'from-green-400 to-emerald-600' },
  { id: 'boost_points10x', name: 'Points 10x', emoji: '💫', description: '10x point selama 20 detik — premium only!', price: 20000, category: 'boost', isPremium: true, effect: 'boost_10x_20s', isConsumable: true, color: 'from-rose-400 to-pink-600' },
  { id: 'boost_autoclear', name: 'Auto-Clear', emoji: '🧹', description: 'Membersihkan canvas secara otomatis dengan animasi!', price: 3000, category: 'boost', effect: 'boost_autoclear', isConsumable: true, color: 'from-purple-500 to-violet-700' },
  { id: 'boost_rain', name: 'Rain Storm', emoji: '🌧️', description: 'Hujan lebat air dari atas canvas selama 10 detik!', price: 5000, category: 'boost', effect: 'boost_rain', isConsumable: true, color: 'from-blue-600 to-indigo-800' },
  { id: 'boost_volcano', name: 'Volcano Burst', emoji: '🌋', description: 'Letusan gunung berapi lava dari tengah canvas!', price: 6000, category: 'boost', effect: 'boost_volcano', isConsumable: true, color: 'from-red-500 to-orange-700' },
  { id: 'boost_snowstorm', name: 'Blizzard', emoji: '🌨️', description: 'Badai salju turun lebat dari langit selama 15 detik!', price: 4000, category: 'boost', effect: 'boost_snowstorm', isConsumable: true, color: 'from-blue-300 to-indigo-500' },
  { id: 'boost_goldrain', name: 'Coin Rain', emoji: '🪙', description: 'Dapat bonus +200 koin langsung! Murah meriah!', price: 1500, category: 'boost', effect: 'boost_coinrain', isConsumable: true, color: 'from-yellow-400 to-amber-600' },
  { id: 'boost_megacoin', name: 'Mega Coin', emoji: '💰', description: 'Dapat bonus +1000 koin langsung! Jackpot!', price: 6000, category: 'boost', effect: 'boost_megacoin', isConsumable: true, color: 'from-yellow-500 to-orange-600' },
  { id: 'boost_earthquake', name: 'Earthquake', emoji: '🌍', description: 'Gempa bumi! Semua partikel bergetar & berpindah acak!', price: 7000, category: 'boost', effect: 'boost_earthquake', isConsumable: true, color: 'from-amber-600 to-orange-800' },
  { id: 'boost_gravity_flip', name: 'Gravity Flip', emoji: '🙃', description: 'Balik gravitasi! Semua partikel jatuh ke ATAS selama 10 detik!', price: 10000, category: 'boost', isPremium: true, effect: 'boost_gravityflip', isConsumable: true, color: 'from-violet-500 to-indigo-700' },
  { id: 'boost_rainbow_mode', name: 'Rainbow Mode', emoji: '🌈', description: 'Semua partikel jadi warna rainbow selama 30 detik!', price: 8000, category: 'boost', isPremium: true, effect: 'boost_rainbowmode', isConsumable: true, color: 'from-red-400 via-yellow-400 to-blue-500' },
  { id: 'boost_supercoin', name: 'Super Coin Bag', emoji: '💎💰', description: 'Dapat bonus +5000 koin langsung! Ultra jackpot!', price: 25000, category: 'boost', isPremium: true, effect: 'boost_supercoin', isConsumable: true, color: 'from-yellow-400 to-amber-500' },
  { id: 'boost_freeze', name: 'Time Freeze', emoji: '⏸️', description: 'Bekukan semua partikel selama 10 detik — tidak ada yang bergerak!', price: 8000, category: 'boost', effect: 'boost_freeze', isConsumable: true, color: 'from-cyan-400 to-blue-600' },
  { id: 'boost_speed_burst', name: 'Speed Burst', emoji: '⚡🚀', description: 'Semua partikel bergerak 5x lebih cepat selama 15 detik!', price: 6000, category: 'boost', effect: 'boost_speedburst', isConsumable: true, color: 'from-yellow-500 to-red-500' },
  { id: 'boost_magnet_pull', name: 'Mega Magnet', emoji: '🧲💥', description: 'Semua partikel ditarik ke tengah canvas sekaligus!', price: 7500, category: 'boost', effect: 'boost_megamagnet', isConsumable: true, color: 'from-red-600 to-rose-800' },
  { id: 'boost_acid_rain', name: 'Acid Shower', emoji: '🟢🌧️', description: 'Hujan asam turun dari atas — melarutkan semua material!', price: 9000, category: 'boost', isPremium: true, effect: 'boost_acidshower', isConsumable: true, color: 'from-lime-500 to-green-700' },
  { id: 'boost_lucky_draw', name: 'Lucky Draw', emoji: '🎰', description: 'Spin roulette — menang 0 sampai 10000 koin!', price: 3000, category: 'boost', effect: 'boost_luckydraw', isConsumable: true, color: 'from-yellow-400 to-orange-600' },

  // ══════════════════════════════════════════════════
  // 🌿 NATURE — 15 items
  // ══════════════════════════════════════════════════
  { id: 'nat_jungle', name: 'Jungle Biome', emoji: '🌴', description: 'Spawn hutan tropis lebat dengan pohon, tanaman, dan air!', price: 8000, category: 'nature', effect: 'unlock_jungle', isConsumable: true, color: 'from-green-600 to-emerald-800' },
  { id: 'nat_desert', name: 'Desert Biome', emoji: '🏜️', description: 'Spawn padang pasir dengan pasir, batu, dan kaktus!', price: 7000, category: 'nature', effect: 'unlock_desert', isConsumable: true, color: 'from-yellow-500 to-amber-700' },
  { id: 'nat_ocean', name: 'Ocean Biome', emoji: '🌊', description: 'Spawn lautan penuh air, pasir bawah laut, dan ikan!', price: 9000, category: 'nature', effect: 'unlock_ocean', isConsumable: true, color: 'from-blue-500 to-indigo-700' },
  { id: 'nat_volcano_biome', name: 'Volcano Biome', emoji: '🌋', description: 'Spawn gunung berapi dengan lava, batu, dan asap!', price: 11000, category: 'nature', isPremium: true, effect: 'unlock_volcanoB', isConsumable: true, color: 'from-red-600 to-orange-800' },
  { id: 'nat_arctic', name: 'Arctic Biome', emoji: '🧊', description: 'Spawn kutub es dengan salju, es, dan embun beku!', price: 8500, category: 'nature', effect: 'unlock_arctic', isConsumable: true, color: 'from-cyan-400 to-blue-600' },
  { id: 'nat_meteor_shower', name: 'Meteor Shower', emoji: '🌠', description: 'Hujan meteor dari langit selama 5 detik — chaos total!', price: 15000, category: 'nature', isPremium: true, effect: 'unlock_meteorshower', isConsumable: true, color: 'from-orange-500 to-red-700' },
  { id: 'nat_aurora', name: 'Aurora Borealis', emoji: '🌌', description: 'Efek aurora indah di langit canvas selama 20 detik!', price: 12000, category: 'nature', isPremium: true, effect: 'unlock_aurora', isConsumable: true, color: 'from-teal-400 to-purple-600' },
  { id: 'nat_flood', name: 'Great Flood', emoji: '🌊', description: 'Air naik perlahan dari bawah memenuhi seluruh canvas!', price: 6000, category: 'nature', effect: 'unlock_flood', isConsumable: true, color: 'from-blue-600 to-cyan-800' },
  { id: 'nat_wildfire', name: 'Wildfire', emoji: '🔥', description: 'Api menyebar dari kiri ke kanan membakar semua!', price: 7500, category: 'nature', effect: 'unlock_wildfire', isConsumable: true, color: 'from-red-500 to-orange-600' },
  { id: 'nat_crystal_cave', name: 'Crystal Cave', emoji: '💎', description: 'Spawn gua kristal dengan berbagai kristal berwarna-warni!', price: 18000, category: 'nature', isPremium: true, effect: 'unlock_crystalcave', isConsumable: true, color: 'from-violet-400 to-purple-700' },
  { id: 'nat_mushroom', name: 'Mushroom Forest', emoji: '🍄', description: 'Spawn hutan jamur ajaib yang tumbuh terus di tanah lembab!', price: 10000, category: 'nature', effect: 'unlock_mushroomforest', isConsumable: true, color: 'from-purple-500 to-rose-600' },
  { id: 'nat_swamp', name: 'Swamp Biome', emoji: '🌿', description: 'Spawn rawa dengan lumpur, air hitam, dan tanaman rawa!', price: 9000, category: 'nature', effect: 'unlock_swamp', isConsumable: true, color: 'from-green-700 to-teal-900' },
  { id: 'nat_galaxy', name: 'Galaxy Event', emoji: '🌌', description: 'Spawn efek galaksi dengan nebula dan bintang jatuh!', price: 25000, category: 'nature', isPremium: true, effect: 'unlock_galaxy', isConsumable: true, color: 'from-indigo-600 to-purple-900' },
  { id: 'nat_sandstorm', name: 'Sandstorm', emoji: '🌪️', description: 'Badai pasir dari kanan ke kiri menghantam semua!', price: 8000, category: 'nature', effect: 'unlock_sandstorm', isConsumable: true, color: 'from-yellow-600 to-amber-800' },
  { id: 'nat_tsunami', name: 'Mega Tsunami', emoji: '🌊💥', description: 'Tsunami raksasa dari kiri — air 3 kali lebih tinggi!', price: 14000, category: 'nature', isPremium: true, effect: 'unlock_megatsu', isConsumable: true, color: 'from-blue-700 to-indigo-900' },

  // ══════════════════════════════════════════════════
  // 🗺️ MAP SIZE — 3 items
  // ══════════════════════════════════════════════════
  { id: 'map_large', name: 'Besarkan Map', emoji: '🌏', description: 'Perluas Map jadi 1.5x lebih besar! Bisa dikecilkan kembali di Pengaturan.', price: 50000, category: 'special', effect: 'map_large', color: 'from-emerald-500 to-teal-700' },
  { id: 'map_super', name: 'Map Super Gede', emoji: '🌌', description: 'Map jadi 2x SUPER BESAR! Bisa kembali ke normal/besar di Pengaturan.', price: 150000, category: 'special', isPremium: true, effect: 'map_super', color: 'from-violet-600 to-indigo-900' },
  { id: 'map_superpremium', name: 'Map SuperPremium', emoji: '🌠', description: 'Map MEGA RAKSASA 5x lebih besar dari normal! Setara luas negara! Butuh SuperPremium!', price: 999999, category: 'special', isSuperPremium: true, effect: 'map_superpremium', color: 'from-cyan-500 via-purple-600 to-pink-600' },

  // ══════════════════════════════════════════════════
  // 🔐 ADMIN — 1 item
  // ══════════════════════════════════════════════════
  { id: 'sp_adminbasic', name: 'AdminPanel Basic', emoji: '⚙️🔐', description: 'Buka Admin Panel Basic tanpa klik ⚡ 20x! Akses fitur admin langsung dari Shop. Termasuk: Set Coins, Clear Canvas, Pilih Elemen, & Speed Control!', price: 600000, category: 'special', effect: 'unlock_adminbasic', color: 'from-red-600 via-orange-500 to-yellow-500' },

  // ══════════════════════════════════════════════════
  // ✨ SPECIAL — 15 items
  // ══════════════════════════════════════════════════
  { id: 'sp_lucky', name: 'Lucky Box', emoji: '🎁', description: 'Buka kotak acak — dapat 1 elemen random (bisa premium)!', price: 2500, category: 'special', effect: 'unlock_luckybox', isConsumable: true, color: 'from-pink-500 to-rose-600' },
  { id: 'sp_megabox', name: 'Mega Lucky Box', emoji: '🎀', description: 'Buka mega box — dapat 3 elemen random sekaligus!', price: 6000, category: 'special', effect: 'unlock_megaluckybox', isConsumable: true, color: 'from-purple-500 to-fuchsia-600' },
  { id: 'sp_refund', name: 'Refund Token', emoji: '↩️', description: 'Kembalikan 1 item yang dibeli dan dapat 80% poin kembali!', price: 5000, category: 'special', effect: 'unlock_refund', color: 'from-slate-400 to-gray-600' },
  { id: 'sp_undo', name: 'Undo Stack', emoji: '↩️', description: 'Bisa undo hingga 10 langkah terakhir (Ctrl+Z)!', price: 15000, category: 'special', isPremium: true, effect: 'unlock_undo', color: 'from-blue-400 to-indigo-600' },
  { id: 'sp_screenshot', name: 'Screenshot Tool', emoji: '📸', description: 'Screenshot canvas dan simpan sebagai gambar PNG!', price: 8000, category: 'special', effect: 'unlock_screenshot', color: 'from-gray-500 to-slate-700' },
  { id: 'sp_timelapse', name: 'Timelapse Record', emoji: '🎬', description: 'Rekam timelapse canvas dan simpan sebagai GIF!', price: 30000, category: 'special', isPremium: true, effect: 'unlock_timelapse', color: 'from-red-400 to-rose-600' },
  { id: 'sp_cheat', name: 'Cheat Code', emoji: '🃏', description: 'Unlock semua item gratis selama 5 menit — premium only!', price: 50000, category: 'special', isPremium: true, effect: 'unlock_cheat', color: 'from-yellow-400 to-amber-500' },
  { id: 'sp_autofarm', name: 'Auto Farm Turbo', emoji: '🤖⚡', description: 'Auto farm dengan kecepatan 10x dan elemen acak bergantian!', price: 20000, category: 'special', isPremium: true, effect: 'unlock_autoturbo', color: 'from-green-500 to-teal-700' },
  { id: 'sp_canvas_save', name: 'Canvas Save', emoji: '💾', description: 'Simpan dan load canvas kapanpun — up to 3 slot!', price: 25000, category: 'special', isPremium: true, effect: 'unlock_canvassave', color: 'from-blue-500 to-indigo-700' },
  { id: 'sp_sandbox_share', name: 'Share Canvas', emoji: '📤', description: 'Bagikan screenshot canvas ke clipboard langsung!', price: 10000, category: 'special', effect: 'unlock_share', color: 'from-teal-400 to-cyan-600' },
  { id: 'sp_minimap', name: 'Mini Map', emoji: '🗺️', description: 'Tampilkan mini map di pojok canvas untuk navigasi!', price: 18000, category: 'special', isPremium: true, effect: 'unlock_minimap', color: 'from-emerald-500 to-teal-700' },
  { id: 'sp_fps_unlock', name: 'FPS Unlocker', emoji: '🎯', description: 'Unlock FPS counter detail dan performance stats!', price: 5000, category: 'special', effect: 'unlock_fps', color: 'from-gray-400 to-slate-600' },
  { id: 'sp_sandbox_lab', name: 'Sandbox Lab', emoji: '⚗️', description: 'Mode laboratorium — mix elemen custom dengan formula sendiri!', price: 100000, category: 'special', isSuperPremium: true, effect: 'unlock_lab', color: 'from-cyan-500 to-purple-600' },
  { id: 'sp_time_machine', name: 'Time Machine', emoji: '⏰', description: 'Putar ulang histori canvas 60 detik ke belakang!', price: 80000, category: 'special', isSuperPremium: true, effect: 'unlock_timemachine', color: 'from-purple-500 to-indigo-700' },
  { id: 'sp_world_editor', name: 'World Editor', emoji: '🌍', description: 'Edit canvas dengan presisi piksel per piksel!', price: 50000, category: 'special', isPremium: true, effect: 'unlock_worldeditor', color: 'from-green-500 to-emerald-700' },

  // ══════════════════════════════════════════════════
  // 🎨 COSMETIC — 20 items
  // ══════════════════════════════════════════════════
  { id: 'cos_fire_blue', name: 'Blue Fire Skin', emoji: '🔵🔥', description: 'Ubah warna api menjadi biru es yang keren!', price: 5000, category: 'cosmetic', effect: 'skin_bluefire', color: 'from-blue-400 to-cyan-600' },
  { id: 'cos_gold_sand', name: 'Gold Sand Skin', emoji: '✨🏖️', description: 'Ubah pasir menjadi pasir emas berkilau!', price: 6000, category: 'cosmetic', effect: 'skin_goldsand', color: 'from-yellow-400 to-amber-600' },
  { id: 'cos_neon_water', name: 'Neon Water Skin', emoji: '💙', description: 'Ubah air menjadi liquid neon yang menyala!', price: 7000, category: 'cosmetic', isPremium: true, effect: 'skin_neonwater', color: 'from-cyan-400 to-blue-500' },
  { id: 'cos_lava_purple', name: 'Purple Lava Skin', emoji: '💜', description: 'Ubah lava menjadi lava ungu misterius!', price: 8000, category: 'cosmetic', isPremium: true, effect: 'skin_purplelava', color: 'from-purple-500 to-violet-700' },
  { id: 'cos_pixel_art', name: 'Pixel Art Mode', emoji: '🎮', description: 'Mode pixel art — grid terlihat jelas untuk karya seni!', price: 10000, category: 'cosmetic', isPremium: true, effect: 'skin_pixelart', color: 'from-green-400 to-emerald-600' },
  { id: 'cos_glow', name: 'Particle Glow', emoji: '✨', description: 'Semua partikel punya efek glow neon menyala!', price: 12000, category: 'cosmetic', isPremium: true, effect: 'skin_glow', color: 'from-rose-400 to-pink-600' },
  { id: 'cos_minimal', name: 'Minimal UI Theme', emoji: '⬜', description: 'UI minimalis putih bersih — fokus ke canvas!', price: 5000, category: 'cosmetic', effect: 'skin_minimal', color: 'from-gray-300 to-slate-400' },
  { id: 'cos_retro', name: 'Retro CRT Theme', emoji: '📺', description: 'Tema retro CRT dengan scanlines dan warna vintage!', price: 9000, category: 'cosmetic', isPremium: true, effect: 'skin_retro', color: 'from-green-500 to-emerald-700' },
  { id: 'cos_cursor', name: 'Custom Cursor', emoji: '🖱️', description: 'Cursor jadi api kecil yang bergerak mengikuti mouse!', price: 7500, category: 'cosmetic', effect: 'skin_cursor', color: 'from-red-400 to-orange-600' },
  { id: 'cos_bg', name: 'Animated BG', emoji: '🌌', description: 'Background canvas beranimasi galaxy/nebula yang keren!', price: 15000, category: 'cosmetic', isPremium: true, effect: 'skin_animatedbg', color: 'from-indigo-600 to-purple-800' },
  { id: 'cos_sand_red', name: 'Red Sand Skin', emoji: '🔴🏖️', description: 'Pasir berubah warna merah Mars!', price: 4000, category: 'cosmetic', effect: 'skin_redsand', color: 'from-red-500 to-orange-600' },
  { id: 'cos_water_green', name: 'Toxic Water Skin', emoji: '🟢💧', description: 'Air berubah jadi hijau beracun aesthetic!', price: 4500, category: 'cosmetic', effect: 'skin_greenwater', color: 'from-green-500 to-lime-600' },
  { id: 'cos_fire_rainbow', name: 'Rainbow Fire Skin', emoji: '🌈🔥', description: 'Api berubah warna-warni pelangi yang indah!', price: 10000, category: 'cosmetic', isPremium: true, effect: 'skin_rainbowfire', color: 'from-red-400 via-yellow-400 to-purple-500' },
  { id: 'cos_ice_pink', name: 'Pink Ice Skin', emoji: '🩷🧊', description: 'Es berubah warna pink pastel yang cute!', price: 5500, category: 'cosmetic', effect: 'skin_pinkice', color: 'from-pink-400 to-rose-500' },
  { id: 'cos_dark_mode', name: 'Ultra Dark Mode', emoji: '🌑', description: 'UI berubah jadi ultra dark dengan aksen merah!', price: 8000, category: 'cosmetic', effect: 'skin_ultradark', color: 'from-gray-900 to-black' },
  { id: 'cos_ui_galaxy', name: 'Galaxy UI Theme', emoji: '🌌✨', description: 'UI berubah tema galaksi dengan bintang bergerak!', price: 12000, category: 'cosmetic', isPremium: true, effect: 'skin_galaxyui', color: 'from-indigo-600 to-purple-800' },
  { id: 'cos_ui_neon', name: 'Neon UI Theme', emoji: '💜⚡', description: 'UI tema neon cyberpunk dengan efek glow keren!', price: 15000, category: 'cosmetic', isPremium: true, effect: 'skin_neonui', color: 'from-purple-500 to-pink-600' },
  { id: 'cos_trail', name: 'Cursor Trail', emoji: '✨🖱️', description: 'Kursor meninggalkan jejak partikel bintang!', price: 6000, category: 'cosmetic', effect: 'skin_trail', color: 'from-yellow-400 to-orange-500' },
  { id: 'cos_lava_green', name: 'Toxic Lava Skin', emoji: '🟢🌋', description: 'Lava berubah warna hijau radioaktif!', price: 7000, category: 'cosmetic', isPremium: true, effect: 'skin_greenlava', color: 'from-lime-500 to-green-700' },
  { id: 'cos_particle_sparkle', name: 'Sparkle Effect', emoji: '💫', description: 'Semua partikel berkilau dengan efek sparkle!', price: 18000, category: 'cosmetic', isPremium: true, effect: 'skin_sparkle', color: 'from-yellow-300 to-pink-400' },

  // ══════════════════════════════════════════════════
  // ⚔️ WEAPONS — 15 items
  // ══════════════════════════════════════════════════
  { id: 'wp_airstrike', name: 'Airstrike', emoji: '💥', description: 'Bom udara — spawn 10 bom sekaligus yang jatuh dari atas!', price: 12000, category: 'weapon', effect: 'unlock_airstrike', isConsumable: true, color: 'from-red-600 to-rose-800' },
  { id: 'wp_laser', name: 'Laser Beam', emoji: '🔴', description: 'Sinar laser horizontal yang membakar semua yang dilewati!', price: 10000, category: 'weapon', effect: 'unlock_laser', isConsumable: true, color: 'from-red-500 to-pink-700' },
  { id: 'wp_freeze_ray', name: 'Freeze Ray', emoji: '❄️', description: 'Sinar beku yang membekukan semua elemen di jalurnya!', price: 9000, category: 'weapon', effect: 'unlock_freezeray', isConsumable: true, color: 'from-cyan-400 to-blue-600' },
  { id: 'wp_flamethrower', name: 'Flamethrower', emoji: '🔥', description: 'Semburan api panjang dari kiri ke kanan canvas!', price: 8000, category: 'weapon', effect: 'unlock_flamethrower', isConsumable: true, color: 'from-orange-500 to-red-700' },
  { id: 'wp_tsunami', name: 'Tsunami', emoji: '🌊', description: 'Gelombang air raksasa menyapu seluruh canvas!', price: 11000, category: 'weapon', isPremium: true, effect: 'unlock_tsunami', isConsumable: true, color: 'from-blue-600 to-indigo-800' },
  { id: 'wp_blackhole_bomb', name: 'Black Hole Bomb', emoji: '💣', description: 'Bom black hole — menyerap SEMUA partikel dalam 5 detik!', price: 30000, category: 'weapon', isPremium: true, effect: 'unlock_bhbomb', isConsumable: true, color: 'from-gray-800 to-black' },
  { id: 'wp_acid_rain', name: 'Acid Rain', emoji: '🟢', description: 'Hujan asam dari atas yang melarutkan semua material!', price: 14000, category: 'weapon', isPremium: true, effect: 'unlock_acidrain', isConsumable: true, color: 'from-lime-500 to-green-700' },
  { id: 'wp_supernova', name: 'Supernova', emoji: '💥', description: 'SUPERNOVA — menghancurkan seluruh canvas sekaligus dengan gaya!', price: 50000, category: 'weapon', isPremium: true, effect: 'unlock_supernova', isConsumable: true, color: 'from-yellow-400 via-orange-500 to-red-600' },
  { id: 'wp_nuke_bomb', name: 'Nuclear Bomb', emoji: '☢️💥', description: 'Bom nuklir yang meledak 3x lebih besar dari supernova!', price: 80000, category: 'weapon', isSuperPremium: true, effect: 'unlock_nukebomb', isConsumable: true, color: 'from-green-400 to-yellow-500' },
  { id: 'wp_lightning_storm', name: 'Lightning Storm', emoji: '⚡🌩️', description: 'Petir menyambar 20 titik acak di canvas sekaligus!', price: 15000, category: 'weapon', isPremium: true, effect: 'unlock_lightningstorm', isConsumable: true, color: 'from-yellow-400 to-indigo-600' },
  { id: 'wp_vortex', name: 'Vortex Cannon', emoji: '🌀💥', description: 'Tembakan vortex yang menyedot semua partikel ke satu titik!', price: 18000, category: 'weapon', isPremium: true, effect: 'unlock_vortex', isConsumable: true, color: 'from-violet-500 to-indigo-700' },
  { id: 'wp_plasma_cannon', name: 'Plasma Cannon', emoji: '🔵💥', description: 'Tembakan plasma yang meledak dan mengubah area jadi plasma!', price: 22000, category: 'weapon', isPremium: true, effect: 'unlock_plasmacannon', isConsumable: true, color: 'from-cyan-500 to-blue-700' },
  { id: 'wp_gravity_bomb', name: 'Gravity Bomb', emoji: '🪐💥', description: 'Bom gravitasi yang membalikkan gravitasi di radius besar!', price: 20000, category: 'weapon', isPremium: true, effect: 'unlock_gravitybomb', isConsumable: true, color: 'from-indigo-500 to-purple-700' },
  { id: 'wp_sand_storm', name: 'Sand Cannon', emoji: '🏜️💨', description: 'Meriam pasir yang menembakkan 500 pasir sekaligus!', price: 6000, category: 'weapon', effect: 'unlock_sandcannon', isConsumable: true, color: 'from-yellow-500 to-orange-700' },
  { id: 'wp_god_beam', name: 'God Beam', emoji: '☀️💥', description: 'Sinar Tuhan — menghancurkan SEGALANYA dalam satu tembakan!', price: 500000, category: 'weapon', isSuperPremium: true, effect: 'unlock_godbeam', isConsumable: true, color: 'from-yellow-300 via-white to-yellow-300' },

  // ══════════════════════════════════════════════════
  // 💎 SUPERPREMIUM EXCLUSIVE — 10 items
  // ══════════════════════════════════════════════════
  { id: 'sp2_wormhole', name: 'Wormhole', emoji: '🕳️✨', description: 'Lubang cacing yang teleportasi partikel ke dimensi lain!', price: 200000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_wormhole', color: 'from-purple-600 to-black' },
  { id: 'sp2_stardust', name: 'Star Dust', emoji: '⭐', description: 'Debu bintang yang berkilau dan mengubah elemen jadi energi!', price: 150000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_stardust', color: 'from-yellow-300 to-orange-400' },
  { id: 'sp2_cryo', name: 'Cryo Freeze', emoji: '🧊❄️', description: 'Pembekuan instan — seluruh canvas membeku dalam 1 detik!', price: 180000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_cryo', color: 'from-cyan-400 to-indigo-600' },
  { id: 'sp2_trident', name: 'Trident Storm', emoji: '🔱⚡', description: 'Petir 3 arah sekaligus dari satu titik — ultra powerful!', price: 220000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_trident', color: 'from-blue-400 to-purple-600' },
  { id: 'sp2_nebula', name: 'Nebula', emoji: '🌠', description: 'Efek nebula galaksi yang indah mengisi seluruh canvas!', price: 160000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_nebula', color: 'from-indigo-500 to-pink-600' },
  { id: 'sp2_mindblow', name: 'Mind Blow', emoji: '🤯', description: 'Chaos total — semua elemen berubah random setiap detik!', price: 300000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_mindblow', color: 'from-red-500 via-yellow-400 to-purple-600' },
  { id: 'sp2_party_mode', name: 'Party Mode', emoji: '🎪🎉', description: 'Mode pesta — confetti dan warna-warni terus menerus!', price: 120000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_partymode', isConsumable: true, color: 'from-pink-500 via-yellow-400 to-cyan-500' },
  { id: 'sp2_dimension', name: 'Dimension Rift', emoji: '🌀🌌', description: 'Celah dimensi yang mengubah canvas jadi portal lain!', price: 400000, category: 'superpremium', isSuperPremium: true, effect: 'unlock_dimension', isConsumable: true, color: 'from-purple-600 via-indigo-700 to-black' },
  { id: 'sp2_universe', name: 'Big Bang', emoji: '💥🌌', description: 'Big Bang — hancurkan dan ciptakan ulang seluruh canvas!', price: 999999, category: 'superpremium', isSuperPremium: true, effect: 'unlock_bigbang', isConsumable: true, color: 'from-yellow-400 via-orange-500 to-red-700' },
  { id: 'sp2_sandbox_god', name: 'Sandbox God Mode', emoji: '🌟👑', description: 'Mode Tuhan — unlock SEGALANYA & infinite coins selamanya!', price: 9999999, category: 'superpremium', isSuperPremium: true, effect: 'unlock_godmode', color: 'from-yellow-300 via-white to-yellow-300' },
];

export const SHOP_CATEGORIES = [
  { id: 'all', label: 'Semua', emoji: '🛍️' },
  { id: 'element', label: 'Elemen', emoji: '🧪' },
  { id: 'creature', label: 'Makhluk', emoji: '🐾' },
  { id: 'tool', label: 'Alat', emoji: '🔧' },
  { id: 'boost', label: 'Boost', emoji: '⚡' },
  { id: 'nature', label: 'Alam', emoji: '🌿' },
  { id: 'weapon', label: 'Senjata', emoji: '⚔️' },
  { id: 'cosmetic', label: 'Kosmetik', emoji: '🎨' },
  { id: 'special', label: 'Spesial', emoji: '✨' },
  { id: 'superpremium', label: 'SuperPremium', emoji: '💎' },
];

export type OwnedItems = Set<string>;
export type PointMultiplier = { value: number; endsAt: number };

export function canAfford(points: number, price: number): boolean {
  return points >= price;
}

export function buyItem(
  points: number,
  item: ShopItem,
  owned: OwnedItems,
  hasPremium: boolean,
  hasSuperPremium: boolean
): { success: boolean; newPoints: number; message: string } {
  if (!item.isConsumable && owned.has(item.id)) {
    return { success: false, newPoints: points, message: 'Sudah dimiliki!' };
  }
  if (item.isSuperPremium && !hasSuperPremium) {
    return { success: false, newPoints: points, message: '💎 Butuh SuperPremium!' };
  }
  if (item.isPremium && !hasPremium && !hasSuperPremium) {
    return { success: false, newPoints: points, message: '👑 Butuh Premium!' };
  }
  if (points < item.price) {
    return { success: false, newPoints: points, message: `Kurang ${(item.price - points).toLocaleString()} poin!` };
  }
  return {
    success: true,
    newPoints: points - item.price,
    message: `✅ ${item.name} berhasil dibeli!`,
  };
}
