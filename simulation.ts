import {
  getCOLS as _getCOLS, getROWS as _getROWS, Element, ElementType, getColorInt,
  FIRE_COLORS, LAVA_COLORS, SMOKE_COLORS, EXPLOSION_COLORS, ACID_COLORS,
  WATER_COLORS, STEAM_COLORS, LIGHTNING_COLORS, VIRUS_COLORS, CRYSTAL_COLORS,
  SNOW_COLORS, CLOUD_COLORS, HONEY_COLORS, BUBBLE_COLORS, GASOLINE_COLORS,
  VOID_COLORS, GUNPOWDER_COLORS,
  ANTIMATTER_COLORS, PLASMA_COLORS, MAGMA_COLORS, BLACKHOLE_COLORS,
  RAINBOW_COLORS, DRAGONFIRE_COLORS, TIMESAND_COLORS, ANTIGRAVITY_COLORS
} from './constants';

export type Grid = (Element | null)[];

export function createGrid(): Grid {
  return new Array(_getROWS() * _getCOLS()).fill(null);
}

export function createEl(type: ElementType): Element {
  return {
    type,
    color: getColorInt(type),
    updated: false,
    life: getInitialLife(type),
    meta: 0,
  };
}

function getInitialLife(type: ElementType): number {
  switch (type) {
    case 'fire':        return 30 + ((Math.random() * 40) | 0);
    case 'smoke':       return 40 + ((Math.random() * 40) | 0);
    case 'explosion':   return 5  + ((Math.random() * 5)  | 0);
    case 'steam':       return 50 + ((Math.random() * 50) | 0);
    case 'lightning':   return 3  + ((Math.random() * 3)  | 0);
    case 'bubble':      return 30 + ((Math.random() * 30) | 0);
    case 'leaf':        return 60 + ((Math.random() * 60) | 0);
    case 'virus':       return 80 + ((Math.random() * 80) | 0);
    case 'antimatter':  return 60 + ((Math.random() * 40) | 0);
    case 'plasma':      return 80 + ((Math.random() * 40) | 0);
    case 'dragonfire':  return 120 + ((Math.random() * 60) | 0);
    case 'rainbow':     return 999;
    case 'void':        return 999;
    case 'blackhole':   return 999;
    case 'timesand':    return 999;
    case 'antigravity': return 999;
    default:            return 999;
  }
}

function idx(r: number, c: number): number {
  return r * _getCOLS() + c;
}

function get(grid: Grid, r: number, c: number): Element | null {
  const ROWS = _getROWS(); const COLS = _getCOLS();
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return { type: 'stone', color: 0, updated: true };
  return grid[idx(r, c)];
}

function isEmpty(grid: Grid, r: number, c: number): boolean {
  const ROWS = _getROWS(); const COLS = _getCOLS();
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
  return grid[idx(r, c)] === null;
}

function isType(grid: Grid, r: number, c: number, ...types: ElementType[]): boolean {
  const ROWS = _getROWS(); const COLS = _getCOLS();
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
  const el = grid[idx(r, c)];
  if (!el) return false;
  return types.includes(el.type);
}

function swap(grid: Grid, r1: number, c1: number, r2: number, c2: number) {
  const i1 = idx(r1, c1);
  const i2 = idx(r2, c2);
  const tmp = grid[i1];
  grid[i1] = grid[i2];
  grid[i2] = tmp;
  if (grid[i1]) grid[i1]!.updated = true;
  if (grid[i2]) grid[i2]!.updated = true;
}

function set(grid: Grid, r: number, c: number, el: Element | null) {
  const ROWS = _getROWS(); const COLS = _getCOLS();
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  grid[idx(r, c)] = el;
  if (el) el.updated = true;
}

// Fast RNG
let _seed = 12345;
function fastRand(): number {
  _seed ^= _seed << 13;
  _seed ^= _seed >> 17;
  _seed ^= _seed << 5;
  return (_seed >>> 0) / 0xffffffff;
}

// Flammable check
function isFlammable(type: ElementType): boolean {
  return ['wood','plant','oil','gasoline','leaf','gunpowder','honey'].includes(type);
}

// Destroyable by void/acid
function isDestroyable(type: ElementType): boolean {
  return !['stone','metal','concrete','void','glass'].includes(type) && type !== 'empty';
}

export function stepGrid(grid: Grid): void {
  for (let i = 0; i < grid.length; i++) {
    const el = grid[i];
    if (el) el.updated = false;
  }

  const leftToRight = fastRand() > 0.5;
  const ROWS = _getROWS(); const COLS = _getCOLS();

  for (let r = ROWS - 1; r >= 0; r--) {
    for (let ci = 0; ci < COLS; ci++) {
      const c = leftToRight ? ci : COLS - 1 - ci;
      const el = grid[idx(r, c)];
      if (!el || el.updated) continue;

      switch (el.type) {
        case 'sand':       updateSand(grid, r, c); break;
        case 'water':      updateWater(grid, r, c); break;
        case 'fire':       updateFire(grid, r, c, el); break;
        case 'lava':       updateLava(grid, r, c); break;
        case 'smoke':      updateSmoke(grid, r, c, el); break;
        case 'plant':      updatePlant(grid, r, c); break;
        case 'explosion':  updateExplosion(grid, r, c, el); break;
        case 'oil':        updateOil(grid, r, c); break;
        case 'acid':       updateAcid(grid, r, c); break;
        case 'ice':        updateIce(grid, r, c); break;
        case 'mud':        updateMud(grid, r, c); break;
        case 'steam':      updateSteam(grid, r, c, el); break;
        case 'gunpowder':  updateGunpowder(grid, r, c); break;
        case 'snow':       updateSnow(grid, r, c); break;
        case 'cloud':      updateCloud(grid, r, c, el); break;
        case 'lightning':  updateLightning(grid, r, c, el); break;
        case 'metal':      updateMetal(grid, r, c); break;
        case 'salt':       updateSalt(grid, r, c); break;
        case 'saltwater':  updateSaltwater(grid, r, c); break;
        case 'virus':      updateVirus(grid, r, c, el); break;
        case 'crystal':    updateCrystal(grid, r, c); break;
        case 'honey':      updateHoney(grid, r, c); break;
        case 'bubble':     updateBubble(grid, r, c, el); break;
        case 'void':        updateVoid(grid, r, c); break;
        case 'clone':       updateClone(grid, r, c); break;
        case 'gasoline':    updateGasoline(grid, r, c); break;
        case 'leaf':        updateLeaf(grid, r, c, el); break;
        // SHOP ELEMENTS
        case 'antimatter':  updateAntimatter(grid, r, c, el); break;
        case 'plasma':      updatePlasma(grid, r, c, el); break;
        case 'magma':       updateMagma(grid, r, c); break;
        case 'blackhole':   updateBlackhole(grid, r, c, el); break;
        case 'rainbow':     updateRainbow(grid, r, c, el); break;
        case 'dragonfire':  updateDragonfire(grid, r, c, el); break;
        case 'timesand':    updateTimesand(grid, r, c); break;
        case 'antigravity': updateAntigravity(grid, r, c); break;
        // NEW SHOP ELEMENTS
        case 'quicksand':   updateQuicksand(grid, r, c); break;
        case 'superlava':   updateSuperlava(grid, r, c); break;
        case 'holywater':   updateHolywater(grid, r, c); break;
        case 'bluefire':    updateBluefire(grid, r, c, el); break;
        case 'c4':          updateC4(grid, r, c, el); break;
        case 'nuclearwaste':updateNuclearwaste(grid, r, c, el); break;
        case 'wind':        updateWind(grid, r, c); break;
        case 'seed':        updateSeed(grid, r, c); break;
        case 'fog':         updateFog(grid, r, c, el); break;
        case 'web':         break; // static
        case 'potion':      updatePotion(grid, r, c); break;
        case 'tar':         updateTar(grid, r, c); break;
        case 'obsidian':    break; // ultra static
        case 'tidalwave':   updateTidalwave(grid, r, c); break;
        case 'stardust':    updateStardust(grid, r, c, el); break;
        case 'cryo':        updateCryo(grid, r, c); break;
        case 'trident':     updateTrident(grid, r, c, el); break;
        case 'nebula':      updateNebula(grid, r, c, el); break;
        case 'mindblow':    updateMindblow(grid, r, c, el); break;
        case 'party':       updateParty(grid, r, c, el); break;
        // MISSING SHOP ELEMENTS
        case 'nuke':        updateNuke(grid, r, c, el); break;
        case 'slime':       updateSlime(grid, r, c); break;
        case 'soapbubble':  updateSoapbubble(grid, r, c, el); break;
        case 'cheese':      updateCheese(grid, r, c); break;
        case 'glue':        break; // static sticky
        case 'prism':       updatePrism(grid, r, c); break;
        case 'rubber':      break; // static bouncy
        case 'mirror':      break; // static reflective
        case 'portal':      updatePortal(grid, r, c, el); break;
        case 'warp':        updateWarp(grid, r, c); break;
        case 'darkmatter':  updateDarkmatter(grid, r, c); break;
        case 'thunderstorm':updateThunderstorm(grid, r, c, el); break;
        case 'toxicmud':    updateToxicmud(grid, r, c); break;
        case 'dryice':      updateDryice(grid, r, c); break;
        case 'gravitywell': updateGravitywell(grid, r, c); break;
        case 'colorbomb':   updateColorbomb(grid, r, c, el); break;
        // NEW SHOP CREATURES
        case 'wolf':        updateWolf(grid, r, c, el); break;
        case 'lion':        updateLion(grid, r, c, el); break;
        case 'octopus':     updateOctopus(grid, r, c, el); break;
        case 'eagle':       updateEagle(grid, r, c, el); break;
        case 'turtle':      updateTurtle(grid, r, c, el); break;
        case 'rabbit':      updateRabbit(grid, r, c, el); break;
        case 'bear':        updateBear(grid, r, c, el); break;
        case 'jellyfish':   updateJellyfish(grid, r, c, el); break;
        case 'kingcrab':    updateKingcrab(grid, r, c, el); break;
        case 'queenbee':    updateQueenbee(grid, r, c, el); break;
        case 'elderdragon': updateElderdragon(grid, r, c, el); break;
        case 'angel':       updateAngel(grid, r, c, el); break;
        case 'kraken':      updateKraken(grid, r, c, el); break;
        case 'titan':       updateTitan(grid, r, c, el); break;
        case 'sandgod':     updateSandgod(grid, r, c, el); break;
        // LIFE ELEMENTS
        case 'ant':       updateAnt(grid, r, c, el); break;
        case 'fish':      updateFish(grid, r, c, el); break;
        case 'bird':      updateBird(grid, r, c, el); break;
        case 'worm':      updateWorm(grid, r, c, el); break;
        case 'frog':      updateFrog(grid, r, c, el); break;
        case 'crab':      updateCrab(grid, r, c, el); break;
        case 'bee':       updateBee(grid, r, c, el); break;
        case 'mushroom':  updateMushroom(grid, r, c); break;
        // NEW FREE ELEMENTS
        case 'gravel':    updateGravel(grid, r, c); break;
        case 'charcoal':  updateCharcoal(grid, r, c); break;
        case 'chalk':     updateChalk(grid, r, c); break;
        case 'mercury':   updateMercury(grid, r, c); break;
        case 'gel':       updateGel(grid, r, c); break;
        case 'glue2':     updateGlue2(grid, r, c); break;
        case 'mist':      updateMist(grid, r, c, el); break;
        case 'spark':     updateSpark(grid, r, c, el); break;
        case 'whirlwind': updateWhirlwind(grid, r, c); break;
        case 'grass':     updateGrass(grid, r, c); break;
        case 'wheat':     updateWheat(grid, r, c); break;
        case 'cactus':    updateCactus(grid, r, c); break;
        case 'fungi':     updateFungi(grid, r, c); break;
        case 'firework':  updateFirework(grid, r, c, el); break;
        case 'magicfire': updateMagicfire(grid, r, c, el); break;
        case 'plasma2':   updatePlasma2(grid, r, c, el); break;
        case 'frostfire': updateFrostfire(grid, r, c, el); break;
        case 'swamp':     updateSwamp(grid, r, c); break;
        case 'coral':     updateCoral(grid, r, c); break;
        case 'quickclay': updateQuickclay(grid, r, c); break;
        case 'ember':     updateEmber(grid, r, c, el); break;
        case 'ash':       updateAsh(grid, r, c, el); break;
        case 'sulfur':    updateSulfur(grid, r, c); break;
        case 'nitroglycerin': updateNitroglycerin(grid, r, c, el); break;
        case 'wax':       updateWax(grid, r, c); break;
        case 'cotton':    updateCotton(grid, r, c); break;
        case 'rope':      updateRope(grid, r, c); break;
        case 'paper':     updatePaper(grid, r, c); break;
        case 'sponge':    updateSponge(grid, r, c); break;
        case 'pumice':    updatePumice(grid, r, c); break;
        case 'bedrock': case 'marble': case 'ironore': case 'goldore':
        case 'lavarock': case 'glass2': case 'rubber': case 'mirror':
        case 'obsidian': case 'web': case 'glue': break; // static
        // AUTO ELEMENTS
        case 'autowater':    updateAutoElement(grid, r, c, el, 'water', 3); break;
        case 'autosand':     updateAutoElement(grid, r, c, el, 'sand', 4); break;
        case 'autofire':     updateAutoElement(grid, r, c, el, 'fire', 5); break;
        case 'autolava':     updateAutoElement(grid, r, c, el, 'lava', 6); break;
        case 'autosnow':     updateAutoElement(grid, r, c, el, 'snow', 4); break;
        case 'autosteam':    updateAutoElement(grid, r, c, el, 'steam', 5); break;
        case 'autoplant':    updateAutoElement(grid, r, c, el, 'plant', 8); break;
        case 'autooil':      updateAutoElement(grid, r, c, el, 'oil', 4); break;
        case 'autoacid':     updateAutoElement(grid, r, c, el, 'acid', 4); break;
        case 'autospark':    updateAutoElement(grid, r, c, el, 'spark', 6); break;
        case 'autocloud':    updateAutoElement(grid, r, c, el, 'cloud', 10); break;
        case 'autowind':     updateAutoElement(grid, r, c, el, 'wind', 3); break;
        case 'autonuclear':  updateAutoElement(grid, r, c, el, 'nuclearwaste', 8); break;
        case 'autodark':     updateAutoElement(grid, r, c, el, 'darkmatter', 10); break;
        case 'autoparty':    updateAutoElement(grid, r, c, el, 'party', 5); break;
        case 'automud':      updateAutoElement(grid, r, c, el, 'mud', 5); break;
        case 'autoice':      updateAutoElement(grid, r, c, el, 'ice', 6); break;
        case 'autovirus':    updateAutoElement(grid, r, c, el, 'virus', 8); break;
        case 'autosmoke':    updateAutoElement(grid, r, c, el, 'smoke', 4); break;
        case 'autobluefire': updateAutoElement(grid, r, c, el, 'bluefire', 5); break;
        default: break;
      }
    }
  }
}

