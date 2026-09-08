const fs = require('fs');
const path = require('path');

const KDP_PIPELINE = path.resolve('c:/Antigravity/kdp_pipeline');
const LANDING_SRC = path.resolve('c:/Antigravity/Ebook-Landing/src');
const IMAGES_DIR = path.join(LANDING_SRC, 'images');
const PRODUCTS_JSON = path.join(LANDING_SRC, 'products.json');

const kdpBooks = [
  {
    "id": "habit-system-90-days",
    "title": "The 90-Day Habit System",
    "description": "Build lasting habits in 90 days using micro-commitments, if-then plans, and the Never Zero Twice rule. Includes printable 90-day tracker.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/14AaEQ4tC22OemF5ID0Ny2U",
    "downloadUrl": "./downloads/The_90_Day_Habit_System.epub",
    "image": "./images/cover_habit_system.jpg",
    "category": "Productivity & Habits",
    "rating": "4.9",
    "reviews": 189
  },
  {
    "id": "cognitive-citadel",
    "title": "Cognitive Citadel: The Sovereign Architect of Mind",
    "description": "A master framework for mental clarity, deep work, and antifragile thought in an age of infinite distraction. Master your attention economy.",
    "price": 14.99,
    "paymentUrl": "https://buy.stripe.com/8x23cof8g36Scexc710Ny2V",
    "downloadUrl": "./downloads/Cognitive_Citadel.epub",
    "image": "./images/cover_cognitive_citadel.jpg",
    "category": "Mindset & Leadership",
    "rating": "5.0",
    "reviews": 214
  },
  {
    "id": "longevity-protocol",
    "title": "The Longevity Protocol",
    "description": "The daily food & glucose tracking journal for CGM users to optimize metabolic flexibility, identify sugar spikes, and map healthspan trends.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/7sYeV6bW4azk2DXgnh0Ny2W",
    "downloadUrl": "./downloads/The_Longevity_Protocol.epub",
    "image": "./images/cover_longevity.jpg",
    "category": "Biohacking & Health",
    "rating": "4.9",
    "reviews": 167
  },
  {
    "id": "hybrid-performance-log",
    "title": "The Hybrid Performance Log",
    "description": "The biometric & training companion for WHOOP, Oura, and Apple Watch users to map strain, sleep, and HRV to peak physical performance.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/28E3co0dmdLw4M5fjd0Ny2X",
    "downloadUrl": "./downloads/The_Hybrid_Performance_Log.epub",
    "image": "./images/cover_hybrid.jpg",
    "category": "Biohacking & Health",
    "rating": "4.9",
    "reviews": 145
  },
  {
    "id": "vagus-nerve-log",
    "title": "The Vagus Nerve Stimulation Log",
    "description": "The daily tracking companion for Pulsetto, Truvaga, and VNS device users to optimize HRV, calm anxiety, and balance the autonomic nervous system.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/dRm8wI7FOfTEcex7QL0Ny2Y",
    "downloadUrl": "./downloads/The_Vagus_Nerve_Log.epub",
    "image": "./images/cover_vagus.jpg",
    "category": "Biohacking & Health",
    "rating": "4.8",
    "reviews": 128
  },
  {
    "id": "adhd-executive-planner",
    "title": "The ADHD Daily Executive Function Planner",
    "description": "A low-friction daily action journal to overcome task paralysis, regulate dopamine, and build momentum designed for the neurodivergent brain.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/cNi00c2lu7n81zTb2X0Ny2Z",
    "downloadUrl": "./downloads/The_ADHD_Planner.epub",
    "image": "./images/cover_adhd.jpg",
    "category": "Productivity & Habits",
    "rating": "5.0",
    "reviews": 256
  },
  {
    "id": "dopamine-reset-protocol",
    "title": "The Dopamine Reset Protocol",
    "description": "A 30-day guided detox to reclaim focus, break digital addiction, and restore natural drive and motivation.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/cNifZa5xGdLwfqJ5ID0Ny30",
    "downloadUrl": "./downloads/The_Dopamine_Reset.epub",
    "image": "./images/cover_dopamine.jpg",
    "category": "Mindset & Leadership",
    "rating": "4.9",
    "reviews": 178
  },
  {
    "id": "stoic-resilience-logbook",
    "title": "The Stoic Resilience Logbook",
    "description": "Daily exercises in emotional control, the dichotomy of control, and antifragile fortitude rooted in Marcus Aurelius and Seneca.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/eVqbIU6BKcHs3I11sn0Ny31",
    "downloadUrl": "./downloads/The_Stoic_Resilience_Logbook.epub",
    "image": "./images/cover_stoic.jpg",
    "category": "Mindset & Leadership",
    "rating": "4.9",
    "reviews": 192
  },
  {
    "id": "mcjp-restart-28-days",
    "title": "MCJP Restart: 28 Days to Stable",
    "description": "A tough-love reset for people rebuilding after failure. Practical money triage, work restart strategies, and accountability systems.",
    "price": 9.99,
    "paymentUrl": "https://buy.stripe.com/6oU14g3pycHsdiB5ID0Ny32",
    "downloadUrl": "./downloads/MCJP_Restart_28_Days.epub",
    "image": "./images/cover_mcjp_restart.jpg",
    "category": "Productivity & Habits",
    "rating": "4.9",
    "reviews": 310
  },
  {
    "id": "sovereign-mind-vault",
    "title": "The Sovereign Mind: 9-Book Executive Mastery Vault",
    "description": "The complete 9-volume executive collection. Includes both reflowable EPUB 3.0 and high-res print PDFs for all 9 flagship books + bonus trackers.",
    "price": 69,
    "paymentUrl": "https://buy.stripe.com/9B6dR26BKfTE0vP8UP0Ny33",
    "downloadUrl": "./downloads/Cognitive_Citadel.epub",
    "image": "./images/cover_sovereign_vault.svg",
    "category": "Executive Bundles",
    "rating": "5.0",
    "reviews": 480
  }
];

