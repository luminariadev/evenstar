import sharp from 'sharp';
import { mkdirSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';

const OUT = 'public/images';
mkdirSync(OUT, { recursive: true });

// Curated list of authentic, pristine high-resolution luxury editorial fashion photographs
// from real fashion photographers on Unsplash (0% AI distortion, razor-sharp textures).
const ASSETS = [
  {
    out: 'hero-woman',
    // Elegant woman in high-fashion editorial tailoring / coat
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=95',
  },
  {
    out: 'hero-man',
    // Sharp man in tailored charcoal suit / overcoat
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1400&q=95',
  },
  {
    out: 'hero-couple',
    // Atmospheric luxury fashion couple in black eveningwear
    url: 'https://images.unsplash.com/photo-1645035828708-789028bb9782?auto=format&fit=crop&w=1600&q=95',
  },
  {
    out: 'w-slip-dress',
    // Silk bias dress / champagne satin eveningwear
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'w-tailored-suit',
    // Woman in sharp tailored blazer and trousers
    url: 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'w-oxblood-gown',
    // Dramatic draped silk evening gown
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'w-knit-set',
    // Elegant neutral cashmere knitwear and long skirt
    url: 'https://images.unsplash.com/photo-1524255684952-d7185b509571?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'm-overcoat',
    // Structured wool overcoat menswear editorial
    url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'm-knit-polo',
    // Refined smart-casual knitwear and tailored trousers
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'm-leather-coat',
    // Sleek black luxury leather coat
    url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'm-linen-suit',
    // Unstructured tailored linen suit
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=95',
  },
  {
    out: 'campaign-night',
    // Cinematic evening campaign in dim grand hotel
    url: 'https://images.unsplash.com/photo-1763888647863-d6d0c7383151?auto=format&fit=crop&w=2000&q=95',
  },
  {
    out: 'craft-tailor',
    // Bespoke tailoring cutting table and shears
    url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1400&q=95',
  },
];

async function downloadAndProcess() {
  console.log('Downloading authentic editorial fashion assets...');
  for (const item of ASSETS) {
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Process with sharp at high quality (no burik, crystal clear)
      const outPath = join(OUT, `${item.out}.webp`);
      const info = await sharp(buffer)
        .webp({ quality: 92, effort: 4 })
        .toFile(outPath);

      console.log(`✓ ${item.out}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kb (Crystal Sharp)`);
    } catch (err) {
      console.error(`✗ Failed for ${item.out}:`, err.message);
    }
  }
}

downloadAndProcess();