// ══════════════════════════════════════════════════
//  LIFE ELEMENTS PHYSICS
// ══════════════════════════════════════════════════

// ─── ANT ───────────────────────────────────────────────────────
function updateAnt(grid: Grid, r: number, c: number, el: Element) {
  // meta: direction (0=left, 1=right)
  if (el.meta === undefined) el.meta = fastRand() > 0.5 ? 1 : 0;

  // Die from fire/lava/acid
  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid','virus','poison')) {
      set(grid, r, c, null); return;
    }
  }

  // Walk on ground
  const dir = el.meta === 1 ? 1 : -1;
  const below = get(grid, r+1, c);
  if (below && below.type !== 'empty') {
    // On ground — walk horizontally
    if (isEmpty(grid, r, c+dir)) {
      swap(grid, r, c, r, c+dir);
    } else {
      // Try to climb
      if (isEmpty(grid, r-1, c+dir) && isEmpty(grid, r-1, c)) {
        swap(grid, r, c, r-1, c+dir);
      } else {
        el.meta = el.meta === 1 ? 0 : 1; // flip direction
      }
    }
  } else {
    // Fall
    if (isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
    else if (isEmpty(grid, r+1, c+dir)) swap(grid, r, c, r+1, c+dir);
  }
}

// ─── FISH ────────────────────────────────────────────────────────
function updateFish(grid: Grid, r: number, c: number, el: Element) {
  if (el.meta === undefined) el.meta = fastRand() > 0.5 ? 1 : 0;

  // Die from fire/acid
  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid','lightning')) {
      set(grid, r, c, null); return;
    }
  }

  // Must be in water to move freely
  const inWater = isType(grid, r, c, 'fish') && (
    isType(grid, r+1, c, 'water','saltwater') ||
    isType(grid, r-1, c, 'water','saltwater') ||
    isType(grid, r, c+1, 'water','saltwater') ||
    isType(grid, r, c-1, 'water','saltwater') ||
    isEmpty(grid, r+1, c)
  );

  const dir = el.meta === 1 ? 1 : -1;
  if (fastRand() < 0.7) {
    // Swim horizontally through water
    if (isType(grid, r, c+dir, 'water','saltwater') && fastRand() < 0.6) {
      swap(grid, r, c, r, c+dir);
    } else if (isType(grid, r, c-dir, 'water','saltwater') && fastRand() < 0.3) {
      el.meta = el.meta === 1 ? 0 : 1;
      swap(grid, r, c, r, c-dir);
    } else if (fastRand() < 0.1) {
      el.meta = el.meta === 1 ? 0 : 1;
    }
    // Swim vertically sometimes
    if (fastRand() < 0.2) {
      const vdir = fastRand() > 0.5 ? 1 : -1;
      if (isType(grid, r+vdir, c, 'water','saltwater')) swap(grid, r, c, r+vdir, c);
    }
  }

  // Sink/fall if no water
  if (!inWater && isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
}

// ─── BIRD ────────────────────────────────────────────────────────
function updateBird(grid: Grid, r: number, c: number, el: Element) {
  if (el.meta === undefined) el.meta = fastRand() > 0.5 ? 1 : 0;

  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid','lightning')) {
      set(grid, r, c, null); return;
    }
  }

  const dir = el.meta === 1 ? 1 : -1;
  // Birds fly — move diagonally up-sideways
  if (fastRand() < 0.6) {
    if (isEmpty(grid, r-1, c+dir)) {
      swap(grid, r, c, r-1, c+dir);
    } else if (isEmpty(grid, r, c+dir)) {
      swap(grid, r, c, r, c+dir);
    } else if (isEmpty(grid, r-1, c)) {
      swap(grid, r, c, r-1, c);
    } else {
      el.meta = el.meta === 1 ? 0 : 1;
    }
  } else if (fastRand() < 0.1) {
    // Sometimes dip down
    if (isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
  }

  // Wrap: if at top, come back down
  if (r <= 1 && fastRand() < 0.3) {
    el.meta = el.meta === 1 ? 0 : 1;
    if (isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
  }
}

// ─── WORM ────────────────────────────────────────────────────────
function updateWorm(grid: Grid, r: number, c: number, el: Element) {
  if (el.meta === undefined) el.meta = fastRand() > 0.5 ? 1 : 0;

  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid')) {
      set(grid, r, c, null); return;
    }
  }

  const dir = el.meta === 1 ? 1 : -1;
  // Worm digs through sand & soil, moves through empty
  if (isEmpty(grid, r+1, c) && fastRand() < 0.4) {
    swap(grid, r, c, r+1, c);
  } else if (isType(grid, r, c+dir, 'sand','mud') && fastRand() < 0.3) {
    // Dig through sand
    set(grid, r, c+dir, null);
    swap(grid, r, c, r, c+dir);
  } else if (isEmpty(grid, r, c+dir) && fastRand() < 0.5) {
    swap(grid, r, c, r, c+dir);
  } else if (fastRand() < 0.1) {
    el.meta = el.meta === 1 ? 0 : 1;
  }
}

// ─── FROG ────────────────────────────────────────────────────────
function updateFrog(grid: Grid, r: number, c: number, el: Element) {
  if (el.meta === undefined) el.meta = 0; // jump timer

  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid')) {
      set(grid, r, c, null); return;
    }
  }

  el.meta = (el.meta + 1) % 20;
  // Jump every 20 frames
  if (el.meta === 0) {
    const jumpDir = fastRand() > 0.5 ? 1 : -1;
    const jumpH = 2; // jump 2 cells
    if (isEmpty(grid, r-jumpH, c+jumpDir) && isEmpty(grid, r-1, c+jumpDir)) {
      swap(grid, r, c, r-jumpH, c+jumpDir);
    } else if (isEmpty(grid, r, c+jumpDir)) {
      swap(grid, r, c, r, c+jumpDir);
    }
  } else {
    // Fall with gravity
    if (isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
    else if (isType(grid, r+1, c, 'water','saltwater') && fastRand() < 0.3) {
      // Frogs like water, swim
      if (isEmpty(grid, r, c + (fastRand() > 0.5 ? 1 : -1))) {
        const d = fastRand() > 0.5 ? 1 : -1;
        if (isEmpty(grid, r, c+d)) swap(grid, r, c, r, c+d);
      }
    }
  }
}

// ─── CRAB ────────────────────────────────────────────────────────
function updateCrab(grid: Grid, r: number, c: number, el: Element) {
  if (el.meta === undefined) el.meta = fastRand() > 0.5 ? 1 : 0;

  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid')) {
      set(grid, r, c, null); return;
    }
  }

  // Crab walks sideways on sand
  const dir = el.meta === 1 ? 1 : -1;
  const below = get(grid, r+1, c);
  if (below && below.type !== 'empty') {
    // On ground
    if (fastRand() < 0.4) {
      if (isEmpty(grid, r, c+dir)) {
        swap(grid, r, c, r, c+dir);
      } else {
        el.meta = el.meta === 1 ? 0 : 1;
      }
    }
  } else {
    if (isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
  }
}

// ─── BEE ─────────────────────────────────────────────────────────
function updateBee(grid: Grid, r: number, c: number, el: Element) {
  if (el.meta === undefined) el.meta = fastRand() > 0.5 ? 1 : 0;

  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid','lightning')) {
      set(grid, r, c, null); return;
    }
  }

  // Bees fly like birds but buzz more erratically
  const dir = el.meta === 1 ? 1 : -1;
  if (fastRand() < 0.5) {
    const choices = [
      [r-1, c+dir], [r, c+dir], [r-1, c], [r+1, c+dir],
    ];
    const [nr, nc] = choices[(fastRand() * choices.length) | 0];
    if (isEmpty(grid, nr, nc)) {
      swap(grid, r, c, nr, nc);
    } else {
      el.meta = el.meta === 1 ? 0 : 1;
    }
  }

  // Bees near plant produce honey
  const nrs = [r-1, r+1, r, r];
  const ncs = [c, c, c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'plant') && fastRand() < 0.002) {
      // Drop honey below
      if (isEmpty(grid, r+1, c)) set(grid, r+1, c, createEl('honey'));
    }
  }

  if (r <= 1) {
    el.meta = el.meta === 1 ? 0 : 1;
    if (isEmpty(grid, r+1, c)) swap(grid, r, c, r+1, c);
  }
}

