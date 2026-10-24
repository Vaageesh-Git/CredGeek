// Generates rich, industry-standard illustration & badge SVGs and uploads them to Cloudinary.
// Idempotent (overwrite=false by default; pass { overwrite: true } to refresh).
import { getStore } from './store.js';
import { paths } from './paths.js';
import { lessons } from '../content/lessons.js';
import { BADGES, rungs } from '../content/misc.js';

function rungArt(n) {
  const configs = {
    0: {
      bg1: '#064e3b', bg2: '#0f766e', accent: '#34d399', text: 'OWN ACCOUNT',
      glyph: `
        <!-- Bank & SIM & Mobile -->
        <rect x="36" y="52" width="88" height="66" rx="8" fill="#042f2e" stroke="#2dd4bf" stroke-width="2"/>
        <path d="M40 52 L80 28 L120 52 Z" fill="#14b8a6"/>
        <circle cx="80" cy="42" r="6" fill="#fef08a"/>
        <rect x="50" y="64" width="8" height="42" rx="2" fill="#99f6e4"/>
        <rect x="66" y="64" width="8" height="42" rx="2" fill="#99f6e4"/>
        <rect x="86" y="64" width="8" height="42" rx="2" fill="#99f6e4"/>
        <rect x="102" y="64" width="8" height="42" rx="2" fill="#99f6e4"/>
        <!-- Mobile SIM badge -->
        <rect x="94" y="80" width="36" height="48" rx="6" fill="#0f172a" stroke="#fbbf24" stroke-width="2.5"/>
        <rect x="100" y="88" width="12" height="14" rx="2" fill="#fbbf24"/>
        <circle cx="112" cy="116" r="3" fill="#38bdf8"/>
      `
    },
    1: {
      bg1: '#78350f', bg2: '#b45309', accent: '#fde68a', text: 'SMALL FD',
      glyph: `
        <!-- Gullak (Savings Pot) with gold coins -->
        <ellipse cx="80" cy="132" rx="44" ry="10" fill="#451a03" opacity="0.4"/>
        <path d="M48 108 C40 85 52 56 80 56 C108 56 120 85 112 108 C108 122 52 122 48 108 Z" fill="#d97706" stroke="#fef3c7" stroke-width="2.5"/>
        <path d="M62 56 C62 48 70 42 80 42 C90 42 98 48 98 56 Z" fill="#b45309" stroke="#fef3c7" stroke-width="2"/>
        <!-- Coin Slot & Gold Coins -->
        <rect x="68" y="50" width="24" height="4" rx="2" fill="#451a03"/>
        <circle cx="80" cy="30" r="14" fill="#fbbf24" stroke="#fef08a" stroke-width="2"/>
        <text x="80" y="36" font-size="14" font-weight="900" fill="#78350f" text-anchor="middle">₹</text>
        <!-- Lock badge representing FD guarantee -->
        <circle cx="80" cy="88" r="14" fill="#047857" stroke="#6ee7b7" stroke-width="2"/>
        <rect x="74" y="86" width="12" height="10" rx="2" fill="#fef08a"/>
        <path d="M76 86 V82 C76 79 84 79 84 82 V86" fill="none" stroke="#fef08a" stroke-width="2"/>
      `
    },
    2: {
      bg1: '#1e3a8a', bg2: '#2563eb', accent: '#60a5fa', text: 'SECURED CARD',
      glyph: `
        <!-- High-status Secured Credit Card (Accent Rung) -->
        <g transform="rotate(-6 80 80)">
          <rect x="22" y="44" width="116" height="74" rx="12" fill="url(#cardGrad)" stroke="#fde047" stroke-width="2.5" filter="url(#glow)"/>
          <line x1="22" y1="62" x2="138" y2="62" stroke="#0f172a" stroke-width="12"/>
          <!-- EMV Chip -->
          <rect x="36" y="80" width="18" height="14" rx="3" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
          <line x1="45" y1="80" x2="45" y2="94" stroke="#ca8a04" stroke-width="1"/>
          <!-- Sparkles & Start Flag -->
          <circle cx="118" cy="92" r="10" fill="#f43f5e" opacity="0.9"/>
          <circle cx="106" cy="92" r="10" fill="#f59e0b" opacity="0.9"/>
        </g>
        <polygon points="134,26 138,36 148,38 140,46 142,56 134,50 126,56 128,46 120,38 130,36" fill="#fbbf24"/>
      `
    },
    3: {
      bg1: '#312e81', bg2: '#4338ca', accent: '#a5b4fc', text: 'SMALL BILL',
      glyph: `
        <!-- Phone & Electricity Bill with On-Time Paid Stamp -->
        <rect x="38" y="32" width="84" height="102" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="50" y1="48" x2="90" y2="48" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="60" x2="110" y2="60" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="72" x2="80" y2="72" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <!-- Bolt icon for Electricity/Mobile -->
        <path d="M96 74 L86 92 L94 92 L90 108 L104 88 L96 88 Z" fill="#eab308"/>
        <!-- PAID IN FULL Stamp -->
        <rect x="46" y="86" width="58" height="24" rx="4" fill="#059669" transform="rotate(-8 75 98)"/>
        <text x="75" y="102" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" transform="rotate(-8 75 98)">PAID 100%</text>
      `
    },
    4: {
      bg1: '#064e3b', bg2: '#047857', accent: '#a7f3d0', text: 'WAIT 6 MOS',
      glyph: `
        <!-- Score Tree cross-section rings with calendar clock -->
        <circle cx="80" cy="74" r="42" fill="#14532d" stroke="#86efac" stroke-width="2"/>
        <circle cx="80" cy="74" r="34" fill="#166534" stroke="#bbf7d0" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="80" cy="74" r="26" fill="#15803d" stroke="#86efac" stroke-width="2"/>
        <circle cx="80" cy="74" r="18" fill="#16a34a" stroke="#bbf7d0" stroke-width="2"/>
        <circle cx="80" cy="74" r="10" fill="#22c55e"/>
        <text x="80" y="79" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">6M</text>
        <!-- Sprouting Leaves -->
        <path d="M80 32 C72 20 60 26 64 36 C68 42 78 40 80 32 Z" fill="#4ade80"/>
        <path d="M80 32 C88 20 100 26 96 36 C92 42 82 40 80 32 Z" fill="#86efac"/>
      `
    },
    5: {
      bg1: '#4c1d95', bg2: '#6d28d9', accent: '#ddd6fe', text: 'GRADUATE',
      glyph: `
        <!-- Official Bureau Report with Graduation Cap and Laurels -->
        <rect x="36" y="44" width="88" height="90" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="80" cy="80" r="22" fill="#7c3aed" stroke="#c4b5fd" stroke-width="2"/>
        <text x="80" y="85" font-size="12" font-weight="900" fill="#fef08a" text-anchor="middle">750+</text>
        <line x1="52" y1="112" x2="108" y2="112" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
        <!-- Mortarboard (Graduation Cap) -->
        <polygon points="80,18 120,34 80,48 40,34" fill="#1e1b4b" stroke="#facc15" stroke-width="2"/>
        <rect x="70" y="44" width="20" height="10" rx="2" fill="#312e81"/>
        <path d="M112 36 L118 56" stroke="#facc15" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="118" cy="58" r="3" fill="#facc15"/>
      `
    }
  };
  const c = configs[n] || configs[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.bg1}"/>
        <stop offset="100%" stop-color="${c.bg2}"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e40af"/>
        <stop offset="50%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="160" height="160" rx="32" fill="url(#bgGrad)"/>
    <!-- Subtle top ambient light -->
    <ellipse cx="80" cy="18" rx="60" ry="24" fill="#ffffff" opacity="0.12"/>
    ${c.glyph}
    <!-- Badge Pill at Bottom -->
    <rect x="24" y="126" width="112" height="24" rx="12" fill="#0f172a" opacity="0.85"/>
    <text x="80" y="142" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" letter-spacing="1" fill="${c.accent}" text-anchor="middle">RUNG ${n} · ${c.text}</text>
  </svg>`;
}

function badgeArt(id) {
  const configs = {
    first_step: {
      bg1: '#065f46', bg2: '#047857', rim: '#34d399', label: 'FIRST STEP',
      icon: `
        <circle cx="80" cy="74" r="38" fill="#042f2e" stroke="#6ee7b7" stroke-width="2.5"/>
        <polygon points="80,44 88,62 108,64 92,78 97,98 80,88 63,98 68,78 52,64 72,62" fill="#fbbf24" stroke="#fef08a" stroke-width="1.5"/>
        <circle cx="80" cy="72" r="8" fill="#ffffff"/>
      `
    },
    basket_boss: {
      bg1: '#92400e', bg2: '#b45309', rim: '#fde68a', label: 'BASKET BOSS',
      icon: `
        <!-- Woven Basket overflowing with healthy needs -->
        <circle cx="80" cy="74" r="38" fill="#451a03" stroke="#fcd34d" stroke-width="2.5"/>
        <path d="M54 78 L60 98 C62 102 98 102 100 98 L106 78 Z" fill="#d97706" stroke="#fef3c7" stroke-width="2"/>
        <line x1="64" y1="78" x2="68" y2="98" stroke="#78350f" stroke-width="2"/>
        <line x1="80" y1="78" x2="80" y2="100" stroke="#78350f" stroke-width="2"/>
        <line x1="96" y1="78" x2="92" y2="98" stroke="#78350f" stroke-width="2"/>
        <circle cx="68" cy="68" r="8" fill="#22c55e"/>
        <circle cx="82" cy="62" r="10" fill="#f59e0b"/>
        <circle cx="94" cy="68" r="7" fill="#ef4444"/>
      `
    },
    trap_spotter: {
      bg1: '#991b1b', bg2: '#b91c1c', rim: '#fca5a5', label: 'TRAP SPOTTER',
      icon: `
        <!-- Defended Shield with Eagle Eye -->
        <circle cx="80" cy="74" r="38" fill="#450a0a" stroke="#f87171" stroke-width="2.5"/>
        <path d="M80 44 L102 54 V74 C102 88 80 100 80 100 C80 100 58 88 58 74 V54 Z" fill="#dc2626" stroke="#fef2f2" stroke-width="2"/>
        <ellipse cx="80" cy="72" rx="14" ry="8" fill="#ffffff"/>
        <circle cx="80" cy="72" r="5" fill="#1e1b4b"/>
      `
    },
    detective: {
      bg1: '#1e3a8a', bg2: '#1d4ed8', rim: '#93c5fd', label: 'DOC DETECTIVE',
      icon: `
        <!-- Magnifying glass on secure dossier -->
        <circle cx="80" cy="74" r="38" fill="#0f172a" stroke="#60a5fa" stroke-width="2.5"/>
        <rect x="58" y="52" width="34" height="42" rx="4" fill="#f8fafc"/>
        <line x1="64" y1="60" x2="84" y2="60" stroke="#059669" stroke-width="3"/>
        <line x1="64" y1="68" x2="80" y2="68" stroke="#94a3b8" stroke-width="2"/>
        <!-- Magnifier lens -->
        <circle cx="86" cy="72" r="16" fill="none" stroke="#facc15" stroke-width="4"/>
        <line x1="98" y1="84" x2="110" y2="96" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
      `
    },
    full_tree: {
      bg1: '#064e3b', bg2: '#047857', rim: '#6ee7b7', label: 'SIX RINGS',
      icon: `
        <!-- Thriving blooming tree with 6 rings -->
        <circle cx="80" cy="74" r="38" fill="#022c22" stroke="#34d399" stroke-width="2.5"/>
        <circle cx="80" cy="74" r="28" fill="none" stroke="#a7f3d0" stroke-width="2" stroke-dasharray="3 2"/>
        <circle cx="80" cy="74" r="20" fill="none" stroke="#6ee7b7" stroke-width="2"/>
        <circle cx="80" cy="74" r="12" fill="none" stroke="#34d399" stroke-width="2"/>
        <circle cx="80" cy="74" r="6" fill="#fef08a"/>
        <!-- Crown foliage -->
        <path d="M80 40 C70 40 64 48 68 56 C60 60 62 72 70 72 C70 76 90 76 90 72 C98 72 100 60 92 56 C96 48 90 40 80 40 Z" fill="#10b981" opacity="0.9"/>
      `
    },
    story_sharp: {
      bg1: '#3730a3', bg2: '#4f46e5', rim: '#c7d2fe', label: 'STORY SHARP',
      icon: `
        <!-- Open wisdom book with illuminating flame -->
        <circle cx="80" cy="74" r="38" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
        <path d="M56 86 C64 82 74 82 80 84 C86 82 96 82 104 86 V62 C96 58 86 58 80 60 C74 58 64 58 56 62 Z" fill="#f8fafc" stroke="#c7d2fe" stroke-width="2"/>
        <path d="M80 60 V84" stroke="#4f46e5" stroke-width="2"/>
        <!-- Flame of smart choices -->
        <path d="M80 42 C74 48 76 54 80 56 C84 54 86 48 80 42 Z" fill="#f59e0b"/>
      `
    }
  };

  if (id.startsWith('rung_')) {
    const num = id.slice(5);
    return rungArt(Number(num));
  }

  const c = configs[id] || configs.first_step;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="bgGrad_${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.bg1}"/>
        <stop offset="100%" stop-color="${c.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="160" height="160" rx="32" fill="url(#bgGrad_${id})"/>
    <ellipse cx="80" cy="20" rx="50" ry="20" fill="#ffffff" opacity="0.14"/>
    ${c.icon}
    <!-- Badge Name Ribbon -->
    <rect x="20" y="124" width="120" height="24" rx="12" fill="#0f172a" opacity="0.9"/>
    <text x="80" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="900" letter-spacing="1" fill="${c.rim}" text-anchor="middle">${c.label}</text>
  </svg>`;
}

function lessonArt(id, tag) {
  const configs = {
    L1: {
      bg1: '#047857', bg2: '#0f766e', title: 'WHERE MONEY GOES',
      svg: `
        <!-- Bucket with coins and stream -->
        <path d="M52 50 L58 106 C60 114 100 114 102 106 L108 50 Z" fill="#0f766e" stroke="#5eead4" stroke-width="2.5"/>
        <ellipse cx="80" cy="50" rx="28" ry="8" fill="#14b8a6" stroke="#5eead4" stroke-width="2"/>
        <!-- Golden drops / coins flowing -->
        <circle cx="80" cy="30" r="10" fill="#fbbf24" stroke="#fef08a" stroke-width="1.5"/>
        <text x="80" y="34" font-size="11" font-weight="900" fill="#78350f" text-anchor="middle">₹</text>
        <circle cx="68" cy="78" r="4" fill="#38bdf8"/>
        <circle cx="88" cy="88" r="4" fill="#38bdf8"/>
      `
    },
    L2: {
      bg1: '#b45309', bg2: '#d97706', title: 'NEEDS &amp; WANTS',
      svg: `
        <!-- Balance Scale with Gullak & Grocery -->
        <line x1="80" y1="40" x2="80" y2="108" stroke="#fef3c7" stroke-width="4" stroke-linecap="round"/>
        <line x1="46" y1="58" x2="114" y2="58" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/>
        <!-- Left Pan: Needs (Grains/Pot) -->
        <path d="M38 78 C38 90 62 90 62 78 Z" fill="#15803d" stroke="#86efac" stroke-width="2"/>
        <line x1="46" y1="58" x2="40" y2="78" stroke="#fef3c7" stroke-width="1.5"/>
        <line x1="46" y1="58" x2="60" y2="78" stroke="#fef3c7" stroke-width="1.5"/>
        <!-- Right Pan: Wants -->
        <path d="M98 78 C98 90 122 90 122 78 Z" fill="#b91c1c" stroke="#fca5a5" stroke-width="2"/>
        <line x1="114" y1="58" x2="100" y2="78" stroke="#fef3c7" stroke-width="1.5"/>
        <line x1="114" y1="58" x2="120" y2="78" stroke="#fef3c7" stroke-width="1.5"/>
        <circle cx="50" cy="72" r="6" fill="#facc15"/>
      `
    },
    L3: {
      bg1: '#0369a1', bg2: '#0284c7', title: 'HER OWN ACCOUNT',
      svg: `
        <!-- Bank Passbook with Woman's Identity -->
        <rect x="36" y="44" width="88" height="66" rx="8" fill="#f8fafc" stroke="#bae6fd" stroke-width="2.5"/>
        <rect x="36" y="44" width="22" height="66" rx="4" fill="#0284c7"/>
        <circle cx="76" cy="64" r="10" fill="#38bdf8"/>
        <line x1="92" y1="60" x2="114" y2="60" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <line x1="92" y1="68" x2="108" y2="68" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
        <!-- Mobile with secure bank notification -->
        <rect x="94" y="74" width="32" height="46" rx="6" fill="#0f172a" stroke="#facc15" stroke-width="2"/>
        <rect x="100" y="82" width="20" height="12" rx="2" fill="#22c55e"/>
      `
    },
    L4: {
      bg1: '#1e40af', bg2: '#3b82f6', title: 'FD-BACKED CARD',
      svg: `
        <!-- Fixed Deposit Certificate backing Card -->
        <rect x="34" y="38" width="70" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
        <text x="69" y="66" font-size="12" font-weight="900" fill="#b45309" text-anchor="middle">FD ₹5,000</text>
        <!-- Card extending in front -->
        <g transform="rotate(-5 90 90)">
          <rect x="46" y="66" width="82" height="52" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
          <rect x="56" y="88" width="14" height="10" rx="2" fill="#fbbf24"/>
          <circle cx="112" cy="94" r="8" fill="#ef4444" opacity="0.8"/>
          <circle cx="104" cy="94" r="8" fill="#f59e0b" opacity="0.8"/>
        </g>
      `
    },
    L5: {
      bg1: '#047857', bg2: '#10b981', title: 'ON-TIME EVERY MONTH',
      svg: `
        <!-- Calendar showing on-time months + growing seedling -->
        <rect x="40" y="36" width="80" height="76" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="40" y="36" width="80" height="20" rx="4" fill="#059669"/>
        <circle cx="58" cy="46" r="3" fill="#ffffff"/>
        <circle cx="102" cy="46" r="3" fill="#ffffff"/>
        <!-- Month checkmarks -->
        <circle cx="56" cy="72" r="8" fill="#dcfce7"/>
        <path d="M52 72 L55 75 L61 68" stroke="#16a34a" stroke-width="2" fill="none"/>
        <circle cx="80" cy="72" r="8" fill="#dcfce7"/>
        <path d="M76 72 L79 75 L85 68" stroke="#16a34a" stroke-width="2" fill="none"/>
        <circle cx="104" cy="72" r="8" fill="#dcfce7"/>
        <path d="M100 72 L103 75 L109 68" stroke="#16a34a" stroke-width="2" fill="none"/>
        <!-- Sprout -->
        <path d="M80 106 V88 C74 88 72 82 76 80 C80 82 82 86 80 88" stroke="#15803d" stroke-width="2.5" fill="none"/>
      `
    },
    L6: {
      bg1: '#4338ca', bg2: '#6366f1', title: 'YOUR PAPERS ARE YOURS',
      svg: `
        <!-- Identity Document protected by Gold Lock & Eye -->
        <rect x="36" y="44" width="88" height="66" rx="8" fill="#f8fafc" stroke="#c7d2fe" stroke-width="2.5"/>
        <rect x="46" y="56" width="24" height="28" rx="4" fill="#818cf8"/>
        <line x1="78" y1="62" x2="112" y2="62" stroke="#4338ca" stroke-width="3"/>
        <line x1="78" y1="72" x2="104" y2="72" stroke="#94a3b8" stroke-width="2"/>
        <!-- Impenetrable Gold Shield Lock -->
        <circle cx="80" cy="100" r="18" fill="#f59e0b" stroke="#fef08a" stroke-width="2.5"/>
        <rect x="74" y="98" width="12" height="10" rx="2" fill="#78350f"/>
        <path d="M76 98 V93 C76 90 84 90 84 93 V98" fill="none" stroke="#78350f" stroke-width="2"/>
      `
    }
  };

  const c = configs[id] || configs.L1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="bgGrad_${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.bg1}"/>
        <stop offset="100%" stop-color="${c.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="160" height="160" rx="32" fill="url(#bgGrad_${id})"/>
    <ellipse cx="80" cy="20" rx="55" ry="22" fill="#ffffff" opacity="0.12"/>
    ${c.svg}
    <rect x="18" y="126" width="124" height="22" rx="11" fill="#0f172a" opacity="0.85"/>
    <text x="80" y="141" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="900" letter-spacing="0.8" fill="#e2e8f0" text-anchor="middle">${c.title}</text>
  </svg>`;
}

export function assetList() {
  const out = [];
  for (const id of Object.keys(BADGES)) {
    out.push({ kind: 'badges', name: id, body: badgeArt(id) });
  }
  for (const r of rungs) {
    out.push({ kind: 'rungs', name: `rung_${r.n}`, body: rungArt(r.n) });
  }
  for (const l of lessons) {
    out.push({ kind: 'lessons', name: l.id, body: lessonArt(l.id, l.tag) });
  }
  return out;
}

export async function seedImages({ overwrite = false } = {}) {
  const store = getStore();
  let n = 0;
  for (const a of assetList()) {
    const r = await store.upload(Buffer.from(a.body), {
      publicId: paths.imageId(a.kind, a.name),
      resourceType: 'image',
      format: 'svg',
      tags: ['app-art', a.kind],
      overwrite,
    });
    if (!r.existing) n++;
  }
  return n;
}

