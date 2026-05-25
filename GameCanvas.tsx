import { useRef, useEffect, useCallback } from 'react';
import { Grid, stepGrid, createEl } from '../game/simulation';
import { getCellSize, getCOLS, getROWS, ElementType, ELEMENTS } from '../game/constants';

interface Props {
  grid: Grid;
  setGrid: (g: Grid) => void;
  selectedElement: ElementType;
  brushSize: number;
  isRunning: boolean;
  speed?: number;
  onBlockSpawned?: (count: number) => void;
  onFpsUpdate?: (fps: number) => void;
  showFPS?: boolean;
  fillRef?: React.MutableRefObject<((el: ElementType) => void) | null>;
  canvasEffectRef?: React.MutableRefObject<((effect: string) => void) | null>;
  screenshotRef?: React.MutableRefObject<(() => void) | null>;
  isModalOpen?: boolean; // NEW: disable canvas interaction when any modal is open
}

const CREATURE_TYPES = new Set(['ant','fish','bird','worm','frog','crab','bee','mushroom']);

export default function GameCanvas({
  grid, setGrid, selectedElement, brushSize, isRunning,
  speed = 1,
  onBlockSpawned,
  onFpsUpdate,
  fillRef,
  canvasEffectRef,
  screenshotRef,
  isModalOpen = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const gridRef = useRef<Grid>(grid);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ r: number; c: number } | null>(null);
  const isModalOpenRef = useRef(isModalOpen);
  const isRunningRef = useRef(isRunning);
  const selectedRef = useRef(selectedElement);
  const brushRef = useRef(brushSize);
  const speedRef = useRef(speed);
  const frameAccum = useRef(0);
  const imageDataRef = useRef<ImageData | null>(null);

  const fpsFrames = useRef(0);
  const fpsLast = useRef(performance.now());

  gridRef.current = grid;
  isRunningRef.current = isRunning;
  isModalOpenRef.current = isModalOpen;
  selectedRef.current = selectedElement;
  brushRef.current = brushSize;
  speedRef.current = speed;

  // Dynamic dims — computed fresh each use
  const getDims = useCallback(() => {
    const CELL_SIZE = getCellSize();
    const COLS = getCOLS();
    const ROWS = getROWS();
    return { CELL_SIZE, COLS, ROWS, W: COLS * CELL_SIZE, H: ROWS * CELL_SIZE };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const { CELL_SIZE, COLS, ROWS, W, H } = getDims();

    if (!imageDataRef.current || imageDataRef.current.width !== W || imageDataRef.current.height !== H) {
      imageDataRef.current = ctx.createImageData(W, H);
      const d = imageDataRef.current.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 15; d[i+1] = 15; d[i+2] = 26; d[i+3] = 255;
      }
    }

    const data = imageDataRef.current.data;
    const g = gridRef.current;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const el = g[r * COLS + c];
        let pr: number, pg: number, pb: number;
        if (el && el.type !== 'empty') {
          const col = el.color;
          pr = col & 0xff; pg = (col >> 8) & 0xff; pb = (col >> 16) & 0xff;
        } else {
          pr = 15; pg = 15; pb = 26;
        }
        const startY = r * CELL_SIZE;
        const startX = c * CELL_SIZE;
        for (let dy = 0; dy < CELL_SIZE; dy++) {
          let base = ((startY + dy) * W + startX) * 4;
          for (let dx = 0; dx < CELL_SIZE; dx++) {
            data[base] = pr; data[base+1] = pg; data[base+2] = pb; data[base+3] = 255;
            base += 4;
          }
        }
      }
    }
    ctx.putImageData(imageDataRef.current, 0, 0);
  }, [getDims]);

  const drawOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { CELL_SIZE, COLS, ROWS, W, H } = getDims();
    ctx.clearRect(0, 0, W, H);
    const g = gridRef.current;
    const fontSize = Math.max(CELL_SIZE - 1, 6);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const el = g[r * COLS + c];
        if (!el || !CREATURE_TYPES.has(el.type)) continue;
        const info = ELEMENTS[el.type as keyof typeof ELEMENTS];
        if (!info?.emoji) continue;
        const x = c * CELL_SIZE + CELL_SIZE / 2;
        const y = r * CELL_SIZE + CELL_SIZE / 2;
        ctx.fillText(info.emoji, x, y);
      }
    }
  }, [getDims]);

  const loop = useCallback(() => {
    const spd = speedRef.current;
    if (isRunningRef.current) {
      if (spd >= 1) {
        const steps = Math.round(spd);
        for (let i = 0; i < steps; i++) stepGrid(gridRef.current);
        setGrid(gridRef.current);
      } else {
        frameAccum.current += spd;
        if (frameAccum.current >= 1) {
          frameAccum.current -= 1;
          stepGrid(gridRef.current);
          setGrid(gridRef.current);
        }
      }
    }
    // Update canvas size if it changed
    const { W, H } = getDims();
    if (canvasRef.current && (canvasRef.current.width !== W || canvasRef.current.height !== H)) {
      canvasRef.current.width = W;
      canvasRef.current.height = H;
      if (overlayRef.current) { overlayRef.current.width = W; overlayRef.current.height = H; }
      imageDataRef.current = null;
    }
    draw();
    drawOverlay();
    fpsFrames.current++;
    const now = performance.now();
    if (now - fpsLast.current >= 500) {
      const fps = Math.round((fpsFrames.current * 1000) / (now - fpsLast.current));
      onFpsUpdate?.(fps);
      fpsFrames.current = 0;
      fpsLast.current = now;
    }
    animRef.current = requestAnimationFrame(loop);
  }, [draw, drawOverlay, setGrid, onFpsUpdate, getDims]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [loop]);

  const placeBrush = useCallback((r: number, c: number): number => {
    const g = gridRef.current;
    const COLS = getCOLS(); const ROWS = getROWS();
    const half = Math.floor(brushRef.current / 2);
    let count = 0;
    for (let dr = -half; dr <= half; dr++) {
      for (let dc = -half; dc <= half; dc++) {
        const nr = r + dr; const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (selectedRef.current === 'empty') {
            g[nr * COLS + nc] = null;
          } else {
            if (!g[nr * COLS + nc] || g[nr * COLS + nc]?.type === 'empty') count++;
            g[nr * COLS + nc] = createEl(selectedRef.current);
          }
        }
      }
    }
    return count;
  }, []);

  // Screenshot
  useEffect(() => {
    if (!screenshotRef) return;
    screenshotRef.current = () => {
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      if (!canvas) return;
      // Merge canvas + overlay into one image
      const { W, H } = getDims();
      const merged = document.createElement('canvas');
      merged.width = W;
      merged.height = H;
      const ctx = merged.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(canvas, 0, 0);
      if (overlay) ctx.drawImage(overlay, 0, 0);
      // Add watermark
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('🌍 SandBox World', W - 8, H - 8);
      // Download
      const link = document.createElement('a');
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
      link.download = `sandbox_world_${ts}.png`;
      link.href = merged.toDataURL('image/png');
      link.click();
    };
  }, [screenshotRef, getDims]);

  // Admin fill canvas
  useEffect(() => {
    if (!fillRef) return;
    fillRef.current = (el: ElementType) => {
      const COLS = getCOLS(); const ROWS = getROWS();
      const g = gridRef.current;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          g[r * COLS + c] = el === 'empty' ? null : createEl(el);
        }
      }
      setGrid(g);
    };
  }, [fillRef, setGrid]);

  // Canvas effects (boosts, weapons, nature events)
  useEffect(() => {
    if (!canvasEffectRef) return;
    canvasEffectRef.current = (effect: string) => {
      const COLS = getCOLS(); const ROWS = getROWS();
      const g = gridRef.current;

      const spawnRow = (row: number, el: ElementType, density = 1) => {
        for (let c = 0; c < COLS; c++) {
          if (Math.random() < density) g[row * COLS + c] = createEl(el);
        }
      };
      const spawnCol = (col: number, el: ElementType, rowStart = 0, rowEnd?: number) => {
        const end = rowEnd ?? ROWS;
        for (let r = rowStart; r < end; r++) g[r * COLS + col] = createEl(el);
      };
      const spawnRect = (r0: number, c0: number, r1: number, c1: number, el: ElementType, density = 1) => {
        for (let r = Math.max(0,r0); r < Math.min(ROWS,r1); r++)
          for (let c = Math.max(0,c0); c < Math.min(COLS,c1); c++)
            if (Math.random() < density) g[r * COLS + c] = createEl(el);
      };
      const spawnCircle = (cr: number, cc: number, radius: number, el: ElementType) => {
        for (let r = cr - radius; r <= cr + radius; r++)
          for (let c = cc - radius; c <= cc + radius; c++)
            if (r>=0&&r<ROWS&&c>=0&&c<COLS && (r-cr)**2+(c-cc)**2 <= radius**2)
              g[r * COLS + c] = createEl(el);
      };

      if (effect === 'rain') {
        // Spawn water drops from top 3 rows
        for (let i = 0; i < 3; i++) spawnRow(i, 'water', 0.6);
      } else if (effect === 'volcano') {
        // Spawn lava from center bottom
        const cx = Math.floor(COLS / 2);
        for (let i = -5; i <= 5; i++) {
          for (let r = ROWS - 8; r < ROWS; r++) {
            if (r >= 0 && r < ROWS && cx+i >= 0 && cx+i < COLS)
              g[r * COLS + (cx+i)] = createEl('lava');
          }
        }
        // Shoot lava upward
        for (let r = 0; r < Math.floor(ROWS/2); r++) spawnRow(r, 'lava', 0.1);
      } else if (effect === 'snowstorm') {
        for (let i = 0; i < 4; i++) spawnRow(i, 'snow', 0.7);
      } else if (effect === 'earthquake') {
        // Shake: move particles randomly
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const el = g[r * COLS + c];
            if (!el || el.type === 'empty') continue;
            const nr = Math.min(ROWS-1, Math.max(0, r + Math.floor(Math.random()*5-2)));
            const nc = Math.min(COLS-1, Math.max(0, c + Math.floor(Math.random()*5-2)));
            if (!g[nr * COLS + nc] || g[nr * COLS + nc]?.type === 'empty') {
              g[nr * COLS + nc] = el;
              g[r * COLS + c] = null;
            }
          }
        }
        // Also spawn explosion dots
        for (let i = 0; i < 30; i++) {
          const r = Math.floor(Math.random() * ROWS);
          const c = Math.floor(Math.random() * COLS);
          g[r * COLS + c] = createEl('explosion');
        }
      } else if (effect === 'luckybox') {
        const prizes: ElementType[] = ['fire','water','sand','ice','plant','lava','smoke','crystal','honey'];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        spawnCircle(Math.floor(ROWS/2), Math.floor(COLS/2), 5, prize);
      } else if (effect === 'megaluckybox') {
        const prizes: ElementType[] = ['fire','lava','ice','plant','crystal','void','clone','lightning'];
        for (let i = 0; i < 3; i++) {
          const prize = prizes[Math.floor(Math.random() * prizes.length)];
          spawnCircle(
            Math.floor(Math.random() * ROWS),
            Math.floor(Math.random() * COLS),
            6, prize
          );
        }
      } else if (effect === 'unlock_flood' || effect === 'unlock_ocean') {
        spawnRect(Math.floor(ROWS * 0.4), 0, ROWS, COLS, 'water');
        spawnRect(ROWS - 5, 0, ROWS, COLS, 'sand');
      } else if (effect === 'unlock_wildfire') {
        spawnCol(0, 'fire', 0, ROWS);
        spawnRect(0, 0, ROWS, 5, 'fire', 0.8);
      } else if (effect === 'unlock_jungle' || effect === 'unlock_desert') {
        if (effect === 'unlock_jungle') {
          spawnRect(ROWS - 3, 0, ROWS, COLS, 'mud');
          spawnRect(0, 0, ROWS - 3, COLS, 'plant', 0.3);
          spawnRect(0, 0, ROWS, COLS, 'water', 0.1);
        } else {
          spawnRect(ROWS - 4, 0, ROWS, COLS, 'sand');
          spawnRect(0, 0, ROWS, COLS, 'sand', 0.4);
          spawnRect(0, 0, ROWS, COLS, 'stone', 0.05);
        }
      } else if (effect === 'unlock_arctic') {
        spawnRect(0, 0, ROWS, COLS, 'snow', 0.5);
        spawnRect(ROWS - 5, 0, ROWS, COLS, 'ice');
      } else if (effect === 'unlock_volcanoB') {
        const cx = Math.floor(COLS / 2);
        // Build volcano shape
        for (let r = 0; r < ROWS; r++) {
          const width = Math.max(1, Math.floor((r / ROWS) * 20));
          for (let dc = -width; dc <= width; dc++) {
            const c = cx + dc;
            if (c >= 0 && c < COLS) g[r * COLS + c] = createEl(r > ROWS * 0.7 ? 'stone' : 'lava');
          }
        }
      } else if (effect === 'unlock_meteorshower') {
        for (let i = 0; i < 15; i++) {
          const c = Math.floor(Math.random() * COLS);
          for (let r = 0; r < Math.floor(ROWS * 0.3); r++) {
            g[r * COLS + c] = createEl('fire');
          }
          spawnCircle(Math.floor(ROWS * 0.3), c, 4, 'explosion');
          spawnCircle(Math.floor(ROWS * 0.3), c, 2, 'lava');
        }
      } else if (effect?.startsWith('unlock_airstrike') || effect === 'unlock_airstrike') {
        for (let i = 0; i < 10; i++) {
          const c = Math.floor(Math.random() * COLS);
          const r = Math.floor(Math.random() * Math.floor(ROWS / 2));
          spawnCircle(r, c, 4, 'explosion');
          spawnCircle(r, c, 2, 'fire');
        }
      } else if (effect === 'unlock_laser') {
        const row = Math.floor(ROWS / 2);
        for (let c = 0; c < COLS; c++) g[row * COLS + c] = createEl('fire');
        for (let c = 0; c < COLS; c++) {
          if (row-1 >= 0) g[(row-1) * COLS + c] = createEl('smoke');
          if (row+1 < ROWS) g[(row+1) * COLS + c] = createEl('smoke');
        }
      } else if (effect === 'unlock_tsunami') {
        for (let c = 0; c < Math.floor(COLS * 0.3); c++) spawnCol(c, 'water');
      } else if (effect === 'unlock_freezeray') {
        const row = Math.floor(ROWS / 2);
        for (let c = 0; c < COLS; c++) g[row * COLS + c] = createEl('ice');
      } else if (effect === 'unlock_flamethrower') {
        for (let c = 0; c < COLS; c++) {
          const row = Math.floor(ROWS / 2) + Math.floor(Math.random() * 5 - 2);
          if (row >= 0 && row < ROWS) g[row * COLS + c] = createEl('fire');
        }
      } else if (effect === 'unlock_supernova' || effect === 'unlock_bhbomb') {
        // Fill whole canvas with explosion then clear
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            g[r * COLS + c] = Math.random() > 0.5 ? createEl('explosion') : createEl('fire');
      } else if (effect === 'unlock_acidrain') {
        for (let i = 0; i < 4; i++) spawnRow(i, 'acid', 0.6);
      }

      setGrid(g);
    };
  }, [canvasEffectRef, setGrid]);

  const placeElements = useCallback((r0: number, c0: number, r1: number, c1: number) => {
    const dr = r1 - r0; const dc = c1 - c0;
    const steps = Math.max(Math.abs(dr), Math.abs(dc), 1);
    let total = 0;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = Math.round(r0 + dr * t);
      const c = Math.round(c0 + dc * t);
      total += placeBrush(r, c);
    }
    if (total > 0 && onBlockSpawned) onBlockSpawned(total);
  }, [placeBrush, onBlockSpawned]);

  const getPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const { CELL_SIZE, COLS, ROWS, W, H } = getDims();
    const x = (clientX - rect.left) / rect.width * W;
    const y = (clientY - rect.top) / rect.height * H;
    const c = Math.floor(x / CELL_SIZE);
    const r = Math.floor(y / CELL_SIZE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
    return { r, c };
  }, [getDims]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isModalOpenRef.current) return;
    isDrawing.current = true;
    const pos = getPos(e.clientX, e.clientY);
    if (pos) { placeElements(pos.r, pos.c, pos.r, pos.c); lastPos.current = pos; }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current || isModalOpenRef.current) return;
    const pos = getPos(e.clientX, e.clientY);
    if (pos) { const prev = lastPos.current ?? pos; placeElements(prev.r, prev.c, pos.r, pos.c); lastPos.current = pos; }
  };
  const handleMouseUp = () => { isDrawing.current = false; lastPos.current = null; };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => {
      // Kalau modal lagi buka, jangan intercept touch sama sekali
      // biar keyboard Android bisa muncul normal di input field
      if (isModalOpenRef.current) return;
      e.preventDefault();
      isDrawing.current = true;
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const pos = getPos(touch.clientX, touch.clientY);
      if (pos) { placeElements(pos.r, pos.c, pos.r, pos.c); lastPos.current = pos; }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isModalOpenRef.current) return;
      e.preventDefault();
      if (!isDrawing.current) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const pos = getPos(touch.clientX, touch.clientY);
        if (pos) { const prev = lastPos.current ?? pos; placeElements(prev.r, prev.c, pos.r, pos.c); lastPos.current = pos; }
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isModalOpenRef.current) return;
      e.preventDefault();
      if (e.touches.length === 0) { isDrawing.current = false; lastPos.current = null; }
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [getPos, placeElements]);

  const { W, H } = getDims();
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} width={W} height={H}
        tabIndex={-1}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', imageRendering:'pixelated', touchAction:'none', WebkitUserSelect:'none', userSelect:'none', cursor:'crosshair', borderRadius:'12px', outline:'none' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      />
      <canvas ref={overlayRef} width={W} height={H}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', imageRendering:'pixelated', pointerEvents:'none', touchAction:'none', borderRadius:'12px' }}
      />
    </div>
  );
}
