# Evenstar — Maison of Modern Tailoring

Sebuah website luxury fashion & modern tailoring brand untuk pria dan wanita dewasa, terinspirasi dari arsitektur visual dan pengalaman interaktif **[serotoninn.com](https://serotoninn.com/)** dengan prinsip desain *quiet luxury*, tipografi editorial haute couture, dan animasi scrolling sinematik bebas dari *AI-slop*.

---

## ✨ Fitur Utama

1. **Editorial Preloader & Micro-interactions**
   - Numeric tabular counter (`000` → `100`) dengan garis progres emas/gading.
   - Tirai curtain unmasking via GSAP.
   - Bracket buttons khas maison: `[ Shop Women ]`, `[ Shop Men ]`.
   - Subtle procedural 35mm film grain overlay untuk menghilangkan kesan flat digital.

2. **Hero Expanding Frame ScrollTrigger (Reference: Serotoninn)**
   - Header minimalis dengan mix-blend mode difference yang otomatis tersembunyi saat scroll ke bawah dan muncul saat scroll ke atas.
   - 3-column hero layout menampilkan Womenswear (Camel Wool Coat) dan Menswear (Flannel Suit).
   - Frame tengah di-expand secara dinamis mengikuti scroll user dari slot kartu menjadi **100% full-viewport hero photograph** yang dramatis ("The After Hours — Autumn/Winter 2026").

3. **Haute Couture 3D Interactive Atelier (Three.js)**
   - Showcase 3D interaktif 360° menggunakan Three.js WebGL:
     - **01. Bias Slip Dress** (Women)
     - **02. Double Overcoat** (Men/Unisex)
     - **03. One-Shoulder Gown** (Women Evening)
     - **04. Sculpted Blazer** (Tailoring)
   - Studio lighting: warm key light, cool rim kicker untuk kilau sutra & wol, bounce light lembut, dan mannequin dress-form berdiri di atas travertine marble plinth.
   - **Katalog Kain PBR Interaktif**: Ganti jenis kain secara langsung (*Silk Charmeuse, Duchess Satin, Silk Velvet, Double Cashmere, Wool Flannel, Linen-Silk*) dengan procedural micro-weave bump maps dan data spesifikasi teknis (*reference, fabric origin, weight*).

4. **New Arrivals Product Track (Pria & Wanita)**
   - Horizontal momentum drag & wheel scroll carousel.
   - Filter tab dinamis: `All`, `Women`, `Men`.
   - Quick-add size selector (`XS`, `S`, `M`, `L`, `48`, `50`) dengan feedback toast mewah.
   - Wishlist toggle interaktif dengan live badge counter di navbar.
   - Katalog koleksi pakaian dewasa (IDR pricing).

5. **Cinematic Pinned Campaign Section**
   - Pinning scroll effect dengan split-typography raksasa `After` dan `Hours` yang bergerak keluar ke sudut layar saat gambar kampanye membesar.

6. **Interactive Curtain Menu & Index Hover Floating Image**
   - Fullscreen curtain menu dengan real-time photo preview saat kursor melayang di atas navigasi.
   - Bagian Index (Section 05) memiliki floating image preview yang mengikuti kursor dengan smooth inertia lerp.

7. **Custom Editorial Magnetic Cursor**
   - Cursor dot & ring yang bertransformasi dinamis menampilkan label kurasi `[ VIEW ]`, `[ DRAG ]`, `[ ROTATE ]`, `[ WOMEN ]`, `[ MEN ]`.

---

## 🚀 Menjalankan Project

Proyek ini telah dibangun dan server lokal sedang aktif:

```bash
# Install dependencies
npm install

# Menjalankan Dev Server
npm run dev

# Membangun versi produksi
npm run build

# Menjalankan preview build produksi
npm run preview
```

Server lokal aktif di: **`http://localhost:5174/`**
