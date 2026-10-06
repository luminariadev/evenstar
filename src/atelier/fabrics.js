// Cloth library for the 3D atelier. Values are tuned for MeshPhysicalMaterial:
// `sheen` drives the soft retro-reflection characteristic of woven/knitted cloth,
// `anisotropy` stretches highlights along the warp for satins and silks.
export const FABRICS = {
  silk: {
    name: 'Silk Charmeuse', color: '#cdb38f', swatch: ['#efe0c4', '#b49870'],
    roughness: 0.34, sheen: 0.9, sheenRoughness: 0.28, sheenColor: '#fff1d8',
    anisotropy: 0.75, bump: 0.15, weight: '92 g/m²', origin: 'Como, IT',
  },
  satin: {
    name: 'Duchess Satin', color: '#141313', swatch: ['#4a4846', '#0d0d0d'],
    roughness: 0.3, sheen: 0.55, sheenRoughness: 0.3, sheenColor: '#7a7774',
    anisotropy: 0.65, bump: 0.1, weight: '210 g/m²', origin: 'Garut, ID',
  },
  velvet: {
    name: 'Silk Velvet', color: '#4a0e14', swatch: ['#9b3442', '#3a0a10'],
    roughness: 1, sheen: 1, sheenRoughness: 0.32, sheenColor: '#c4505f',
    anisotropy: 0, bump: 0.25, weight: '280 g/m²', origin: 'Lyon, FR',
  },
  cashmere: {
    name: 'Double Cashmere', color: '#a7825a', swatch: ['#d9b88d', '#8d6943'],
    roughness: 0.92, sheen: 1, sheenRoughness: 0.55, sheenColor: '#ead0a8',
    anisotropy: 0, bump: 0.6, weight: '520 g/m²', origin: 'Biella, IT',
  },
  flannel: {
    name: 'Wool Flannel', color: '#3b3937', swatch: ['#77736e', '#2c2a28'],
    roughness: 0.95, sheen: 0.75, sheenRoughness: 0.7, sheenColor: '#94908a',
    anisotropy: 0, bump: 0.9, weight: '340 g/m²', origin: 'Huddersfield, UK',
  },
  linen: {
    name: 'Linen-Silk', color: '#d4c8b2', swatch: ['#efe7d8', '#b8aa90'],
    roughness: 0.86, sheen: 0.5, sheenRoughness: 0.6, sheenColor: '#ffffff',
    anisotropy: 0, bump: 1.1, weight: '230 g/m²', origin: 'Ulster, IE',
  },
};

export const FABRIC_ORDER = ['silk', 'satin', 'velvet', 'cashmere', 'flannel', 'linen'];