// ─── MUSHROOM ────────────────────────────────────────────────────
function updateMushroom(grid: Grid, r: number, c: number) {
  if (fastRand() > 0.005) return;

  const killers = [r-1,r+1,r,r];
  const killerC = [c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, killers[i], killerC[i], 'fire','lava','acid')) {
      set(grid, r, c, null); return;
    }
  }

  // Grow sideways on damp ground
  const nrs = [r, r];
  const ncs = [c-1, c+1];
  for (let i = 0; i < 2; i++) {
    if (isEmpty(grid, nrs[i], ncs[i]) && isType(grid, nrs[i]+1, ncs[i], 'mud','sand','stone','wood') && fastRand() < 0.02) {
      set(grid, nrs[i], ncs[i], createEl('mushroom'));
    }
  }
  // Mushroom needs something below
  if (!get(grid, r+1, c)) {
    set(grid, r, c, null);
  }
}

// ─── SAND ───────────────────────────────────────────────────────
function updateSand(grid: Grid, r: number, c: number) {
  const below = get(grid, r + 1, c);
  if (!below) { swap(grid, r, c, r + 1, c); return; }
  if (['water','oil','saltwater','gasoline','honey','acid'].includes(below.type)) {
    swap(grid, r, c, r + 1, c); return;
  }
  const dir = fastRand() > 0.5 ? 1 : -1;
  const bl = get(grid, r + 1, c + dir);
  const bl2 = get(grid, r + 1, c - dir);
  if (!bl || ['water','oil','saltwater','gasoline'].includes(bl?.type ?? '')) {
    swap(grid, r, c, r + 1, c + dir);
  } else if (!bl2 || ['water','oil','saltwater','gasoline'].includes(bl2?.type ?? '')) {
    swap(grid, r, c, r + 1, c - dir);
  }
  // Sand + water = mud
  const dirs4 = [[0,1],[0,-1],[1,0],[-1,0]];
  for (const [dr,dc] of dirs4) {
    if (isType(grid, r+dr, c+dc, 'water') && fastRand() < 0.002) {
      set(grid, r, c, createEl('mud'));
      set(grid, r+dr, c+dc, null);
      return;
    }
  }
}

// ─── WATER ──────────────────────────────────────────────────────
function updateWater(grid: Grid, r: number, c: number) {
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  if (isType(grid, r + 1, c, 'gasoline','oil')) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); return; }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (!nb) continue;
    if (['fire','lava'].includes(nb.type) && fastRand() < 0.02) set(grid, r, c, createEl('steam'));
    if (nb.type === 'ice' && fastRand() < 0.01) set(grid, r, c, createEl('ice'));
    if (nb.type === 'salt' && fastRand() < 0.05) {
      set(grid, r, c, createEl('saltwater'));
      set(grid, nrs[i], ncs[i], null);
    }
  }
  const el = grid[idx(r, c)];
  if (el) el.color = WATER_COLORS[(fastRand() * WATER_COLORS.length) | 0];
}

// ─── FIRE ───────────────────────────────────────────────────────
function updateFire(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 30) - 1;
  if (el.life <= 0) {
    set(grid, r, c, fastRand() < 0.3 ? createEl('smoke') : null);
    return;
  }
  el.color = FIRE_COLORS[(fastRand() * FIRE_COLORS.length) | 0];

  const nrs = [r-1, r+1, r,   r,   r-1, r-1];
  const ncs = [c,   c,   c-1, c+1, c-1, c+1];
  for (let i = 0; i < nrs.length; i++) {
    const nr = nrs[i]; const nc = ncs[i];
    const nb = get(grid, nr, nc);
    if (!nb) continue;
    if (isFlammable(nb.type) && fastRand() < 0.01) set(grid, nr, nc, createEl('fire'));
    if (nb.type === 'gunpowder' && fastRand() < 0.05) set(grid, nr, nc, createEl('explosion'));
    if (nb.type === 'water'     && fastRand() < 0.05) { set(grid, nr, nc, createEl('steam')); el.life = 0; }
    if (nb.type === 'ice'       && fastRand() < 0.05) { set(grid, nr, nc, createEl('water')); el.life = 0; }
    if (nb.type === 'snow'      && fastRand() < 0.08) { set(grid, nr, nc, createEl('water')); }
    if (nb.type === 'saltwater' && fastRand() < 0.04) { set(grid, nr, nc, createEl('steam')); el.life = 0; }
  }

  if (isEmpty(grid, r - 1, c) && fastRand() < 0.5) {
    swap(grid, r, c, r - 1, c);
    if (fastRand() < 0.3 && isEmpty(grid, r, c)) set(grid, r, c, createEl('smoke'));
  }
}

// ─── LAVA ───────────────────────────────────────────────────────
function updateLava(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = LAVA_COLORS[(fastRand() * LAVA_COLORS.length) | 0];

  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); return; }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (!nb) continue;
    if (isFlammable(nb.type) && fastRand() < 0.01) set(grid, nrs[i], ncs[i], createEl('fire'));
    if (nb.type === 'gunpowder' && fastRand() < 0.05) set(grid, nrs[i], ncs[i], createEl('explosion'));
    if (['water','saltwater'].includes(nb.type) && fastRand() < 0.05) {
      set(grid, nrs[i], ncs[i], createEl('steam'));
      set(grid, r, c, createEl('stone'));
    }
    if (nb.type === 'ice'  && fastRand() < 0.08) set(grid, nrs[i], ncs[i], createEl('water'));
    if (nb.type === 'snow' && fastRand() < 0.1)  set(grid, nrs[i], ncs[i], createEl('water'));
    if (nb.type === 'sand' && fastRand() < 0.002) set(grid, nrs[i], ncs[i], createEl('glass'));
    if (nb.type === 'metal'&& fastRand() < 0.001) set(grid, nrs[i], ncs[i], createEl('lava'));
  }
}

// ─── SMOKE ──────────────────────────────────────────────────────
function updateSmoke(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 40) - 1;
  if (el.life <= 0) { set(grid, r, c, null); return; }
  el.color = SMOKE_COLORS[((el.life * 3) | 0) % SMOKE_COLORS.length];

  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r - 1, c))       { swap(grid, r, c, r - 1, c); return; }
  if (isEmpty(grid, r - 1, c + dir)) { swap(grid, r, c, r - 1, c + dir); return; }
  if (isEmpty(grid, r - 1, c - dir)) { swap(grid, r, c, r - 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); }
}

// ─── PLANT ──────────────────────────────────────────────────────
function updatePlant(grid: Grid, r: number, c: number) {
  if (fastRand() > 0.1) return;
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'water','saltwater') && fastRand() < 0.03) {
      set(grid, nrs[i], ncs[i], createEl('plant'));
    }
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.02) {
      set(grid, r, c, createEl('fire'));
      return;
    }
  }
}

// ─── EXPLOSION ──────────────────────────────────────────────────
function updateExplosion(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 5) - 1;
  el.color = EXPLOSION_COLORS[(fastRand() * EXPLOSION_COLORS.length) | 0];
  if (el.life <= 0) { set(grid, r, c, null); }

  const radius = 5;
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr * dr + dc * dc <= radius * radius && fastRand() < 0.6) {
        const nb = get(grid, r + dr, c + dc);
        if (nb && !['stone','metal','concrete','glass'].includes(nb.type) && nb.type !== 'explosion') {
          set(grid, r + dr, c + dc, fastRand() < 0.5 ? createEl('fire') : null);
        }
        // Chain explosion
        if (nb && ['gunpowder','explosion'].includes(nb.type) && fastRand() < 0.3) {
          set(grid, r + dr, c + dc, createEl('explosion'));
        }
      }
    }
  }
}

// ─── OIL ────────────────────────────────────────────────────────
function updateOil(grid: Grid, r: number, c: number) {
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  if (isType(grid, r+1, c, 'water','saltwater')) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.03) {
      set(grid, r, c, createEl('fire'));
      return;
    }
  }
}

// ─── ACID ───────────────────────────────────────────────────────
function updateAcid(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = ACID_COLORS[(fastRand() * ACID_COLORS.length) | 0];

  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); return; }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && !['stone','metal','concrete','void','acid'].includes(nb.type)) {
      if (fastRand() < 0.01) {
        set(grid, nrs[i], ncs[i], fastRand() < 0.1 ? createEl('smoke') : null);
        if (fastRand() < 0.3) set(grid, r, c, null);
      }
    }
  }
}

// ─── ICE ────────────────────────────────────────────────────────
function updateIce(grid: Grid, r: number, c: number) {
  if (fastRand() > 0.05) return;
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava')) {
      if (fastRand() < 0.2) { set(grid, r, c, createEl('water')); return; }
    }
    if (isType(grid, nrs[i], ncs[i], 'water') && fastRand() < 0.002) {
      set(grid, nrs[i], ncs[i], createEl('ice'));
    }
  }
}

// ─── MUD ────────────────────────────────────────────────────────
function updateMud(grid: Grid, r: number, c: number) {
  if (isEmpty(grid, r + 1, c)) {
    if (fastRand() < 0.3) { swap(grid, r, c, r + 1, c); return; } // slow fall
  }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir) && fastRand() < 0.15) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir) && fastRand() < 0.15) { swap(grid, r, c, r + 1, c - dir); return; }
  // Mud dries into sand if exposed to fire
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.005) {
      set(grid, r, c, createEl('sand'));
      return;
    }
  }
}

// ─── STEAM ──────────────────────────────────────────────────────
function updateSteam(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 50) - 1;
  if (el.life <= 0) {
    // Steam condenses back to water sometimes
    set(grid, r, c, fastRand() < 0.15 ? createEl('water') : null);
    return;
  }
  el.color = STEAM_COLORS[(fastRand() * STEAM_COLORS.length) | 0];
  // Steam rises like smoke
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r - 1, c))       { swap(grid, r, c, r - 1, c); return; }
  if (isEmpty(grid, r - 1, c + dir)) { swap(grid, r, c, r - 1, c + dir); return; }
  if (isEmpty(grid, r - 1, c - dir)) { swap(grid, r, c, r - 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); }
  // condense into cloud at top
  if (r <= 3 && fastRand() < 0.02) set(grid, r, c, createEl('cloud'));
}

// ─── GUNPOWDER ──────────────────────────────────────────────────
function updateGunpowder(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = GUNPOWDER_COLORS[(fastRand() * GUNPOWDER_COLORS.length) | 0];
  // Falls like sand
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  if (isType(grid, r+1, c, 'water','saltwater')) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  // Explodes near fire/lava
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava','lightning') && fastRand() < 0.1) {
      set(grid, r, c, createEl('explosion'));
      return;
    }
  }
}

// ─── SNOW ───────────────────────────────────────────────────────
function updateSnow(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = SNOW_COLORS[(fastRand() * SNOW_COLORS.length) | 0];

  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  if (isType(grid, r+1, c, 'water','saltwater')) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.08) {
      set(grid, r, c, createEl('water'));
      return;
    }
    if (isType(grid, nrs[i], ncs[i], 'water') && fastRand() < 0.01) {
      set(grid, nrs[i], ncs[i], createEl('ice'));
    }
  }
  // Snow piles can freeze water below
  if (isType(grid, r+1, c, 'water') && fastRand() < 0.003) {
    set(grid, r+1, c, createEl('ice'));
  }
}

