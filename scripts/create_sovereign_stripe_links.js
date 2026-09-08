const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error("❌ STRIPE_SECRET_KEY missing in Ebook-Landing/.env");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY);

const books = [
  {
    id: "habit-system-90-days",
    title: "The 90-Day Habit System",
    description: "Build lasting habits in 90 days using micro-commitments, if-then plans, and the Never Zero Twice rule. Includes printable 90-day tracker.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_90_Day_Habit_System.epub",
    image: "./images/cover_habit_system.jpg",
    category: "Productivity & Habits",
    rating: "4.9",
    reviews: 189
  },
  {
    id: "cognitive-citadel",
    title: "Cognitive Citadel: The Sovereign Architect of Mind",
    description: "A master framework for mental clarity, deep work, and antifragile thought in an age of infinite distraction. Master your attention economy.",
    price: 14.99,
    unitAmount: 1499,
    downloadFile: "Cognitive_Citadel.epub",
    image: "./images/cover_cognitive_citadel.jpg",
    category: "Mindset & Leadership",
    rating: "5.0",
    reviews: 214
  },
  {
    id: "longevity-protocol",
    title: "The Longevity Protocol",
    description: "The daily food & glucose tracking journal for CGM users to optimize metabolic flexibility, identify sugar spikes, and map healthspan trends.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_Longevity_Protocol.epub",
    image: "./images/cover_longevity.jpg",
    category: "Biohacking & Health",
    rating: "4.9",
    reviews: 167
  },
  {
    id: "hybrid-performance-log",
    title: "The Hybrid Performance Log",
    description: "The biometric & training companion for WHOOP, Oura, and Apple Watch users to map strain, sleep, and HRV to peak physical performance.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_Hybrid_Performance_Log.epub",
    image: "./images/cover_hybrid.jpg",
    category: "Biohacking & Health",
    rating: "4.9",
    reviews: 145
  },
  {
    id: "vagus-nerve-log",
    title: "The Vagus Nerve Stimulation Log",
    description: "The daily tracking companion for Pulsetto, Truvaga, and VNS device users to optimize HRV, calm anxiety, and balance the autonomic nervous system.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_Vagus_Nerve_Log.epub",
    image: "./images/cover_vagus.jpg",
    category: "Biohacking & Health",
    rating: "4.8",
    reviews: 128
  },
  {
    id: "adhd-executive-planner",
    title: "The ADHD Daily Executive Function Planner",
    description: "A low-friction daily action journal to overcome task paralysis, regulate dopamine, and build momentum designed for the neurodivergent brain.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_ADHD_Planner.epub",
    image: "./images/cover_adhd.jpg",
    category: "Productivity & Habits",
    rating: "5.0",
    reviews: 256
  },
  {
    id: "dopamine-reset-protocol",
    title: "The Dopamine Reset Protocol",
    description: "A 30-day guided detox to reclaim focus, break digital addiction, and restore natural drive and motivation.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_Dopamine_Reset.epub",
    image: "./images/cover_dopamine.jpg",
    category: "Mindset & Leadership",
    rating: "4.9",
    reviews: 178
  },
  {
    id: "stoic-resilience-logbook",
    title: "The Stoic Resilience Logbook",
    description: "Daily exercises in emotional control, the dichotomy of control, and antifragile fortitude rooted in Marcus Aurelius and Seneca.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "The_Stoic_Resilience_Logbook.epub",
    image: "./images/cover_stoic.jpg",
    category: "Mindset & Leadership",
    rating: "4.9",
    reviews: 192
  },
  {
    id: "mcjp-restart-28-days",
    title: "MCJP Restart: 28 Days to Stable",
    description: "A tough-love reset for people rebuilding after failure. Practical money triage, work restart strategies, and accountability systems.",
    price: 9.99,
    unitAmount: 999,
    downloadFile: "MCJP_Restart_28_Days.epub",
    image: "./images/cover_mcjp_restart.jpg",
    category: "Productivity & Habits",
    rating: "4.9",
    reviews: 310
  },
  {
    id: "sovereign-mind-vault",
    title: "The Sovereign Mind: 9-Book Executive Mastery Vault",
    description: "The complete 9-volume executive collection. Includes both reflowable EPUB 3.0 and high-res print PDFs for all 9 flagship books + bonus trackers.",
    price: 69.00,
    unitAmount: 6900,
    downloadFile: "Cognitive_Citadel.epub",
    image: "./images/cover_sovereign_vault.svg",
    category: "Executive Bundles",
    rating: "5.0",
    reviews: 480
  }
];

async function main() {
  console.log("💳 Creating Dedicated Stripe Products & Payment Links for Sovereign Books...\n");

  const results = [];

  for (const b of books) {
    try {
      console.log(`⏳ Setting up: ${b.title} ($${b.price} USD)...`);
      
      // Create Stripe Product
      const product = await stripe.products.create({
        name: b.title,
        description: b.description,
      });

      // Create Exact Price in USD
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: b.unitAmount,
        currency: 'usd',
      });

      // Destination download redirect URL upon completed checkout
      const redirectUrl = `https://tbpoyl.vercel.app/downloads/${b.downloadFile}`;

      // Create Payment Link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: { url: redirectUrl }
        }
      });

      console.log(`   ✅ Payment Link: ${paymentLink.url} (Charges $${(b.unitAmount / 100).toFixed(2)} USD)`);
      
      results.push({
        id: b.id,
        title: b.title,
        description: b.description,
        price: b.price,
        paymentUrl: paymentLink.url,
        downloadUrl: `./downloads/${b.downloadFile}`,
        image: b.image,
        category: b.category,
        rating: b.rating,
        reviews: b.reviews
      });
    } catch (err) {
      console.error(`   ❌ Failed for ${b.title}: ${err.message}`);
      throw err;
    }
  }

  // Save map to JSON file
  const mapPath = path.join(__dirname, 'sovereign_stripe_links.json');
  fs.writeFileSync(mapPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n💾 Saved payment links mapping to ${mapPath}`);

  // Now update sync_kdp_books.js
  updateSyncKdpScript(results);
}

function updateSyncKdpScript(bookList) {
  const syncScriptPath = path.join(__dirname, 'sync_kdp_books.js');
  let content = fs.readFileSync(syncScriptPath, 'utf8');

  // Replace kdpBooks definition
  const jsonString = JSON.stringify(bookList, null, 2);
  const regex = /const kdpBooks = \[[\s\S]*?\n\];/;
  content = content.replace(regex, `const kdpBooks = ${jsonString};`);

  fs.writeFileSync(syncScriptPath, content, 'utf8');
  console.log('✅ Updated sync_kdp_books.js with dedicated Stripe links.');
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
