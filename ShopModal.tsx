import { useState, useMemo } from 'react';
import { SHOP_ITEMS, SHOP_CATEGORIES, PREMIUM_TIER, SUPER_PREMIUM_TIER, ShopItem, buyItem } from '../game/shop';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  onPointsChange: (newPoints: number) => void;
  ownedItems: Set<string>;
  onOwnItem: (itemId: string) => void;
  hasPremium: boolean;
  hasSuperPremium: boolean;
  onPremium: () => void;
  onSuperPremium: () => void;
  onSelectElement: (el: string) => void;
  onToast: (msg: string) => void;
  onBoostEffect: (effect: string, bonusPoints?: number) => void;
}

export default function ShopModal({
  isOpen, onClose, points, onPointsChange,
  ownedItems, onOwnItem, hasPremium, hasSuperPremium, onPremium, onSuperPremium,
  onSelectElement, onToast, onBoostEffect,
}: ShopModalProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let items = SHOP_ITEMS;
    if (activeCategory !== 'all') items = items.filter(i => i.category === activeCategory);
    if (search.trim()) items = items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    );
    return items;
  }, [activeCategory, search]);

  if (!isOpen) return null;

  const handleBuy = (item: ShopItem) => {
    const result = buyItem(points, item, ownedItems, hasPremium, hasSuperPremium);
    if (!result.success) { onToast(result.message); return; }

    // Update points
    onPointsChange(result.newPoints);

    // Mark as owned if not consumable
    if (!item.isConsumable) onOwnItem(item.id);

    // Trigger effect based on item
    const effect = item.effect || '';

    // Element unlock → map effect to element name and auto-select
    // effect string must match EXACTLY what's in shop.ts
    const ELEMENT_EFFECT_MAP: Record<string, string> = {
      unlock_antimatter:  'antimatter',
      unlock_plasma:      'plasma',
      unlock_magma:       'magma',
      unlock_blackhole:   'blackhole',
      unlock_rainbow:     'rainbow',
      unlock_dragonfire:  'dragonfire',
      unlock_timesand:    'timesand',
      unlock_antigravity: 'antigravity',
      unlock_meteor:      'meteor',
      unlock_tornado:     'tornado',
      unlock_electricity: 'electricity',
      unlock_poison:      'poison',
      unlock_magnet:      'magnet',
      unlock_diamond:     'diamond',
      unlock_nuke:        'nuke',
      unlock_mirror:      'mirror',
      unlock_portal:      'portal',
      unlock_warp:        'warp',
      unlock_darkmatter:  'darkmatter',
      unlock_thunderstorm:'thunderstorm',
      unlock_slime:       'slime',
      unlock_soapbubble:  'soapbubble',
      unlock_cheese:      'cheese',
      unlock_glue:        'glue',
      unlock_prism:       'prism',
      unlock_quicksand:   'quicksand',
      unlock_superlava:   'superlava',
      unlock_holywater:   'holywater',
      unlock_bluefire:    'bluefire',
      unlock_stormcloud:  'stormcloud',
      unlock_toxicmud:    'toxicmud',
      unlock_dryice:      'dryice',
      unlock_c4:          'c4',
      unlock_obsidian:    'obsidian',
      unlock_gravitywell: 'gravitywell',
      unlock_colorbomb:   'colorbomb',
      unlock_wind:        'wind',
      unlock_seed:        'seed',
      unlock_rubber:      'rubber',
      unlock_nuclear:     'nuclear',
    };
    if (item.category === 'element' && ELEMENT_EFFECT_MAP[effect]) {
      // First mark as owned so the element is unlocked in the picker
      onOwnItem(item.id);
      onSelectElement(ELEMENT_EFFECT_MAP[effect]);
    }

    // Creature unlock → map effect to element name and auto-select
    const CREATURE_EFFECT_MAP: Record<string, string> = {
      unlock_babydragon: 'babydragon',
      unlock_unicorn:    'unicorn',
      unlock_ghost:      'ghost',
      unlock_robot:      'robot',
      unlock_alien:      'alien',
      unlock_shark:      'shark',
      unlock_cat:        'cat',
      unlock_spider:     'spider',
      unlock_penguin:    'penguin',
      unlock_snake:      'snake',
      unlock_butterfly:  'butterfly',
      unlock_phoenix:    'phoenix',
      unlock_whale:      'whale',
      unlock_dinosaur:   'dinosaur',
      unlock_demon:      'demon',
      unlock_wolf:       'wolf',
      unlock_lion:       'lion',
      unlock_octopus:    'octopus',
      unlock_eagle:      'eagle',
      unlock_turtle:     'turtle',
      unlock_rabbit:     'rabbit',
      unlock_bear:       'bear',
      unlock_jellyfish:  'jellyfish',
      unlock_kingcrab:   'kingcrab',
      unlock_queenbee:   'queenbee',
      unlock_elderdragon:'elderdragon',
      unlock_angel:      'angel',
      unlock_kraken:     'kraken',
      unlock_titan:      'titan',
      unlock_sandgod:    'sandgod',
    };
    if (item.category === 'creature' && CREATURE_EFFECT_MAP[effect]) {
      // First mark as owned so the creature is unlocked in the picker
      onOwnItem(item.id);
      onSelectElement(CREATURE_EFFECT_MAP[effect]);
    }

    // Boost effects
    if (effect === 'boost_coinrain') onBoostEffect('coinrain', 200);
    if (effect === 'boost_megacoin') onBoostEffect('megacoin', 1000);
    if (effect === 'boost_2x_60s') onBoostEffect('2x_60s');
    if (effect === 'boost_5x_30s') onBoostEffect('5x_30s');
    if (effect === 'boost_10x_20s') onBoostEffect('10x_20s');
    if (effect === 'boost_autoclear') onBoostEffect('autoclear');
    if (effect === 'boost_rain') onBoostEffect('rain');
    if (effect === 'boost_volcano') onBoostEffect('volcano');
    if (effect === 'boost_snowstorm') onBoostEffect('snowstorm');
    if (effect === 'boost_earthquake') onBoostEffect('earthquake');
    if (effect === 'boost_gravityflip') onBoostEffect('gravityflip');
    if (effect === 'boost_rainbowmode') onBoostEffect('rainbowmode');

    // Lucky boxes
    if (effect === 'unlock_luckybox') onBoostEffect('luckybox');
    if (effect === 'unlock_megaluckybox') onBoostEffect('megaluckybox');

    // Nature biomes
    if (item.category === 'nature') onBoostEffect(effect);

    // Weapons
    if (item.category === 'weapon') onBoostEffect(effect);

    // Special consumable effects
    if (item.category === 'special' && item.isConsumable) onBoostEffect(effect);

    // Screenshot tool — non-consumable, just owned
    if (effect === 'unlock_screenshot') {
      // Already added via onOwnItem above — item.id = 'sp_screenshot'
    }

    // Map size
    if (effect === 'map_large') onBoostEffect('map_large');
    if (effect === 'map_super') onBoostEffect('map_super');
    if (effect === 'map_superpremium') onBoostEffect('map_superpremium');

    // New boost effects
    if (effect === 'boost_supercoin') onBoostEffect('supercoin', 5000);
    if (effect === 'boost_freeze') onBoostEffect('freeze');
    if (effect === 'boost_speedburst') onBoostEffect('speedburst');
    if (effect === 'boost_megamagnet') onBoostEffect('megamagnet');
    if (effect === 'boost_acidshower') onBoostEffect('acidshower');
    if (effect === 'boost_luckydraw') onBoostEffect('luckydraw');

    // SuperPremium special effects
    if (item.category === 'superpremium' && item.isConsumable) onBoostEffect(effect);

    onToast(`✅ ${item.name} berhasil dibeli!`);
  };

  const handleBuyPremium = () => {
    if (hasPremium) { onToast('Sudah Premium! 👑'); return; }
    if (points < PREMIUM_TIER.price) {
      onToast(`Kurang ${PREMIUM_TIER.price - points} poin!`); return;
    }
    onPointsChange(points - PREMIUM_TIER.price);
    onPremium();
    onToast('👑 Welcome to Premium! +200 bonus poin!');
  };

  const handleBuySuperPremium = () => {
    if (hasSuperPremium) { onToast('Sudah SuperPremium! 💎'); return; }
    if (points < SUPER_PREMIUM_TIER.price) {
      onToast(`Kurang ${(SUPER_PREMIUM_TIER.price - points).toLocaleString()} poin!`); return;
    }
    onPointsChange(points - SUPER_PREMIUM_TIER.price);
    onSuperPremium();
    onToast('💎 WELCOME TO SUPERPREMIUM! +5000 bonus poin! 🚀');
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      element: { bg: '#3b1f6e', text: '#d8b4fe', border: '#7c3aed' },
      creature: { bg: '#1a3a1a', text: '#86efac', border: '#16a34a' },
      tool: { bg: '#0f2d4a', text: '#67e8f9', border: '#0891b2' },
      boost: { bg: '#3a2a00', text: '#fde68a', border: '#d97706' },
      nature: { bg: '#0f3a2a', text: '#6ee7b7', border: '#059669' },
      weapon: { bg: '#3a0f0f', text: '#fca5a5', border: '#dc2626' },
      cosmetic: { bg: '#2a1a3a', text: '#f0abfc', border: '#c026d3' },
      special: { bg: '#1a2a3a', text: '#93c5fd', border: '#2563eb' },
      superpremium: { bg: '#0c0a1e', text: '#22d3ee', border: '#06b6d4' },
    };
    return colors[cat] || { bg: '#1e293b', text: '#cbd5e1', border: '#475569' };
  };

  const isOwned = (item: ShopItem) => !item.isConsumable && ownedItems.has(item.id);
  const isLocked = (item: ShopItem) => {
    if (item.isSuperPremium) return !hasSuperPremium;
    if (item.isPremium) return !hasPremium && !hasSuperPremium;
    return false;
  };
  // SuperPremium check handled inline in JSX
  const canAffordItem = (item: ShopItem) => points >= item.price;

  const totalItems = SHOP_ITEMS.length;
  const ownedCount = SHOP_ITEMS.filter(i => ownedItems.has(i.id)).length;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '8px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        borderRadius: '16px',
        border: '1px solid #7c3aed',
        width: '100%', maxWidth: '680px',
        height: '92vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(124,58,237,0.4)',
      }}>

        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(90deg, #4c1d95, #7c3aed, #4c1d95)',
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: '8px',
          flexShrink: 0,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          scrollbarWidth: 'none' as any,
        }}>
          {/* Kiri: icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '22px' }}>🛍️</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: '16px', lineHeight: 1, whiteSpace: 'nowrap' }}>SandBox Shop</div>
              <div style={{ color: '#c4b5fd', fontSize: '10px', whiteSpace: 'nowrap' }}>{totalItems} item • {ownedCount} dimiliki</div>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, minWidth: '8px' }} />

          {/* Koin */}
          <div style={{
            background: '#1a1040', border: '1px solid #f59e0b',
            borderRadius: '20px', padding: '4px 10px',
            color: '#fde68a', fontWeight: 800, fontSize: '13px',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            🪙 {points.toLocaleString()}
          </div>

          {/* Badge Premium */}
          {hasPremium && (
            <div style={{
              background: 'linear-gradient(90deg, #f59e0b, #d97706)',
              borderRadius: '20px', padding: '4px 8px',
              color: '#000', fontWeight: 900, fontSize: '11px',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>👑 PREMIUM</div>
          )}

          {/* Badge SuperPremium */}
          {hasSuperPremium && (
            <div style={{
              background: 'linear-gradient(90deg, #06b6d4, #a855f7)',
              borderRadius: '20px', padding: '4px 8px',
              color: '#fff', fontWeight: 900, fontSize: '11px',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>💎 SUPER</div>
          )}

          {/* Tombol Close — SELALU di paling kanan, ga bisa kepotong */}
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #dc2626)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '8px 14px', cursor: 'pointer',
              fontWeight: 900, fontSize: '16px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(220,38,38,0.4)',
              lineHeight: 1,
            }}
          >✕</button>
        </div>

        {/* PREMIUM BANNER */}
        {!hasPremium && (
          <div style={{
            background: 'linear-gradient(90deg, #92400e, #d97706, #92400e)',
            padding: '8px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>👑</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '13px' }}>SandBox Premium</div>
                <div style={{ color: '#fde68a', fontSize: '10px' }}>20+ perks eksklusif + semua elemen unlock!</div>
              </div>
            </div>
            <button onClick={handleBuyPremium} style={{
              background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
              color: '#000', border: 'none', borderRadius: '8px',
              padding: '6px 14px', cursor: 'pointer',
              fontWeight: 900, fontSize: '13px',
              boxShadow: '0 2px 8px rgba(245,158,11,0.5)',
            }}>
              🪙 {PREMIUM_TIER.price.toLocaleString()}
            </button>
          </div>
        )}

        {/* SUPER PREMIUM BANNER */}
        {!hasSuperPremium && (
          <div style={{
            background: 'linear-gradient(90deg, #1e1b4b, #4c1d95, #701a75, #4c1d95, #1e1b4b)',
            padding: '8px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
            borderBottom: '1px solid #7c3aed',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>💎</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: '13px' }}>SuperPremium</span>
                  <span style={{ background: 'linear-gradient(90deg,#06b6d4,#a855f7,#ec4899)', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '1px 6px', borderRadius: '99px' }}>NEW</span>
                </div>
                <div style={{ color: '#c4b5fd', fontSize: '10px' }}>25+ perks • Map Raksasa • 10x Point Permanen!</div>
              </div>
            </div>
            <button onClick={handleBuySuperPremium} style={{
              background: 'linear-gradient(90deg, #06b6d4, #a855f7, #ec4899)',
              color: '#fff', border: 'none', borderRadius: '8px',
              padding: '6px 14px', cursor: 'pointer',
              fontWeight: 900, fontSize: '12px',
              boxShadow: '0 2px 12px rgba(168,85,247,0.6)',
            }}>
              🪙 {SUPER_PREMIUM_TIER.price.toLocaleString()}
            </button>
          </div>
        )}
        {hasSuperPremium && (
          <div style={{
            background: 'linear-gradient(90deg, #0c0a1e, #1e1b4b, #0c0a1e)',
            padding: '6px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '16px' }}>💎</span>
            <span style={{ color: '#c4b5fd', fontWeight: 900, fontSize: '12px' }}>SuperPremium Active — Semua fitur unlocked!</span>
            <span style={{ fontSize: '16px' }}>🚀</span>
          </div>
        )}

        {/* SEARCH */}
        <div style={{ padding: '8px 12px', flexShrink: 0, background: 'rgba(0,0,0,0.3)' }}>
          <input
            type="text"
            placeholder="🔍 Cari item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.07)',
              border: '1px solid #4c1d95', borderRadius: '8px',
              padding: '6px 12px', color: '#e2e8f0',
              fontSize: '13px', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* CATEGORY TABS */}
        <div style={{
          display: 'flex', gap: '4px', padding: '4px 12px',
          overflowX: 'auto', flexShrink: 0,
          background: 'rgba(0,0,0,0.2)',
          scrollbarWidth: 'none',
        }}>
          {SHOP_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              background: activeCategory === cat.id
                ? 'linear-gradient(135deg, #7c3aed, #4c1d95)'
                : 'rgba(255,255,255,0.05)',
              border: activeCategory === cat.id ? '1px solid #a78bfa' : '1px solid #374151',
              borderRadius: '20px', padding: '4px 10px',
              color: activeCategory === cat.id ? '#fff' : '#94a3b8',
              cursor: 'pointer', fontSize: '11px', fontWeight: 700,
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.2s',
            }}>
              {cat.emoji} {cat.label}
              <span style={{
                marginLeft: '4px', background: 'rgba(255,255,255,0.15)',
                borderRadius: '10px', padding: '0 5px', fontSize: '10px',
              }}>
                {cat.id === 'all'
                  ? SHOP_ITEMS.length
                  : SHOP_ITEMS.filter(i => i.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* ITEMS LIST */}
        <div style={{
          flex: 1, overflowY: 'scroll',
          padding: '8px 12px',
          display: 'flex', flexDirection: 'column', gap: '6px',
          WebkitOverflowScrolling: 'touch' as any,
        }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontSize: '14px' }}>
              😕 Tidak ada item ditemukan
            </div>
          )}
          {filtered.map(item => {
            const owned = isOwned(item);
            const locked = isLocked(item);
            const affordable = canAffordItem(item);
            const colors = getCategoryColor(item.category);

            return (
              <div key={item.id} style={{
                background: owned
                  ? 'rgba(16, 185, 129, 0.1)'
                  : locked
                    ? 'rgba(0,0,0,0.3)'
                    : `rgba(0,0,0,0.35)`,
                border: `1.5px solid ${owned ? '#059669' : locked ? '#374151' : colors.border}`,
                borderRadius: '10px',
                padding: '8px 10px',
                display: 'flex', alignItems: 'center', gap: '10px',
                opacity: locked ? 0.65 : 1,
                transition: 'all 0.15s',
              }}>
                {/* EMOJI */}
                <div style={{
                  fontSize: '26px', flexShrink: 0, width: '36px',
                  textAlign: 'center', lineHeight: 1,
                  filter: owned ? 'none' : locked ? 'grayscale(80%)' : 'none',
                }}>
                  {item.emoji.split('')[0]}
                </div>

                {/* INFO */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      color: owned ? '#86efac' : colors.text,
                      fontWeight: 900, fontSize: '14px',
                      lineHeight: 1.2,
                    }}>
                      {item.name}
                    </span>
                    {item.isConsumable && (
                      <span style={{
                        background: 'rgba(251,191,36,0.15)',
                        border: '1px solid #f59e0b',
                        borderRadius: '4px', padding: '0 4px',
                        color: '#fbbf24', fontSize: '9px', fontWeight: 700,
                      }}>CONSUMABLE</span>
                    )}
                    {item.isSuperPremium ? (
                      <span style={{
                        background: 'linear-gradient(90deg,rgba(6,182,212,0.25),rgba(168,85,247,0.25))',
                        border: '1px solid #22d3ee',
                        borderRadius: '4px', padding: '0 5px',
                        color: '#22d3ee', fontSize: '9px', fontWeight: 900,
                        letterSpacing: '0.5px',
                      }}>💎 SUPERPREMIUM</span>
                    ) : item.isPremium && (
                      <span style={{
                        background: 'rgba(245,158,11,0.2)',
                        border: '1px solid #d97706',
                        borderRadius: '4px', padding: '0 4px',
                        color: '#fde68a', fontSize: '9px', fontWeight: 700,
                      }}>👑 PREMIUM</span>
                    )}
                    {owned && (
                      <span style={{
                        background: 'rgba(16,185,129,0.2)',
                        border: '1px solid #059669',
                        borderRadius: '4px', padding: '0 4px',
                        color: '#6ee7b7', fontSize: '9px', fontWeight: 700,
                      }}>✅ DIMILIKI</span>
                    )}
                  </div>
                  <div style={{
                    color: '#94a3b8', fontSize: '11px',
                    marginTop: '2px', lineHeight: 1.3,
                  }}>
                    {item.description}
                  </div>
                  <div style={{ marginTop: '3px' }}>
                    <span style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px', padding: '1px 6px',
                      color: colors.text, fontSize: '9px', fontWeight: 700,
                    }}>
                      {SHOP_CATEGORIES.find(c => c.id === item.category)?.emoji}{' '}
                      {SHOP_CATEGORIES.find(c => c.id === item.category)?.label}
                    </span>
                  </div>
                </div>

                {/* BUY BUTTON */}
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  {owned && !item.isConsumable ? (
                    <div style={{
                      background: 'rgba(16,185,129,0.2)',
                      border: '1px solid #059669',
                      borderRadius: '8px', padding: '6px 10px',
                      color: '#6ee7b7', fontSize: '12px', fontWeight: 700,
                    }}>✅</div>
                  ) : locked ? (
                    <div style={{
                      background: item.isSuperPremium
                        ? 'rgba(34,211,238,0.1)'
                        : 'rgba(245,158,11,0.1)',
                      border: `1px solid ${item.isSuperPremium ? '#22d3ee' : '#d97706'}`,
                      borderRadius: '8px', padding: '6px 10px',
                      color: item.isSuperPremium ? '#22d3ee' : '#fde68a',
                      fontSize: '11px', fontWeight: 700,
                      cursor: 'pointer', textAlign: 'center',
                    }}>
                      {item.isSuperPremium ? '💎' : '🔒'}
                      <br />
                      <span style={{ fontSize: '9px' }}>
                        {item.isSuperPremium ? 'SuperPrem' : 'Premium'}
                      </span>
                    </div>
                  ) : (
                    <button onClick={() => handleBuy(item)} style={{
                      background: affordable
                        ? `linear-gradient(135deg, ${colors.border}, ${colors.bg})`
                        : 'rgba(100,116,139,0.3)',
                      border: `1px solid ${affordable ? colors.border : '#374151'}`,
                      borderRadius: '8px', padding: '6px 10px',
                      color: affordable ? '#fff' : '#64748b',
                      cursor: affordable ? 'pointer' : 'not-allowed',
                      fontWeight: 800, fontSize: '12px',
                      minWidth: '60px', textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      <div>🪙 {item.price >= 1000 ? `${(item.price / 1000).toFixed(0)}K` : item.price}</div>
                      {!affordable && (
                        <div style={{ fontSize: '9px', color: '#f87171' }}>
                          -{item.price - points >= 1000 ? `${Math.ceil((item.price - points) / 1000)}K` : item.price - points}
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div style={{
          padding: '8px 16px', flexShrink: 0,
          background: 'rgba(0,0,0,0.4)',
          borderTop: '1px solid #4c1d95',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ color: '#7c3aed', fontSize: '11px' }}>
            💡 10 blok spawn = 🪙 1 poin
          </div>
          <div style={{ color: '#64748b', fontSize: '11px' }}>
            {filtered.length} / {totalItems} item ditampilkan
          </div>
        </div>
      </div>
    </div>
  );
}