// ─── CLOUD ──────────────────────────────────────────────────────
function updateCloud(grid: Grid, r: number, c: number, el: Element) {
  el.color = CLOUD_COLORS[(fastRand() * CLOUD_COLORS.length) | 0];

  // Drift horizontally slowly
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r, c + dir) && fastRand() < 0.1) { swap(grid, r, c, r, c + dir); return; }

  // Rain! drop water below
  if (isEmpty(grid, r + 1, c) && fastRand() < 0.02) {
    set(grid, r + 1, c, createEl('water'));
  }
  // Absorb steam from below
  if (isType(grid, r+1, c, 'steam') && fastRand() < 0.05) {
    set(grid, r+1, c, null);
    el.life = (el.life ?? 999);
  }
}

// ─── LIGHTNING ──────────────────────────────────────────────────
function updateLightning(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 3) - 1;
  if (el.life <= 0) { set(grid, r, c, null); return; }
  el.color = LIGHTNING_COLORS[(fastRand() * LIGHTNING_COLORS.length) | 0];

  // Strike downward fast
  const strikeDir = fastRand() > 0.3 ? 1 : (fastRand() > 0.5 ? 0 : -1);
  const nextR = r + 1;
  const nextC = c + strikeDir;
  const nb = get(grid, nextR, nextC);

  if (!nb) {
    set(grid, nextR, nextC, createEl('lightning'));
  } else {
    if (['water','saltwater'].includes(nb.type)) {
      // Electrocute water spread
      for (let dc = -3; dc <= 3; dc++) {
        if (isType(grid, nextR, nextC + dc, 'water','saltwater') && fastRand() < 0.5) {
          set(grid, nextR, nextC + dc, createEl('lightning'));
        }
      }
    }
    if (isFlammable(nb.type)) set(grid, nextR, nextC, createEl('fire'));
    if (nb.type === 'gunpowder') set(grid, nextR, nextC, createEl('explosion'));
    if (nb.type === 'metal') {
      // Conduct through metal
      set(grid, nextR, nextC, createEl('lightning'));
    }
  }
}

// ─── METAL ──────────────────────────────────────────────────────
function updateMetal(grid: Grid, r: number, c: number) {
  if (fastRand() > 0.01) return;
  // Metal rusts when near water
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'water','saltwater') && fastRand() < 0.001) {
      set(grid, r, c, createEl('rust'));
      return;
    }
    // Metal conducts lightning
    if (isType(grid, nrs[i], ncs[i], 'lightning') && fastRand() < 0.5) {
      set(grid, nrs[i], ncs[i], createEl('lightning'));
    }
  }
}

// ─── SALT ───────────────────────────────────────────────────────
function updateSalt(grid: Grid, r: number, c: number) {
  // Falls like sand
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  // Dissolves in water
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'water') && fastRand() < 0.02) {
      set(grid, r, c, null);
      set(grid, nrs[i], ncs[i], createEl('saltwater'));
      return;
    }
  }
}

// ─── SALTWATER ──────────────────────────────────────────────────
function updateSaltwater(grid: Grid, r: number, c: number) {
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); return; }
  // Saltwater slower to freeze
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.03) {
      set(grid, r, c, createEl('steam'));
    }
    // dissolves sand/mud nearby
    if (isType(grid, nrs[i], ncs[i], 'sand','mud') && fastRand() < 0.0005) {
      set(grid, nrs[i], ncs[i], null);
    }
  }
}

// ─── VIRUS ──────────────────────────────────────────────────────
function updateVirus(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 80) - 1;
  if (el.life <= 0) { set(grid, r, c, null); return; }
  el.color = VIRUS_COLORS[(fastRand() * VIRUS_COLORS.length) | 0];

  // Move randomly
  if (isEmpty(grid, r + 1, c) && fastRand() < 0.2) { swap(grid, r, c, r + 1, c); return; }

  // Infect neighbors
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && !['stone','metal','concrete','glass','void','fire','lava','acid','virus'].includes(nb.type) && fastRand() < 0.005) {
      set(grid, nrs[i], ncs[i], createEl('virus'));
    }
    // Virus dies to fire/acid/lava
    if (isType(grid, nrs[i], ncs[i], 'fire','acid','lava') && fastRand() < 0.1) {
      set(grid, r, c, null);
      return;
    }
  }
}

// ─── CRYSTAL ────────────────────────────────────────────────────
function updateCrystal(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = CRYSTAL_COLORS[(fastRand() * CRYSTAL_COLORS.length) | 0];
  if (fastRand() > 0.02) return;
  // Grow when near water
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'water','saltwater') && fastRand() < 0.01) {
      set(grid, nrs[i], ncs[i], createEl('crystal'));
    }
    // Shatters with explosion/lightning
    if (isType(grid, nrs[i], ncs[i], 'explosion','lightning') && fastRand() < 0.3) {
      set(grid, r, c, null);
      return;
    }
  }
}

// ─── HONEY ──────────────────────────────────────────────────────
function updateHoney(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = HONEY_COLORS[(fastRand() * HONEY_COLORS.length) | 0];

  // Very slow liquid
  if (isEmpty(grid, r + 1, c) && fastRand() < 0.1) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir) && fastRand() < 0.05) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir) && fastRand() < 0.05) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir) && fastRand() < 0.02)     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir) && fastRand() < 0.02)     { swap(grid, r, c, r, c - dir); return; }

  // Burns slowly
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.005) {
      set(grid, r, c, createEl('fire'));
      return;
    }
  }
}

// ─── BUBBLE ─────────────────────────────────────────────────────
function updateBubble(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 30) - 1;
  if (el.life <= 0) { set(grid, r, c, null); return; }
  el.color = BUBBLE_COLORS[(fastRand() * BUBBLE_COLORS.length) | 0];

  // Rises through water/air
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r - 1, c) || isType(grid, r-1, c, 'water','saltwater')) {
    swap(grid, r, c, r - 1, c); return;
  }
  if ((isEmpty(grid, r-1, c+dir) || isType(grid, r-1, c+dir, 'water','saltwater')) && fastRand() < 0.5) {
    swap(grid, r, c, r-1, c+dir); return;
  }
  // Pop near fire/sharp things
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava','acid','lightning') && fastRand() < 0.3) {
      set(grid, r, c, null);
      return;
    }
  }
}

// ─── VOID ───────────────────────────────────────────────────────
function updateVoid(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = VOID_COLORS[(fastRand() * VOID_COLORS.length) | 0];
  // Absorb everything around it
  const nrs = [r-1, r+1, r,   r,   r-1, r-1, r+1, r+1];
  const ncs = [c,   c,   c-1, c+1, c-1, c+1, c-1, c+1];
  for (let i = 0; i < nrs.length; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && isDestroyable(nb.type) && fastRand() < 0.1) {
      set(grid, nrs[i], ncs[i], null);
    }
  }
}

// ─── CLONE ──────────────────────────────────────────────────────
function updateClone(grid: Grid, r: number, c: number) {
  // Detects adjacent non-empty, non-clone cell and copies it to other sides
  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  let sourceType: ElementType | null = null;

  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && !['clone','void','stone','metal','concrete','empty'].includes(nb.type)) {
      sourceType = nb.type;
      break;
    }
  }

  if (!sourceType) return;
  // Place a clone of source type in random empty neighbor
  for (let i = 0; i < 4; i++) {
    if (isEmpty(grid, nrs[i], ncs[i]) && fastRand() < 0.05) {
      set(grid, nrs[i], ncs[i], createEl(sourceType));
    }
  }
}

// ─── GASOLINE ───────────────────────────────────────────────────
function updateGasoline(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = GASOLINE_COLORS[(fastRand() * GASOLINE_COLORS.length) | 0];

  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  if (isType(grid, r+1,c, 'water','saltwater')) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir))     { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir))     { swap(grid, r, c, r, c - dir); return; }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava','lightning') && fastRand() < 0.1) {
      set(grid, r, c, createEl('fire'));
      // Big explosion!
      const exp = createEl('explosion');
      exp.life = 8;
      set(grid, r-1, c, exp);
      return;
    }
  }
}

// ─── LEAF ───────────────────────────────────────────────────────
function updateLeaf(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life ?? 60) - 1;
  if (el.life <= 0) { set(grid, r, c, null); return; }

  // Drifts down with slight horizontal movement
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c) && fastRand() < 0.4) { swap(grid, r, c, r + 1, c); return; }
  if (isEmpty(grid, r + 1, c + dir) && fastRand() < 0.3) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r, c + dir) && fastRand() < 0.1) { swap(grid, r, c, r, c + dir); return; }

  const nrs = [r-1, r+1, r,   r  ];
  const ncs = [c,   c,   c-1, c+1];
  for (let i = 0; i < 4; i++) {
    if (isType(grid, nrs[i], ncs[i], 'fire','lava') && fastRand() < 0.05) {
      set(grid, r, c, createEl('fire'));
      return;
    }
    if (isType(grid, nrs[i], ncs[i], 'water') && fastRand() < 0.003) {
      set(grid, r, c, createEl('plant'));
      set(grid, nrs[i], ncs[i], null);
      return;
    }
  }
}

// ─── RUST ─────────────────────────────────────────────────────── 
// Rust is mostly static — just spreads to adjacent metal slowly

// ══════════════════════════════════════════════════
//  SHOP ELEMENTS PHYSICS
// ══════════════════════════════════════════════════

// ─── ANTIMATTER ─────────────────────────────────────────────────
function updateAntimatter(grid: Grid, r: number, c: number, el: Element) {
  el.color = ANTIMATTER_COLORS[(fastRand() * ANTIMATTER_COLORS.length) | 0];
  el.life = (el.life ?? 60) - 1;
  if (el.life <= 0) { set(grid, r, c, null); return; }

  // Antimatter: destroys everything in big radius
  const radius = 4;
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (dr * dr + dc * dc <= radius * radius && fastRand() < 0.15) {
        const nb = get(grid, r + dr, c + dc);
        if (nb && nb.type !== 'antimatter' && isDestroyable(nb.type)) {
          set(grid, r + dr, c + dc, fastRand() < 0.3 ? createEl('smoke') : null);
        }
      }
    }
  }
  // Drifts slightly
  if (isEmpty(grid, r + 1, c) && fastRand() < 0.3) swap(grid, r, c, r + 1, c);
}

// ─── PLASMA ─────────────────────────────────────────────────────
function updatePlasma(grid: Grid, r: number, c: number, el: Element) {
  el.color = PLASMA_COLORS[(fastRand() * PLASMA_COLORS.length) | 0];
  el.life = (el.life ?? 80) - 1;
  if (el.life <= 0) { set(grid, r, c, fastRand() < 0.3 ? createEl('steam') : null); return; }

  // Plasma: super hot, rises & burns everything
  if (isEmpty(grid, r - 1, c) && fastRand() < 0.4) { swap(grid, r, c, r - 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r - 1, c + dir) && fastRand() < 0.3) { swap(grid, r, c, r - 1, c + dir); return; }
  if (isEmpty(grid, r, c + dir) && fastRand() < 0.2) { swap(grid, r, c, r, c + dir); return; }

  const nrs = [r-1, r+1, r, r];
  const ncs = [c, c, c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (!nb) continue;
    if (isFlammable(nb.type) && fastRand() < 0.08) set(grid, nrs[i], ncs[i], createEl('fire'));
    if (['water','ice','snow'].includes(nb.type) && fastRand() < 0.05) set(grid, nrs[i], ncs[i], createEl('steam'));
    if (nb.type === 'sand' && fastRand() < 0.02) set(grid, nrs[i], ncs[i], createEl('glass'));
  }
}

