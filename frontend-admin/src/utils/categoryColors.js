// src/utils/categoryColors.js

/**
 * Palette used for dynamic category badges.
 * Each entry is [background, text].
 * Keep the first four aligned with the legacy slugs so existing
 * categories keep their familiar colors.
 */
const PALETTE = [
  ['#e3f2fd', '#1565c0'], // blue   — batteries
  ['#f3e5f5', '#7b1fa2'], // purple — lubricants
  ['#e8f5e9', '#2e7d32'], // green  — tires
  ['#fff3e0', '#e65100'], // orange — spareParts
  ['#fce4ec', '#ad1457'], // pink
  ['#e0f7fa', '#00838f'], // cyan
  ['#fffde7', '#f9a825'], // yellow
  ['#ede7f6', '#4527a0'], // indigo
  ['#f1f8e9', '#558b2f'], // lime
  ['#efebe9', '#4e342e'], // brown
  ['#e8eaf6', '#283593'], // deep indigo
  ['#fbe9e7', '#d84315'], // deep orange
];

/** Slug → fixed palette index so colors don't shuffle when the list changes. */
const PINNED = {
  batteries:  0,
  lubricants: 1,
  tires:      2,
  spareParts: 3,
};

/** Stable 32-bit string hash (FNV-1a). */
const hash = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
};

/**
 * Return { background, color } for a category slug.
 * Unknown / empty slugs fall back to a neutral gray.
 */
export const getCategoryColors = (slug) => {
  if (!slug) return { background: '#f0f0f0', color: '#555' };

  const key = String(slug);
  const index = key in PINNED ? PINNED[key] : hash(key) % PALETTE.length;
  const [background, color] = PALETTE[index];
  return { background, color };
};