// Generate Vault SVG cover if not present
const vaultSvgPath = path.join(IMAGES_DIR, 'cover_sovereign_vault.svg');
const vaultSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
  <defs>
    <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#4c1d95" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="vaultShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="15" dy="25" stdDeviation="20" flood-color="#000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <rect width="500" height="650" fill="#07090e" rx="16"/>

  <g filter="url(#vaultShadow)">
    <rect x="50" y="40" width="400" height="560" rx="14" fill="url(#vaultGrad)" stroke="rgba(245,158,11,0.4)" stroke-width="2"/>
    <circle cx="250" cy="210" r="130" fill="none" stroke="rgba(245,158,11,0.15)" stroke-width="1.5" stroke-dasharray="6 6"/>
    <circle cx="250" cy="210" r="85" fill="none" stroke="rgba(245,158,11,0.25)" stroke-width="1.5"/>

    <rect x="50" y="40" width="32" height="560" fill="rgba(0,0,0,0.5)"/>
    <line x1="82" y1="40" x2="82" y2="600" stroke="rgba(245,158,11,0.3)" stroke-width="1.5"/>

    <rect x="130" y="70" width="240" height="32" rx="16" fill="rgba(0,0,0,0.5)" stroke="rgba(245,158,11,0.5)" stroke-width="1"/>
    <text x="250" y="91" fill="#fbbf24" font-size="11" font-family="'Outfit', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="2">COMPLETE 9-BOOK COLLECTION</text>

    <circle cx="250" cy="210" r="48" fill="rgba(0,0,0,0.4)" stroke="#fbbf24" stroke-width="2"/>
    <text x="250" y="225" font-size="40" text-anchor="middle">👑</text>

    <text x="250" y="325" fill="#FFFFFF" font-size="24" font-family="'Outfit', sans-serif" font-weight="900" text-anchor="middle">
      The Sovereign Mind
    </text>
    <text x="250" y="355" fill="url(#goldGrad)" font-size="17" font-family="'Outfit', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">
      9-BOOK EXECUTIVE VAULT
    </text>
    
    <text x="250" y="395" fill="rgba(255,255,255,0.85)" font-size="13" font-family="'Inter', sans-serif" font-weight="500" text-anchor="middle">
      Cognitive Citadel • 90-Day Habits • Longevity
    </text>
    <text x="250" y="420" fill="rgba(255,255,255,0.7)" font-size="12" font-family="'Inter', sans-serif" font-weight="400" text-anchor="middle">
      Hybrid Log • Vagus • ADHD • Dopamine • Stoic • Restart
    </text>

    <line x1="120" y1="455" x2="380" y2="455" stroke="url(#goldGrad)" stroke-width="2" stroke-linecap="round"/>

    <text x="250" y="525" fill="rgba(255,255,255,0.6)" font-size="11" font-family="'Inter', sans-serif" text-anchor="middle" letter-spacing="1.5">DUAL FORMAT: EPUB 3.0 + PRINT PDF</text>
    <text x="250" y="555" fill="#fbbf24" font-size="14" font-family="'Outfit', sans-serif" font-weight="800" text-anchor="middle">18 TOTAL DELIVERABLES INCLUDED</text>
  </g>
</svg>`;

fs.writeFileSync(vaultSvgPath, vaultSvgContent, 'utf8');
console.log('Created cover_sovereign_vault.svg');

// Copy cover images
const imageMap = {
  'cover_habit_system.jpg': 'HABIT_SYSTEM_Cover_Final.jpg',
  'cover_cognitive_citadel.jpg': 'COGNITIVE_CITADEL_Cover_Final.jpg',
  'cover_longevity.jpg': 'LONGEVITY_Cover_Final.jpg',
  'cover_hybrid.jpg': 'HYBRID_Cover_Final.jpg',
  'cover_vagus.jpg': 'VAGUS_Cover_Final.jpg',
  'cover_adhd.jpg': 'ADHD_Cover_Final.jpg',
  'cover_dopamine.jpg': 'DOPAMINE_Cover_Final.jpg',
  'cover_stoic.jpg': 'STOIC_Cover_Final.jpg',
  'cover_mcjp_restart.jpg': 'MCJP_RESTART_Cover_Final.jpg'
};

Object.entries(imageMap).forEach(([dest, src]) => {
  const srcPath = path.join(KDP_PIPELINE, src);
  const destPath = path.join(IMAGES_DIR, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied image: ${src} -> ${dest}`);
  }
});

// Load existing AI business books if present
let existing = [];
if (fs.existsSync(PRODUCTS_JSON)) {
  existing = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
}

// Merge without duplicates
const existingNonKdp = existing.filter(e => !kdpBooks.some(kb => kb.id === e.id) && e.category === 'AI Business');
const merged = [...kdpBooks, ...existingNonKdp];

fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(merged, null, 2), 'utf8');
console.log(`\n✅ Updated products.json with ${merged.length} total products (${kdpBooks.length} Sovereign Flagship books).`);

