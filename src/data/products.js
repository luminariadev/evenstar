export const products = [
  { id: 'w01', gender: 'women', name: 'Bias Slip Dress', fabric: 'Silk charmeuse — Como', price: 4850000, img: '/images/w-slip-dress.webp', tag: 'New', sizes: ['XS', 'S', 'M', 'L'], alt: 'Champagne silk bias-cut slip dress' },
  { id: 'm01', gender: 'men', name: 'Double-Faced Overcoat', fabric: 'Cashmere wool — Biella', price: 12400000, img: '/images/m-overcoat.webp', tag: 'New', sizes: ['46', '48', '50', '52', '54'], alt: 'Stone grey double-faced cashmere overcoat' },
  { id: 'w02', gender: 'women', name: 'Column Blazer & Trouser', fabric: 'Wool crêpe — Biella', price: 9600000, img: '/images/w-tailored-suit.webp', tag: 'Tailoring', sizes: ['34', '36', '38', '40'], alt: 'Black wool-crepe blazer and wide-leg trousers' },
  { id: 'm02', gender: 'men', name: 'Lambskin Car Coat', fabric: 'Nappa lambskin', price: 15800000, img: '/images/m-leather-coat.webp', tag: 'Limited', sizes: ['S', 'M', 'L', 'XL'], alt: 'Black lambskin leather car coat' },
  { id: 'w03', gender: 'women', name: 'One-Shoulder Gown', fabric: 'Silk satin — Garut', price: 8900000, img: '/images/w-oxblood-gown.webp', tag: 'Evening', sizes: ['XS', 'S', 'M', 'L'], alt: 'Oxblood one-shoulder satin evening gown' },
  { id: 'm03', gender: 'men', name: 'Knitted Polo & Pleat', fabric: 'Cashmere / wool twill', price: 5750000, img: '/images/m-knit-polo.webp', tag: 'New', sizes: ['S', 'M', 'L', 'XL'], alt: 'Ivory cashmere knitted polo with pleated taupe trousers' },
  { id: 'w04', gender: 'women', name: 'Rib Cardigan & Pleat Skirt', fabric: 'Cashmere — Inner Mongolia', price: 6400000, img: '/images/w-knit-set.webp', tag: 'Knitwear', sizes: ['XS', 'S', 'M', 'L'], alt: 'Oatmeal ribbed cashmere cardigan and ivory pleated skirt' },
  { id: 'm04', gender: 'men', name: 'Unstructured Linen Suit', fabric: 'Linen-silk — Irish mill', price: 8200000, img: '/images/m-linen-suit.webp', tag: 'Tailoring', sizes: ['46', '48', '50', '52'], alt: 'Sand linen-silk unstructured suit' },
];

export const formatIDR = (n) => 'IDR ' + n.toLocaleString('id-ID');