// ─── MAGMA ──────────────────────────────────────────────────────
function updateMagma(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = MAGMA_COLORS[(fastRand() * MAGMA_COLORS.length) | 0];

  // Heavier than lava, slower but more destructive
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  if (isType(grid, r+1, c, 'water','saltwater','oil','gasoline')) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir) && fastRand() < 0.3) { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir) && fastRand() < 0.3) { swap(grid, r, c, r, c - dir); return; }

  const nrs = [r-1, r+1, r, r];
  const ncs = [c, c, c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (!nb) continue;
    if (isFlammable(nb.type) && fastRand() < 0.03) set(grid, nrs[i], ncs[i], createEl('fire'));
    if (['water','saltwater'].includes(nb.type) && fastRand() < 0.04) {
      set(grid, nrs[i], ncs[i], createEl('steam'));
      if (fastRand() < 0.2) set(grid, r, c, createEl('stone'));
    }
    if (!['stone','metal','concrete','magma','void'].includes(nb.type) && fastRand() < 0.005) {
      set(grid, nrs[i], ncs[i], createEl('fire'));
    }
  }
}

// ─── BLACK HOLE ─────────────────────────────────────────────────
function updateBlackhole(grid: Grid, r: number, c: number, el: Element) {
  el.color = BLACKHOLE_COLORS[(fastRand() * BLACKHOLE_COLORS.length) | 0];

  // Pulls particles from far away
  const radius = 8;
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr === 0 && dc === 0) continue;
      const dist = Math.sqrt(dr * dr + dc * dc);
      if (dist > radius) continue;
      const nr = r + dr;
      const nc = c + dc;
      const nb = get(grid, nr, nc);
      if (!nb || nb.type === 'blackhole') continue;
      if (isDestroyable(nb.type) && fastRand() < 0.05 / dist) {
        // Move toward black hole
        const moveR = nr + (dr < 0 ? 1 : dr > 0 ? -1 : 0);
        const moveC = nc + (dc < 0 ? 1 : dc > 0 ? -1 : 0);
        if (isEmpty(grid, moveR, moveC)) {
          swap(grid, nr, nc, moveR, moveC);
        } else if (fastRand() < 0.1) {
          set(grid, nr, nc, null); // absorbed
        }
      }
    }
  }
  // Direct neighbors: instantly absorb
  const nrs = [r-1, r+1, r, r, r-1, r-1, r+1, r+1];
  const ncs = [c, c, c-1, c+1, c-1, c+1, c-1, c+1];
  for (let i = 0; i < nrs.length; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && nb.type !== 'blackhole' && isDestroyable(nb.type) && fastRand() < 0.3) {
      set(grid, nrs[i], ncs[i], null);
    }
  }
}

// ─── RAINBOW ────────────────────────────────────────────────────
function updateRainbow(grid: Grid, r: number, c: number, el: Element) {
  el.color = RAINBOW_COLORS[(fastRand() * RAINBOW_COLORS.length) | 0];

  // Falls like water but changes color every frame
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }
  if (isEmpty(grid, r, c + dir)) { swap(grid, r, c, r, c + dir); return; }
  if (isEmpty(grid, r, c - dir)) { swap(grid, r, c, r, c - dir); return; }

  // Infect neighbors with rainbow color (aesthetic only)
  const nrs = [r-1, r+1, r, r];
  const ncs = [c, c, c-1, c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && fastRand() < 0.02) {
      nb.color = RAINBOW_COLORS[(fastRand() * RAINBOW_COLORS.length) | 0];
    }
  }
}

// ─── DRAGON FIRE ────────────────────────────────────────────────
function updateDragonfire(grid: Grid, r: number, c: number, el: Element) {
  el.color = DRAGONFIRE_COLORS[(fastRand() * DRAGONFIRE_COLORS.length) | 0];
  el.life = (el.life ?? 120) - 1;
  if (el.life <= 0) { set(grid, r, c, fastRand() < 0.4 ? createEl('smoke') : null); return; }

  // Rises and spreads wider than normal fire
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r - 1, c) && fastRand() < 0.6) { swap(grid, r, c, r - 1, c); return; }
  if (isEmpty(grid, r - 1, c + dir) && fastRand() < 0.4) { swap(grid, r, c, r - 1, c + dir); return; }
  if (isEmpty(grid, r, c + dir) && fastRand() < 0.2) { swap(grid, r, c, r, c + dir); return; }

  // Burns EVERYTHING in wider radius
  const radius = 3;
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr * dr + dc * dc <= radius * radius && fastRand() < 0.04) {
        const nb = get(grid, r + dr, c + dc);
        if (nb && isFlammable(nb.type)) set(grid, r + dr, c + dc, createEl('dragonfire'));
        if (nb && ['water','ice','snow'].includes(nb.type) && fastRand() < 0.3) set(grid, r + dr, c + dc, createEl('steam'));
      }
    }
  }
}

// ─── TIME SAND ──────────────────────────────────────────────────
function updateTimesand(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = TIMESAND_COLORS[(fastRand() * TIMESAND_COLORS.length) | 0];

  // Falls like sand
  if (isEmpty(grid, r + 1, c)) { swap(grid, r, c, r + 1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r + 1, c + dir)) { swap(grid, r, c, r + 1, c + dir); return; }
  if (isEmpty(grid, r + 1, c - dir)) { swap(grid, r, c, r + 1, c - dir); return; }

  // Freezes all particles nearby (sets updated=true so they skip their turn)
  const radius = 3;
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (dr * dr + dc * dc <= radius * radius) {
        const nb = get(grid, r + dr, c + dc);
        if (nb && nb.type !== 'timesand' && fastRand() < 0.3) {
          nb.updated = true; // skip update this frame = "frozen"
        }
      }
    }
  }
}

// ══════════════════════════════════════════════════
//  NEW SHOP ELEMENTS PHYSICS
// ══════════════════════════════════════════════════

function updateQuicksand(grid: Grid, r: number, c: number) {
  if (isEmpty(grid, r+1, c)) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r+1, c+dir)) { swap(grid, r, c, r+1, c+dir); return; }
  // Suck down neighbors
  const nrs = [r-1,r,r]; const ncs = [c,c-1,c+1];
  for (let i = 0; i < 3; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (nb && !['quicksand','stone','concrete','obsidian'].includes(nb.type) && fastRand() < 0.1) {
      swap(grid, nrs[i], ncs[i], r+1, c);
    }
  }
}

function updateSuperlava(grid: Grid, r: number, c: number) {
  const el = grid[idx(r,c)];
  if (!el) return;
  if (isEmpty(grid, r+1, c)) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r+1, c+dir)) { swap(grid, r, c, r+1, c+dir); return; }
  if (isEmpty(grid, r, c+dir)) { swap(grid, r, c, r, c+dir); return; }
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    const nb = get(grid, nrs[i], ncs[i]);
    if (!nb) continue;
    if (!['superlava','stone','concrete','obsidian','metal'].includes(nb.type) && fastRand() < 0.05)
      set(grid, nrs[i], ncs[i], createEl('fire'));
    if (['water','saltwater','ice','snow'].includes(nb.type) && fastRand() < 0.1)
      set(grid, nrs[i], ncs[i], createEl('steam'));
  }
}

function updateHolywater(grid: Grid, r: number, c: number) {
  if (isEmpty(grid, r+1, c)) { swap(grid, r, c, r+1, c); return; }
  const dir = fastRand() > 0.5 ? 1 : -1;
  if (isEmpty(grid, r+1, c+dir)) { swap(grid, r, c, r+1, c+dir); return; }
  if (isEmpty(grid, r, c+dir)) { swap(grid, r, c, r, c+dir); return; }
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i = 0; i < 4; i++) {
    const t = get(grid, nrs[i], ncs[i])?.type;
    if (!t) continue;
    if (['fire','lava','superlava'].includes(t) && fastRand()<0.2) { set(grid, nrs[i], ncs[i], null); }
    if (t==='virus' && fastRand()<0.3) { set(grid, nrs[i], ncs[i], createEl('water')); }
    if (t==='acid' && fastRand()<0.15) { set(grid, nrs[i], ncs[i], null); }
  }
}

function updateBluefire(grid: Grid, r: number, c: number, el: Element) {
  el.life = (el.life??30) - 1;
  if (el.life <= 0) { set(grid, r, c, fastRand()<0.2?createEl('smoke'):null); return; }
  if (isEmpty(grid, r-1, c) && fastRand()<0.5) { swap(grid, r, c, r-1, c); return; }
  const dir = fastRand()>0.5?1:-1;
  if (isEmpty(grid, r-1, c+dir)&&fastRand()<0.4) { swap(grid,r,c,r-1,c+dir); return; }
  if (isEmpty(grid, r, c+dir)&&fastRand()<0.3) { swap(grid,r,c,r,c+dir); return; }
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (!nb) continue;
    if (isFlammable(nb.type)&&fastRand()<0.04) set(grid,nrs[i],ncs[i],createEl('bluefire'));
    if (['water','ice'].includes(nb.type)&&fastRand()<0.08) { set(grid,nrs[i],ncs[i],createEl('steam')); el.life=0; }
  }
}

function updateC4(grid: Grid, r: number, c: number, el: Element) {
  // C4 explodes near fire only
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','superlava','lightning','explosion')&&fastRand()<0.3) {
      el.life = 0;
    }
  }
  if (el.life !== 0) return;
  // MEGA explosion
  const radius = 15;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.7) {
        const nb=get(grid,r+dr,c+dc);
        if (nb&&!['stone','metal','concrete','obsidian'].includes(nb.type)) {
          set(grid,r+dr,c+dc,fastRand()<0.4?createEl('fire'):null);
        }
      }
    }
  }
  set(grid, r, c, null);
}

function updateNuclearwaste(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??200)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)){swap(grid,r,c,r,c+dir);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&!['nuclearwaste','stone','concrete','obsidian'].includes(nb.type)&&fastRand()<0.01)
      set(grid,nrs[i],ncs[i],createEl('nuclearwaste'));
  }
}

function updateWind(grid: Grid, r: number, c: number) {
  const el=grid[idx(r,c)];if(!el)return;
  // Wind pushes light particles right
  const lightTypes=['smoke','steam','bubble','leaf','snow','cloud','fog'];
  const nrs=[r-1,r,r+1]; const ncs=[c-1,c-1,c-1];
  for (let i=0;i<3;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&lightTypes.includes(nb.type)&&isEmpty(grid,nrs[i],ncs[i]+2)) {
      swap(grid,nrs[i],ncs[i],nrs[i],ncs[i]+2);
    }
  }
  // Wind itself drifts right & fades
  if (isEmpty(grid,r,c+1)&&fastRand()<0.3) swap(grid,r,c,r,c+1);
  if (fastRand()<0.02) set(grid,r,c,null);
}

function updateSeed(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'water','saltwater','mud')&&fastRand()<0.05) {
      set(grid,r,c,createEl('plant'));return;
    }
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.2) {
      set(grid,r,c,null);return;
    }
  }
}

