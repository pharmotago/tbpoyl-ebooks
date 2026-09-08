const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const publicDir = path.join(__dirname, '..', 'public');

const imagesSrcDir = path.join(srcDir, 'images');
const imagesPublicDir = path.join(publicDir, 'images');

if (!fs.existsSync(imagesSrcDir)) fs.mkdirSync(imagesSrcDir, { recursive: true });
if (!fs.existsSync(imagesPublicDir)) fs.mkdirSync(imagesPublicDir, { recursive: true });

// Read products
const productsPath = path.join(srcDir, 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// 1. Deduplicate by ID
const uniqueMap = new Map();
for (const p of products) {
  if (!uniqueMap.has(p.id)) {
    uniqueMap.set(p.id, p);
  }
}
let cleanProducts = Array.from(uniqueMap.values());

// Category and Theme Definitions
const themeMap = {
  'zero-code-automation-playbook': {
    category: 'Automation & Dev',
    grad1: '#4F46E5', grad2: '#7C3AED', accent: '#06B6D4',
    subtitle: 'Zero-Code Systems', icon: '⚡'
  },
  'scaling-e-commerce-with-ai': {
    category: 'AI Business',
    grad1: '#059669', grad2: '#10B981', accent: '#F59E0B',
    subtitle: 'E-Commerce Growth', icon: '📈'
  },
  'ai-content-creation-mastery': {
    category: 'AI Business',
    grad1: '#D97706', grad2: '#F59E0B', accent: '#EC4899',
    subtitle: 'Viral Content Engines', icon: '🚀'
  },
  'chatgpt-prompts-for-marketers': {
    category: 'Prompt Engineering',
    grad1: '#2563EB', grad2: '#3B82F6', accent: '#10B981',
    subtitle: 'Marketing Prompts', icon: '🎯'
  },
  'python-ai-the-ultimate-guide': {
    category: 'Automation & Dev',
    grad1: '#0284C7', grad2: '#38BDF8', accent: '#F59E0B',
    subtitle: 'Python + LLM Stack', icon: '🐍'
  },
  'ai-in-real-estate': {
    category: 'Niche Solutions',
    grad1: '#7C3AED', grad2: '#A855F7', accent: '#06B6D4',
    subtitle: 'Property & Deal Flow', icon: '🏛️'
  },
  'mastering-midjourney-v6': {
    category: 'Prompt Engineering',
    grad1: '#DB2777', grad2: '#F472B6', accent: '#8B5CF6',
    subtitle: 'Photorealistic Imagery', icon: '🎨'
  },
  'ai-for-lawyers': {
    category: 'Niche Solutions',
    grad1: '#1E293B', grad2: '#334155', accent: '#F59E0B',
    subtitle: 'Legal Workflows & Contracting', icon: '⚖️'
  }
};

function generate3DCoverSVG(title, theme) {
  const t = theme || {
    category: 'AI Business',
    grad1: '#3B82F6', grad2: '#8B5CF6', accent: '#10B981',
    subtitle: 'Master AI Guide', icon: '💎'
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.grad1}" />
      <stop offset="100%" stop-color="${t.grad2}" />
    </linearGradient>
    <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.6)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.1)" />
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="15" dy="25" stdDeviation="20" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="500" height="650" fill="#0b0f19" rx="16"/>

  <!-- 3D Book Spine Effect -->
  <g filter="url(#dropShadow)">
    <!-- Book Body Background -->
    <rect x="50" y="40" width="400" height="560" rx="12" fill="url(#bgGrad)"/>

    <!-- Subtle Tech Patterns -->
    <circle cx="250" cy="220" r="140" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-dasharray="8 8"/>
    <circle cx="250" cy="220" r="90" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>

    <!-- Spine Overlay -->
    <rect x="50" y="40" width="30" height="560" fill="url(#spineGrad)"/>
    <line x1="80" y1="40" x2="80" y2="600" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

    <!-- Top Badge -->
    <rect x="100" y="70" width="130" height="30" rx="15" fill="rgba(0,0,0,0.4)"/>
    <text x="165" y="90" fill="${t.accent}" font-size="11" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1.5">MASTER EDITION</text>

    <!-- Icon Graphic -->
    <circle cx="250" cy="220" r="45" fill="rgba(0,0,0,0.3)" stroke="${t.accent}" stroke-width="2"/>
    <text x="250" y="233" font-size="38" text-anchor="middle">${t.icon}</text>

    <!-- Title & Subtitle -->
    <text x="250" y="340" fill="#FFFFFF" font-size="26" font-family="'Outfit', sans-serif" font-weight="800" text-anchor="middle" width="320">
      ${escapeXml(title)}
    </text>
    
    <text x="250" y="380" fill="rgba(255,255,255,0.85)" font-size="14" font-family="'Inter', sans-serif" font-weight="500" text-anchor="middle" letter-spacing="0.5">
      ${escapeXml(t.subtitle)}
    </text>

    <line x1="150" y1="420" x2="350" y2="420" stroke="${t.accent}" stroke-width="2" stroke-linecap="round"/>

    <!-- Bottom Metadata -->
    <text x="250" y="520" fill="rgba(255,255,255,0.6)" font-size="12" font-family="'Inter', sans-serif" text-anchor="middle" letter-spacing="1">THE AI VAULT • 2026 EDITION</text>
    <text x="250" y="550" fill="#FFFFFF" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">COMPLETE AUTOMATION ARCHITECTURE</text>
  </g>
</svg>`;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// 2. Generate SVG images & Update Products Array
cleanProducts = cleanProducts.map(p => {
  const theme = themeMap[p.id] || {
    category: 'AI Business',
    grad1: '#3B82F6', grad2: '#8B5CF6', accent: '#10B981',
    subtitle: 'Master AI Blueprint', icon: '🤖'
  };

  const svgFilename = `cover_${p.id}.svg`;
  const svgContent = generate3DCoverSVG(p.title, theme);

  fs.writeFileSync(path.join(imagesSrcDir, svgFilename), svgContent);
  fs.writeFileSync(path.join(imagesPublicDir, svgFilename), svgContent);

  return {
    ...p,
    image: `./images/${svgFilename}`,
    category: theme.category,
    rating: (4.8 + (Math.random() * 0.2)).toFixed(1),
    reviews: Math.floor(80 + Math.random() * 120),
  };
});

// Save updated products.json
fs.writeFileSync(path.join(srcDir, 'products.json'), JSON.stringify(cleanProducts, null, 2));
fs.writeFileSync(path.join(publicDir, 'products.json'), JSON.stringify(cleanProducts, null, 2));

console.log(`[Upgrade] Cleaned ${cleanProducts.length} unique products & generated 3D cover SVGs successfully!`);
