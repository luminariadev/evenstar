// One-off asset pipeline: converts the generated photography into web-ready WebP.
// Usage: node scripts/process-images.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'C:/Users/majan/.gemini/antigravity/brain/bf6133c6-f7c4-4235-b158-5aa1c088ef7a';
const OUT = 'public/images';
mkdirSync(OUT, { recursive: true });

const jobs = [
  { src: 'hero_woman_1791219776965.jpg', out: 'hero-woman' },
  { src: 'hero_man_1791219791845.jpg', out: 'hero-man' },
  // remove the film-border lettering
  { src: 'hero_couple_1791219802538.jpg', out: 'hero-couple', extract: { left: 18, top: 38, width: 860, height: 1120 } },
  { src: 'w_slip_dress_1791219822423.jpg', out: 'w-slip-dress' },
  // trim the softbox on the right edge
  { src: 'w_tailored_suit_1791219839386.jpg', out: 'w-tailored-suit', extract: { left: 30, top: 0, width: 740, height: 1200 } },
  { src: 'w_oxblood_gown_1791219849176.jpg', out: 'w-oxblood-gown' },
  { src: 'w_knit_set_1791219861421.jpg', out: 'w-knit-set' },
  { src: 'm_overcoat_1791219890987.jpg', out: 'm-overcoat' },
  { src: 'm_knit_polo_1791219902520.jpg', out: 'm-knit-polo' },
  { src: 'm_leather_jacket_1791219917305.jpg', out: 'm-leather-coat' },
  { src: 'm_linen_suit_1791219929516.jpg', out: 'm-linen-suit' },
  { src: 'campaign_night_1791219963829.jpg', out: 'campaign-night' },
  { src: 'craft_tailor_1791219974914.jpg', out: 'craft-tailor' },
];

for (const job of jobs) {
  let img = sharp(join(SRC, job.src));
  if (job.extract) img = img.extract(job.extract);
  const info = await img.webp({ quality: 84, effort: 5 }).toFile(join(OUT, `${job.out}.webp`));
  console.log(`${job.out}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kb`);
}