function updateFog(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??100)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.1) swap(grid,r,c,r,c+dir);
  if (isEmpty(grid,r-1,c)&&fastRand()<0.05) swap(grid,r,c,r-1,c);
  if (isEmpty(grid,r+1,c)&&fastRand()<0.05) swap(grid,r,c,r+1,c);
}

function updatePotion(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)){swap(grid,r,c,r,c+dir);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  const transforms:ElementType[]=['fire','water','plant','ice','sand','smoke','lightning'];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&!['potion','stone','concrete'].includes(nb.type)&&fastRand()<0.005) {
      set(grid,nrs[i],ncs[i],createEl(transforms[(fastRand()*transforms.length)|0]));
    }
  }
}

function updateTar(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.05){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.02){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.01){swap(grid,r,c,r,c+dir);}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.01) set(grid,r,c,createEl('fire'));
  }
}

function updateTidalwave(grid: Grid, r: number, c: number) {
  const el=grid[idx(r,c)];if(!el)return;
  el.life=(el.life??50)-1;
  if (el.life<=0){set(grid,r,c,createEl('water'));return;}
  // Rush to the right
  if (isEmpty(grid,r,c+1)) { swap(grid,r,c,r,c+1); return; }
  if (isEmpty(grid,r-1,c+1)) { swap(grid,r,c,r-1,c+1); return; }
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const nrs=[r-1,r+1,r]; const ncs=[c,c,c+1];
  for (let i=0;i<3;i++){
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&!['stone','concrete','obsidian','metal'].includes(nb.type)&&fastRand()<0.3)
      set(grid,nrs[i],ncs[i],createEl('water'));
  }
}

function updateStardust(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??80)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'sand')&&fastRand()<0.05)
      set(grid,nrs[i],ncs[i],createEl('crystal'));
    if (isType(grid,nrs[i],ncs[i],'water')&&fastRand()<0.03)
      set(grid,nrs[i],ncs[i],createEl('ice'));
  }
}

function updateCryo(grid: Grid, r: number, c: number) {
  const el=grid[idx(r,c)];if(!el)return;
  el.life=(el.life??60)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  const radius=6;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.1) {
        const nb=get(grid,r+dr,c+dc);
        if (!nb) continue;
        if (nb.type==='water'&&fastRand()<0.2) set(grid,r+dr,c+dc,createEl('ice'));
        if (nb.type==='lava'&&fastRand()<0.1) set(grid,r+dr,c+dc,createEl('stone'));
        if (nb.type==='fire'&&fastRand()<0.3) set(grid,r+dr,c+dc,null);
      }
    }
  }
  if (isEmpty(grid,r+1,c)) swap(grid,r,c,r+1,c);
}

function updateTrident(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??10)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Explode + water + lightning
  const radius=5;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.3) {
        if (isEmpty(grid,r+dr,c+dc)) {
          const t:ElementType=fastRand()<0.5?'water':fastRand()<0.5?'lightning':'ice';
          set(grid,r+dr,c+dc,createEl(t));
        }
      }
    }
  }
}

function updateNebula(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??100)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  if (fastRand()<0.1) {
    const COLS=_getCOLS();const ROWS=_getROWS();
    const tr=((fastRand()*ROWS)|0); const tc=((fastRand()*COLS)|0);
    const nb=get(grid,r,c);
    if (nb&&isEmpty(grid,tr,tc)) {
      set(grid,tr,tc,createEl(nb.type));
      set(grid,r,c,null);
    }
  }
  if (isEmpty(grid,r+1,c)) swap(grid,r,c,r+1,c);
}

function updateMindblow(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??20)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  const types:ElementType[]=['fire','water','sand','plant','ice','lightning','smoke','explosion'];
  const radius=4;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.2) {
        const nb=get(grid,r+dr,c+dc);
        if (nb&&!['stone','metal','concrete'].includes(nb.type))
          set(grid,r+dr,c+dc,fastRand()<0.5?createEl(types[(fastRand()*types.length)|0]):null);
      }
    }
  }
}

function updateParty(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??999)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)){swap(grid,r,c,r,c+dir);return;}
  // Spawn colorful particles around
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isEmpty(grid,nrs[i],ncs[i])&&fastRand()<0.05) {
      const p=createEl('rainbow');
      set(grid,nrs[i],ncs[i],p);
    }
  }
}

// ══════════════════════════════════════════════════
//  NEW SHOP CREATURES PHYSICS
// ══════════════════════════════════════════════════

function creatureDie(grid: Grid, r: number, c: number, ...killers: ElementType[]): boolean {
  const all=[r-1,r+1,r,r]; const allC=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,all[i],allC[i],...killers)){set(grid,r,c,null);return true;}
  }
  return false;
}

function updateWolf(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (isEmpty(grid,r+1,c)) { swap(grid,r,c,r+1,c); return; }
  // Run fast
  if (fastRand()<0.8) {
    if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else if (isEmpty(grid,r-1,c+dir)) swap(grid,r,c,r-1,c+dir); // jump
    else el.meta=el.meta===1?0:1;
  }
}

function updateLion(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  if (fastRand()<0.4) {
    if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
}

function updateOctopus(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid','lightning')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  // Swim in all 8 directions in water
  const choices=[[r-1,c],[r+1,c],[r,c-1],[r,c+1],[r-1,c-1],[r-1,c+1],[r+1,c-1],[r+1,c+1]];
  if (fastRand()<0.5) {
    const [nr,nc]=choices[(fastRand()*choices.length)|0];
    if (isType(grid,nr,nc,'water','saltwater')||isEmpty(grid,nr,nc)) swap(grid,r,c,nr,nc);
    else if (fastRand()<0.1) el.meta=el.meta===1?0:1;
  }
  void dir;
}

function updateEagle(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid','lightning')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (fastRand()<0.7) {
    if (isEmpty(grid,r-1,c+dir)) swap(grid,r,c,r-1,c+dir);
    else if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else if (isEmpty(grid,r-1,c)) swap(grid,r,c,r-1,c);
    else el.meta=el.meta===1?0:1;
  }
  if (r<=1) el.meta=el.meta===1?0:1;
}

function updateTurtle(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  // Very slow
  if (fastRand()<0.15) {
    if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
}

function updateRabbit(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=0;
  el.meta=(el.meta+1)%8;
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  if (el.meta===0) {
    const jd=fastRand()>0.5?1:-1;
    if (isEmpty(grid,r-2,c+jd)&&isEmpty(grid,r-1,c)) swap(grid,r,c,r-2,c+jd);
    else if (isEmpty(grid,r,c+jd)) swap(grid,r,c,r,c+jd);
  }
}

function updateBear(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  if (fastRand()<0.25) {
    if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else if (isEmpty(grid,r-1,c+dir)) swap(grid,r,c,r-1,c+dir);
    else el.meta=el.meta===1?0:1;
  }
}

function updateJellyfish(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid','lightning')) return;
  if (el.meta===undefined) el.meta=0;
  el.meta=(el.meta+1)%20;
  const goUp=el.meta<10;
  if (goUp) {
    if (isType(grid,r-1,c,'water','saltwater')||isEmpty(grid,r-1,c)) swap(grid,r,c,r-1,c);
  } else {
    if (isType(grid,r+1,c,'water','saltwater')||isEmpty(grid,r+1,c)) swap(grid,r,c,r+1,c);
  }
}

function updateKingcrab(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  if (fastRand()<0.6) {
    if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
}

function updateQueenbee(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid','lightning')) return;
  if (el.meta===undefined) el.meta=0;
  el.meta=(el.meta+1)%60;
  const dir=fastRand()>0.5?1:-1;
  const choices=[[r-1,c+dir],[r,c+dir],[r-1,c],[r+1,c+dir]];
  const [nr,nc]=choices[(fastRand()*choices.length)|0];
  if (isEmpty(grid,nr,nc)) swap(grid,r,c,nr,nc);
  // Spawn honey periodically
  if (el.meta===0&&isEmpty(grid,r+1,c)) set(grid,r+1,c,createEl('honey'));
}

function updateElderdragon(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'acid','void','blackhole')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (fastRand()<0.6) {
    if (isEmpty(grid,r-1,c+dir)) swap(grid,r,c,r-1,c+dir);
    else if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
  // Breathe dragon fire
  if (fastRand()<0.05) {
    const fdir=el.meta===1?1:-1;
    for (let i=1;i<=3;i++) {
      if (isEmpty(grid,r,c+fdir*i)) set(grid,r,c+fdir*i,createEl('dragonfire'));
    }
  }
}

function updateAngel(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'acid','void','lava')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (fastRand()<0.5) {
    if (isEmpty(grid,r-1,c+dir)) swap(grid,r,c,r-1,c+dir);
    else if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
  // Drops holy water
  if (fastRand()<0.03&&isEmpty(grid,r+1,c)) set(grid,r+1,c,createEl('holywater'));
}

function updateKraken(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'fire','lava','acid')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  const choices=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
  if (fastRand()<0.6) {
    const [nr,nc]=choices[(fastRand()*choices.length)|0];
    if (isType(grid,nr,nc,'water','saltwater')||isEmpty(grid,nr,nc)) swap(grid,r,c,nr,nc);
    else el.meta=el.meta===1?0:1;
  }
  // Shoot acid
  if (fastRand()<0.02) {
    const sd=el.meta===1?1:-1;
    if (isEmpty(grid,r,c+sd)) set(grid,r,c+sd,createEl('acid'));
  }
  void dir;
}

function updateTitan(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'acid','void')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  // Fall heavy
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const below=get(grid,r+1,c);
  if (below&&!['stone','metal','concrete','obsidian'].includes(below.type)&&fastRand()<0.1) {
    set(grid,r+1,c,null); swap(grid,r,c,r+1,c); return;
  }
  if (fastRand()<0.2) {
    if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
}

function updateSandgod(grid: Grid, r: number, c: number, el: Element) {
  if (creatureDie(grid,r,c,'void','blackhole')) return;
  if (el.meta===undefined) el.meta=fastRand()>0.5?1:0;
  const dir=el.meta===1?1:-1;
  if (fastRand()<0.5) {
    if (isEmpty(grid,r-1,c+dir)) swap(grid,r,c,r-1,c+dir);
    else if (isEmpty(grid,r,c+dir)) swap(grid,r,c,r,c+dir);
    else el.meta=el.meta===1?0:1;
  }
  // Transform sand around to crystal/gold
  const nrs=[r-1,r+1,r,r,r-2,r+2]; const ncs=[c,c,c-1,c+1,c,c];
  for (let i=0;i<nrs.length;i++) {
    if (isType(grid,nrs[i],ncs[i],'sand')&&fastRand()<0.02)
      set(grid,nrs[i],ncs[i],createEl('crystal'));
  }
}

// ══════════════════════════════════════════════════
//  MISSING SHOP ELEMENTS PHYSICS
// ══════════════════════════════════════════════════

function updateNuke(grid: Grid, r: number, c: number, el: Element) {
  // Nuke explodes near fire/lightning — massive radius
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','lightning','explosion')&&fastRand()<0.2) {
      el.life=0;
    }
  }
  if ((el.life??1)>0) return;
  const radius=20;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.8) {
        const nb=get(grid,r+dr,c+dc);
        if (nb&&!['stone','metal','concrete'].includes(nb.type))
          set(grid,r+dr,c+dc,fastRand()<0.4?createEl('fire'):null);
      }
    }
  }
  set(grid,r,c,null);
}

