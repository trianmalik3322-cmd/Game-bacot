// Sound System using Web Audio API - No external files needed!
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = true;
let volume = 0.5;

export function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    console.warn('Web Audio API not supported');
  }
}

export function setSoundEnabled(val: boolean) { enabled = val; }
export function getSoundEnabled() { return enabled; }
export function setSoundVolume(val: number) {
  volume = val;
  if (masterGain) masterGain.gain.value = val;
}
export function getSoundVolume() { return volume; }

function getCtx() {
  if (!audioCtx) initAudio();
  if (!audioCtx || !masterGain) return null;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return { ctx: audioCtx, master: masterGain };
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.3, fadeOut = true) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const { ctx, master } = audio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  if (fadeOut) gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, gainVal = 0.2, highpass = 1000) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const { ctx, master } = audio;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(ctx.currentTime);
}

// ============ SOUND EFFECTS ============

export function playSandSound() {
  playNoise(0.1, 0.15, 2000);
}

export function playWaterSound() {
  playTone(400 + Math.random() * 200, 0.2, 'sine', 0.15);
  setTimeout(() => playTone(300 + Math.random() * 100, 0.15, 'sine', 0.1), 50);
}

export function playFireSound() {
  playNoise(0.2, 0.25, 500);
  playTone(150 + Math.random() * 100, 0.3, 'sawtooth', 0.1);
}

export function playExplosionSound() {
  playNoise(0.5, 0.8, 100);
  playTone(80, 0.4, 'square', 0.4);
  setTimeout(() => playTone(60, 0.3, 'sawtooth', 0.2), 100);
}

export function playLavaSound() {
  playNoise(0.3, 0.2, 300);
  playTone(120 + Math.random() * 80, 0.4, 'sawtooth', 0.15);
}

export function playIceSound() {
  playTone(800 + Math.random() * 400, 0.15, 'sine', 0.2);
  playTone(1200 + Math.random() * 200, 0.1, 'sine', 0.1);
}

export function playStoneSound() {
  playNoise(0.15, 0.3, 1500);
  playTone(200, 0.1, 'square', 0.2);
}

export function playSmokeSound() {
  playNoise(0.2, 0.1, 3000);
}

export function playPlantSound() {
  playTone(600, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(800, 0.1, 'sine', 0.1), 80);
}

export function playBombSound() {
  playExplosionSound();
  setTimeout(() => playNoise(0.3, 0.4, 200), 200);
}

export function playAcidSound() {
  playTone(300 + Math.random() * 200, 0.2, 'sawtooth', 0.12);
  playNoise(0.15, 0.1, 2000);
}

export function playLightningSound() {
  playNoise(0.1, 0.9, 100);
  playTone(200, 0.05, 'square', 0.5);
  setTimeout(() => playNoise(0.2, 0.5, 500), 50);
}

export function playVoidSound() {
  playTone(100, 0.4, 'sawtooth', 0.3);
  playTone(50, 0.5, 'sine', 0.2);
}

export function playMagicSound() {
  playTone(800, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(1000, 0.1, 'sine', 0.15), 100);
  setTimeout(() => playTone(1200, 0.1, 'sine', 0.1), 200);
}

export function playBlackHoleSound() {
  playTone(60, 0.6, 'sawtooth', 0.35);
  playTone(40, 0.8, 'sine', 0.2);
}

export function playPortalSound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playTone(400 + i * 100, 0.1, 'sine', 0.15), i * 60);
  }
}

export function playWindSound() {
  playNoise(0.3, 0.15, 4000);
}

export function playC4Sound() {
  // big explosion
  playNoise(0.8, 1.0, 50);
  playTone(60, 0.6, 'square', 0.5);
  setTimeout(() => playNoise(0.4, 0.5, 200), 300);
}

export function playNuclearSound() {
  playNoise(1.0, 0.7, 100);
  playTone(50, 0.8, 'sawtooth', 0.4);
  setTimeout(() => playTone(80, 0.6, 'square', 0.3), 200);
}

export function playPotionSound() {
  playTone(500, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(700, 0.1, 'sine', 0.15), 100);
  setTimeout(() => playTone(400, 0.15, 'sine', 0.1), 200);
}

export function playFireworkSound() {
  playTone(800, 0.05, 'square', 0.3);
  setTimeout(() => playExplosionSound(), 100);
}

export function playCoinSound() {
  playTone(800, 0.08, 'sine', 0.25);
  setTimeout(() => playTone(1000, 0.08, 'sine', 0.2), 80);
  setTimeout(() => playTone(1200, 0.1, 'sine', 0.15), 160);
}

export function playAchievementSound() {
  playTone(400, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(500, 0.1, 'sine', 0.25), 100);
  setTimeout(() => playTone(600, 0.1, 'sine', 0.2), 200);
  setTimeout(() => playTone(800, 0.2, 'sine', 0.3), 300);
}

export function playBuySound() {
  playTone(600, 0.08, 'sine', 0.2);
  setTimeout(() => playTone(800, 0.1, 'sine', 0.25), 100);
}

export function playErrorSound() {
  playTone(200, 0.1, 'square', 0.2);
  setTimeout(() => playTone(150, 0.15, 'square', 0.15), 100);
}

export function playClickSound() {
  playTone(600, 0.05, 'square', 0.15);
}

export function playSeasonSound(season: string) {
  if (season === 'spring') {
    playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.15), 150);
  } else if (season === 'summer') {
    playNoise(0.2, 0.1, 3000);
  } else if (season === 'autumn') {
    playTone(400, 0.2, 'sine', 0.15);
    playNoise(0.2, 0.08, 2000);
  } else if (season === 'winter') {
    playTone(300, 0.3, 'sine', 0.15);
    playTone(200, 0.3, 'sine', 0.1);
  }
}

export function playAutoFarmSound() {
  playTone(400, 0.05, 'sine', 0.1);
}

// Map sound to element
export function playElementSound(element: string) {
  if (!enabled) return;
  const soundMap: Record<string, () => void> = {
    sand: playSandSound,
    water: playWaterSound,
    fire: playFireSound,
    lava: playLavaSound,
    ice: playIceSound,
    stone: playStoneSound,
    smoke: playSmokeSound,
    plant: playPlantSound,
    bomb: playBombSound,
    acid: playAcidSound,
    oil: playAcidSound,
    lightning: playLightningSound,
    void: playVoidSound,
    clone: playMagicSound,
    blackhole: playBlackHoleSound,
    antimatter: playBlackHoleSound,
    plasma: playLightningSound,
    rainbow: playMagicSound,
    dragonfire: playFireSound,
    timesand: playMagicSound,
    antigravity: playWindSound,
    wind: playWindSound,
    c4: playC4Sound,
    nuclear: playNuclearSound,
    nuclearwaste: playNuclearSound,
    potion: playPotionSound,
    firework: playFireworkSound,
    portal: playPortalSound,
    bluefire: playFireSound,
    holywater: playMagicSound,
    superlava: playLavaSound,
    cryo: playIceSound,
    trident: playLightningSound,
    nebula: playPortalSound,
    mindblow: playExplosionSound,
    party: playMagicSound,
    stardust: playMagicSound,
    quicksand: playSandSound,
    mercury: playWaterSound,
    spark: playLightningSound,
    thundercloud: playLightningSound,
    fireworks: playFireworkSound,
  };
  const fn = soundMap[element];
  if (fn) fn();
  else playSandSound(); // default
}