function updateSlime(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.3){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.15){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.05){swap(grid,r,c,r,c+dir);return;}
  // Trap nearby particles
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&!['slime','stone','concrete'].includes(nb.type)&&fastRand()<0.02)
      nb.updated=true; // trap = skip update
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05) set(grid,r,c,null);
  }
}

function updateSoapbubble(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??40)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r-1,c)){swap(grid,r,c,r-1,c);return;}
  if (isEmpty(grid,r-1,c+dir)&&fastRand()<0.5){swap(grid,r,c,r-1,c+dir);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','acid','lightning')&&fastRand()<0.5)
      {set(grid,r,c,null);return;}
  }
}

function updateCheese(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.1){swap(grid,r,c,r+1,c);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05)
      set(grid,nrs[i],ncs[i],createEl('water')); // melts
    if (isType(grid,nrs[i],ncs[i],'acid')&&fastRand()<0.05)
      {set(grid,r,c,null);return;}
  }
}

function updatePrism(grid: Grid, r: number, c: number) {
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&fastRand()<0.01) nb.color=([0xff0000ff,0x00ff00ff,0x0000ffff,0xffff00ff,0xff00ffff][(Math.random()*5)|0])>>>0;
  }
}

function updatePortal(grid: Grid, r: number, c: number, el: Element) {
  el.color=(el.color+1)%0xffffffff;
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&nb.type!=='portal'&&fastRand()<0.05) {
      const COLS=_getCOLS();const ROWS=_getROWS();
      const tr=((fastRand()*ROWS)|0); const tc=((fastRand()*COLS)|0);
      if (isEmpty(grid,tr,tc)) { set(grid,tr,tc,createEl(nb.type)); set(grid,nrs[i],ncs[i],null); }
    }
  }
}

function updateWarp(grid: Grid, r: number, c: number) {
  const nrs=[r-1,r+1,r,r,r-1,r-1,r+1,r+1];
  const ncs=[c,c,c-1,c+1,c-1,c+1,c-1,c+1];
  for (let i=0;i<8;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&nb.type!=='warp'&&fastRand()<0.02) nb.updated=false; // speed up = update twice
  }
}

function updateDarkmatter(grid: Grid, r: number, c: number) {
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&!['darkmatter','stone','metal','concrete'].includes(nb.type)&&fastRand()<0.005)
      set(grid,nrs[i],ncs[i],null); // slowly absorbs
  }
}

function updateThunderstorm(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??200)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Move like cloud + shoot lightning randomly
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.1) swap(grid,r,c,r,c+dir);
  if (fastRand()<0.05) {
    // Strike random cell below
    const sc=c+((fastRand()*10-5)|0);
    const ROWS=_getROWS();
    for (let sr=r+1;sr<ROWS;sr++) {
      if (!isEmpty(grid,sr,sc)) { set(grid,sr,sc,createEl('lightning')); break; }
      if (sr===ROWS-1&&isEmpty(grid,sr,sc)) set(grid,sr,sc,createEl('lightning'));
    }
  }
}

function updateToxicmud(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.2){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.1){swap(grid,r,c,r+1,c+dir);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&['ant','fish','bird','frog','crab','bee','worm','mushroom'].includes(nb.type)&&fastRand()<0.05)
      set(grid,nrs[i],ncs[i],null); // kills creatures
    if (nb&&nb.type==='water'&&fastRand()<0.01)
      set(grid,nrs[i],ncs[i],createEl('toxicmud')); // spreads in water
  }
}

function updateDryice(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'water')&&fastRand()<0.1) set(grid,nrs[i],ncs[i],createEl('ice'));
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05)
      {set(grid,r,c,createEl('smoke'));return;}
  }
  // Emit CO2 smoke upward
  if (isEmpty(grid,r-1,c)&&fastRand()<0.1) set(grid,r-1,c,createEl('smoke'));
}

function updateGravitywell(grid: Grid, r: number, c: number) {
  const radius=6;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr===0&&dc===0) continue;
      const dist=Math.sqrt(dr*dr+dc*dc);
      if (dist>radius) continue;
      const nb=get(grid,r+dr,c+dc);
      if (!nb||nb.type==='gravitywell') continue;
      if (fastRand()<0.08/dist) {
        const mr=r+dr+(dr<0?1:dr>0?-1:0);
        const mc=c+dc+(dc<0?1:dc>0?-1:0);
        if (isEmpty(grid,mr,mc)) swap(grid,r+dr,c+dc,mr,mc);
        else if (fastRand()<0.1) set(grid,r+dr,c+dc,null);
      }
    }
  }
}

function updateColorbomb(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??5)-1;
  if (el.life<=0) {
    const radius=8;
    const colors=['fire','water','sand','plant','ice','smoke','rainbow'];
    for (let dr=-radius;dr<=radius;dr++) {
      for (let dc=-radius;dc<=radius;dc++) {
        if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.5) {
          if (isEmpty(grid,r+dr,c+dc))
            set(grid,r+dr,c+dc,createEl(colors[(fastRand()*colors.length)|0] as ElementType));
        }
      }
    }
    set(grid,r,c,null);
  }
}

// ══════════════════════════════════════════════════
//  NEW FREE ELEMENTS PHYSICS
// ══════════════════════════════════════════════════

function updateGravel(grid: Grid, r: number, c: number) {
  // Falls faster than sand
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  if (['water','oil','saltwater','gasoline','acid'].includes(get(grid,r+1,c)?.type??'')) {swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r+1,c-dir)){swap(grid,r,c,r+1,c-dir);return;}
  // Crush plants
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'plant','leaf','grass','wheat')&&fastRand()<0.01) set(grid,nrs[i],ncs[i],null);
  }
}

function updateCharcoal(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.5){swap(grid,r,c,r+1,c);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.02){set(grid,r,c,createEl('fire'));return;}
    if (isType(grid,nrs[i],ncs[i],'water')&&fastRand()<0.001){set(grid,r,c,null);return;}
  }
}

function updateChalk(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  // Dissolves in water
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'water','saltwater','acid')&&fastRand()<0.03){set(grid,r,c,null);return;}
  }
}

function updateMercury(grid: Grid, r: number, c: number) {
  // Flows super fast
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r+1,c-dir)){swap(grid,r,c,r+1,c-dir);return;}
  for (let i=0;i<3;i++) {
    if (isEmpty(grid,r,c+dir*i)){swap(grid,r,c,r,c+dir*i);return;}
  }
  // Toxic to living things
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const t=get(grid,nrs[i],ncs[i])?.type;
    if (t&&['ant','fish','bird','frog','crab','bee','worm','mushroom'].includes(t)&&fastRand()<0.05)
      set(grid,nrs[i],ncs[i],null);
  }
}

function updateGel(grid: Grid, r: number, c: number) {
  // Very slow liquid
  if (isEmpty(grid,r+1,c)&&fastRand()<0.08){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.04){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.02){swap(grid,r,c,r,c+dir);return;}
}

function updateGlue2(grid: Grid, r: number, c: number) {
  // Slowly flows and sticks
  if (isEmpty(grid,r+1,c)&&fastRand()<0.05){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.02){swap(grid,r,c,r+1,c+dir);return;}
  // Freezes neighbors
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const nb=get(grid,nrs[i],ncs[i]);
    if (nb&&!['glue2','stone','concrete'].includes(nb.type)&&fastRand()<0.03) nb.updated=true;
  }
}

function updateMist(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??80)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r-1,c)&&fastRand()<0.08){swap(grid,r,c,r-1,c);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.1){swap(grid,r,c,r,c+dir);return;}
  if (isEmpty(grid,r,c-dir)&&fastRand()<0.05){swap(grid,r,c,r,c-dir);return;}
}

function updateSpark(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??5)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Jump to conductive neighbors
  const nrs=[r-1,r+1,r,r,r-1,r-1,r+1,r+1];
  const ncs=[c,c,c-1,c+1,c-1,c+1,c-1,c+1];
  for (let i=0;i<8;i++) {
    const t=get(grid,nrs[i],ncs[i])?.type;
    if (t&&['metal','water','saltwater'].includes(t)&&fastRand()<0.3) {
      set(grid,nrs[i],ncs[i],createEl('spark')); return;
    }
    if (t&&isFlammable(t as ElementType)&&fastRand()<0.1) set(grid,nrs[i],ncs[i],createEl('fire'));
  }
  // Move randomly
  const [nr,nc]=[nrs,ncs].map(a=>a[(fastRand()*8)|0]);
  if (Array.isArray(nr)&&isEmpty(grid,nr[0],nc as unknown as number)&&fastRand()<0.3)
    swap(grid,r,c,nr[0],nc as unknown as number);
}

function updateWhirlwind(grid: Grid, r: number, c: number) {
  const el=grid[idx(r,c)]; if (!el) return;
  el.life=(el.life??150)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Rotate nearby particles
  const radius=3;
  for (let dr=-radius;dr<=radius;dr++) {
    for (let dc=-radius;dc<=radius;dc++) {
      if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.1) {
        const nb=get(grid,r+dr,c+dc);
        if (nb&&nb.type!=='whirlwind'&&!['stone','concrete','metal'].includes(nb.type)) {
          // Spin: move clockwise
          const newDr=dc; const newDc=-dr;
          if (isEmpty(grid,r+newDr,c+newDc)) swap(grid,r+dr,c+dc,r+newDr,c+newDc);
        }
      }
    }
  }
  // Whirlwind itself moves up
  if (isEmpty(grid,r-1,c)&&fastRand()<0.1) swap(grid,r,c,r-1,c);
}

function updateGrass(grid: Grid, r: number, c: number) {
  if (fastRand()>0.02) return;
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05){set(grid,r,c,createEl('fire'));return;}
    // Grow sideways on solid ground
    if (i>=2&&isEmpty(grid,nrs[i],ncs[i])&&isType(grid,nrs[i]+1,ncs[i],'stone','sand','mud','concrete')&&fastRand()<0.005)
      set(grid,nrs[i],ncs[i],createEl('grass'));
    // Grow upward slowly
    if (isEmpty(grid,r-1,c)&&fastRand()<0.002) set(grid,r-1,c,createEl('plant'));
  }
  if (!get(grid,r+1,c)){set(grid,r,c,null);}
}

function updateWheat(grid: Grid, r: number, c: number) {
  if (fastRand()>0.01) return;
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.08){set(grid,r,c,createEl('fire'));return;}
  }
  // Grow upward
  if (isEmpty(grid,r-1,c)&&isType(grid,r+1,c,'stone','sand','mud','concrete')&&fastRand()<0.003)
    set(grid,r-1,c,createEl('wheat'));
  // Mature into seed sometimes
  if (fastRand()<0.0002) set(grid,r,c,createEl('seed'));
  if (!get(grid,r+1,c)){set(grid,r,c,null);}
}

function updateCactus(grid: Grid, r: number, c: number) {
  if (fastRand()>0.005) return;
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'lava')&&fastRand()<0.02){set(grid,r,c,createEl('fire'));return;}
    // Hurt living creatures
    const t=get(grid,nrs[i],ncs[i])?.type;
    if (t&&['ant','frog','crab','worm'].includes(t)&&fastRand()<0.1) set(grid,nrs[i],ncs[i],null);
  }
  // Grow upward in sand
  if (isEmpty(grid,r-1,c)&&isType(grid,r+1,c,'sand','stone')&&fastRand()<0.002)
    set(grid,r-1,c,createEl('cactus'));
}

function updateFungi(grid: Grid, r: number, c: number) {
  if (fastRand()>0.008) return;
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05){set(grid,r,c,null);return;}
    // Grow on moist surfaces
    if (i>=2&&isEmpty(grid,nrs[i],ncs[i])&&isType(grid,nrs[i]+1,ncs[i],'mud','stone','wood','concrete')&&fastRand()<0.003)
      set(grid,nrs[i],ncs[i],createEl('fungi'));
  }
  if (!get(grid,r+1,c)){set(grid,r,c,null);}
}

function updateFirework(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??20)-1;
  if (el.life>10) {
    // Rise up
    if (isEmpty(grid,r-1,c)) swap(grid,r,c,r-1,c);
  } else if (el.life===10) {
    // EXPLODE!
    const colors:ElementType[]=['fire','rainbow','smoke','steam','lightning'];
    for (let dr=-6;dr<=6;dr++) {
      for (let dc=-6;dc<=6;dc++) {
        if (dr*dr+dc*dc<=36&&fastRand()<0.6&&isEmpty(grid,r+dr,c+dc))
          set(grid,r+dr,c+dc,createEl(colors[(fastRand()*colors.length)|0]));
      }
    }
    set(grid,r,c,null);
  }
}

function updateMagicfire(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??60)-1;
  if (el.life<=0){set(grid,r,c,createEl('smoke'));return;}
  // Rises like fire but doesn't burn
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r-1,c)&&fastRand()<0.5){swap(grid,r,c,r-1,c);return;}
  if (isEmpty(grid,r-1,c+dir)&&fastRand()<0.3){swap(grid,r,c,r-1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.2){swap(grid,r,c,r,c+dir);return;}
  // Colorful — change color
  const magicColors=[0xFF9932FF,0x32FF99FF,0x9932FFFF,0xFF3299FF,0x32C8FFFF];
  el.color=magicColors[(fastRand()*magicColors.length)|0]>>>0;
}

function updatePlasma2(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??80)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Gas rises up
  if (isEmpty(grid,r-1,c)&&fastRand()<0.3){swap(grid,r,c,r-1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.2){swap(grid,r,c,r,c+dir);return;}
  // Glows — random purple color
  const cols=[0xC864FFFF,0x8032FFFF,0xFF64C8FF,0xD064FFFF];
  el.color=cols[(fastRand()*cols.length)|0]>>>0;
}

function updateFrostfire(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??50)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  if (isEmpty(grid,r-1,c)&&fastRand()<0.4){swap(grid,r,c,r-1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r-1,c+dir)&&fastRand()<0.3){swap(grid,r,c,r-1,c+dir);return;}
  // Freezes water, spreads on ice
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'water')&&fastRand()<0.1) set(grid,nrs[i],ncs[i],createEl('ice'));
    if (isType(grid,nrs[i],ncs[i],'ice')&&fastRand()<0.03) set(grid,nrs[i],ncs[i],createEl('frostfire'));
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.3){set(grid,r,c,null);return;}
  }
}

function updateSwamp(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.1){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.05){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.03){swap(grid,r,c,r,c+dir);return;}
  // Slowly grows plant/fungi on edges
  if (fastRand()<0.001&&isEmpty(grid,r-1,c)) set(grid,r-1,c,createEl('plant'));
}

function updateCoral(grid: Grid, r: number, c: number) {
  if (fastRand()>0.005) return;
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','acid')&&fastRand()<0.1){set(grid,r,c,null);return;}
    // Grow in water
    if (isType(grid,nrs[i],ncs[i],'water','saltwater')&&i<2&&fastRand()<0.002)
      set(grid,nrs[i],ncs[i],createEl('coral'));
  }
  if (!get(grid,r+1,c)){set(grid,r,c,null);}
}

function updateQuickclay(grid: Grid, r: number, c: number) {
  // Flows when wet
  const wet=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].some(([nr,nc])=>isType(grid,nr,nc,'water','saltwater'));
  if (wet) {
    if (isEmpty(grid,r+1,c)&&fastRand()<0.4){swap(grid,r,c,r+1,c);return;}
    const dir=fastRand()>0.5?1:-1;
    if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.2){swap(grid,r,c,r+1,c+dir);return;}
    if (isEmpty(grid,r,c+dir)&&fastRand()<0.1){swap(grid,r,c,r,c+dir);return;}
  } else {
    // Dry: falls slowly
    if (isEmpty(grid,r+1,c)&&fastRand()<0.05) swap(grid,r,c,r+1,c);
  }
}

function updateEmber(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??30)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Falls slowly, can reignite flammable things
  if (isEmpty(grid,r+1,c)&&fastRand()<0.3){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.2){swap(grid,r,c,r+1,c+dir);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isFlammable(get(grid,nrs[i],ncs[i])?.type as ElementType)&&fastRand()<0.02)
      set(grid,nrs[i],ncs[i],createEl('fire'));
    if (isType(grid,nrs[i],ncs[i],'water','snow','ice')&&fastRand()<0.2){set(grid,r,c,null);return;}
  }
}

function updateAsh(grid: Grid, r: number, c: number, el: Element) {
  el.life=(el.life??60)-1;
  if (el.life<=0){set(grid,r,c,null);return;}
  // Light, rises slightly then settles
  if (isEmpty(grid,r-1,c)&&fastRand()<0.05){swap(grid,r,c,r-1,c);return;}
  if (isEmpty(grid,r+1,c)&&fastRand()<0.1){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.05){swap(grid,r,c,r,c+dir);}
}

function updateSulfur(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)){swap(grid,r,c,r+1,c+dir);return;}
  // Explodes near fire
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','lightning')&&fastRand()<0.15) {
      set(grid,r,c,createEl('explosion')); return;
    }
  }
}

function updateNitroglycerin(grid: Grid, r: number, c: number, el: Element) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.3){swap(grid,r,c,r+1,c);return;}
  const dir=fastRand()>0.5?1:-1;
  if (isEmpty(grid,r+1,c+dir)&&fastRand()<0.15){swap(grid,r,c,r+1,c+dir);return;}
  if (isEmpty(grid,r,c+dir)&&fastRand()<0.08){swap(grid,r,c,r,c+dir);return;}
  // Explodes from ANY contact or vibration
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    const t=get(grid,nrs[i],ncs[i])?.type;
    if (t&&['fire','lava','lightning','explosion','c4','nuke'].includes(t)&&fastRand()<0.5) {
      el.life=0;
    }
    // Also explodes if something falls on it
    if (t&&['sand','gravel','stone'].includes(t)&&fastRand()<0.005) el.life=0;
  }
  if (el.life===0) {
    const radius=10;
    for (let dr=-radius;dr<=radius;dr++)
      for (let dc=-radius;dc<=radius;dc++)
        if (dr*dr+dc*dc<=radius*radius&&fastRand()<0.7) {
          const nb=get(grid,r+dr,c+dc);
          if (nb&&!['stone','metal','concrete'].includes(nb.type))
            set(grid,r+dr,c+dc,fastRand()<0.5?createEl('fire'):null);
        }
    set(grid,r,c,null);
  }
}

function updateWax(grid: Grid, r: number, c: number) {
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05){
      set(grid,r,c,createEl('fire')); return;
    }
  }
  // Melts slowly near heat — becomes liquid
  let nearHeat=false;
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','steam')&&fastRand()<0.01){nearHeat=true;}
  }
  if (nearHeat&&isEmpty(grid,r+1,c)&&fastRand()<0.1) swap(grid,r,c,r+1,c);
}

function updateCotton(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.05){swap(grid,r,c,r+1,c);return;}
  // Very easy to burn
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava','spark','lightning')&&fastRand()<0.2)
      {set(grid,r,c,createEl('fire'));return;}
    if (isType(grid,nrs[i],ncs[i],'water','ice','snow')&&fastRand()<0.01)
      {set(grid,r,c,null);return;} // soaks and disappears
  }
}

function updateRope(grid: Grid, r: number, c: number) {
  // Mostly static but can burn
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.05)
      set(grid,r,c,createEl('fire'));
    if (isType(grid,nrs[i],ncs[i],'acid')&&fastRand()<0.02)
      set(grid,r,c,null);
  }
}

function updatePaper(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.05){swap(grid,r,c,r+1,c);return;}
  // Burns easily, dissolves in water
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.1)
      {set(grid,r,c,createEl('fire'));return;}
    if (isType(grid,nrs[i],ncs[i],'water','saltwater','acid')&&fastRand()<0.02)
      {set(grid,r,c,null);return;}
  }
}

function updateSponge(grid: Grid, r: number, c: number) {
  if (isEmpty(grid,r+1,c)&&fastRand()<0.1){swap(grid,r,c,r+1,c);return;}
  // Absorbs water
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'water','saltwater')&&fastRand()<0.1)
      set(grid,nrs[i],ncs[i],null); // absorb!
    if (isType(grid,nrs[i],ncs[i],'fire','lava')&&fastRand()<0.02)
      set(grid,r,c,createEl('fire'));
  }
}

function updatePumice(grid: Grid, r: number, c: number) {
  // Very light — floats on water
  const below=get(grid,r+1,c);
  if (!below) {swap(grid,r,c,r+1,c);return;}
  if (['water','saltwater','oil'].includes(below.type)) {
    // Float! don't sink
    if (isEmpty(grid,r-1,c)&&fastRand()<0.1) swap(grid,r,c,r-1,c);
    return;
  }
  if (isEmpty(grid,r+1,c)){swap(grid,r,c,r+1,c);return;}
  const nrs=[r-1,r+1,r,r]; const ncs=[c,c,c-1,c+1];
  for (let i=0;i<4;i++) {
    if (isType(grid,nrs[i],ncs[i],'acid','lava')&&fastRand()<0.05)
      {set(grid,r,c,null);return;}
  }
}

// ══════════════════════════════════════════════════
//  AUTO ELEMENTS — Generator blocks
// ══════════════════════════════════════════════════

function updateAutoElement(grid: Grid, r: number, c: number, el: Element, spawnType: ElementType, interval: number) {
  // Auto element is a static generator — it spawns element every N frames
  if (el.meta === undefined) el.meta = 0;
  el.meta = (el.meta + 1) % interval;
  if (el.meta !== 0) return;

  // Spawn in all 4 directions preferring below & sides
  const dirs = [[1,0],[0,1],[0,-1],[-1,0]];
  for (const [dr, dc] of dirs) {
    if (isEmpty(grid, r+dr, c+dc)) {
      set(grid, r+dr, c+dc, createEl(spawnType));
      return; // spawn one at a time
    }
  }
}

// ─── ANTI-GRAVITY ───────────────────────────────────────────────
function updateAntigravity(grid: Grid, r: number, c: number) {
  const el = grid[idx(r, c)];
  if (el) el.color = ANTIGRAVITY_COLORS[(fastRand() * ANTIGRAVITY_COLORS.length) | 0];

  // Itself floats up
  if (isEmpty(grid, r - 1, c) && fastRand() < 0.3) { swap(grid, r, c, r - 1, c); return; }

  // Push nearby particles upward
  const radius = 4;
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (dr * dr + dc * dc <= radius * radius && fastRand() < 0.05) {
        const nr = r + dr;
        const nc = c + dc;
        const nb = get(grid, nr, nc);
        if (nb && nb.type !== 'antigravity' && isDestroyable(nb.type)) {
          // Push up
          if (isEmpty(grid, nr - 1, nc)) {
            swap(grid, nr, nc, nr - 1, nc);
          }
        }
      }
    }
  }
}
