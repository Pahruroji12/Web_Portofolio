# DESIGN.md - Portfolio Personal dengan Efek Interaktif

Dokumen ini mendefinisikan sistem desain modern, bersih, dan minimalis yang mendukung tema Terang (Light) dan Gelap (Dark), lengkap dengan panduan implementasi efek latar belakang jaringan titik (_Interactive Dot Matrix Grid_).

---

## 1. Skema Warna (Mode Terang & Gelap)

Sistem ini mendukung transisi warna yang kontras untuk kenyamanan mata pengguna tanpa kehilangan estetika minimalisnya.

| Elemen Visual            | Mode Terang (Light)  | Mode Gelap (Dark)       | Penggunaan                       |
| :----------------------- | :------------------- | :---------------------- | :------------------------------- |
| **Latar Belakang Utama** | `#FFFFFF` (Putih)    | `#0B0B0C` (Hitam Pekat) | Background utama aplikasi/canvas |
| **Titik Grid Statis**    | `#E5E7EB` (Abu Muda) | `#1F2226` (Abu Gelap)   | Titik-titik latar belakang       |
| **Titik Efek (Kursor)**  | `#000000` (Hitam)    | `#FFFFFF` (Putih)       | Titik yang membesar dekat kursor |
| **Teks Utama**           | `#111827`            | `#F9FAFB`               | Judul (`h1`, `h2`, `h3`)         |
| **Teks Sekunder**        | `#4B5563`            | `#9CA3AF`               | Paragraf dan deskripsi           |
| **Kartu Konten**         | `#F9FAFB`            | `#14171A`               | Latar belakang komponen kartu    |

---

## 2. Tipografi

Tipografi difokuskan pada keterbacaan tinggi dengan karakter huruf yang tegas dan modern.

- **Font Utama**: `Inter`, `Plus Jakarta Sans`, atau Sans-Serif sistem.
- **Judul (`h1`, `h2`)**: _Bold / Extra Bold_ (600 - 800), spasi antar huruf agak rapat (_letter-spacing: -0.02em_).
- **Teks Tubuh (`p`)**: _Regular_ (400), tinggi baris renggang (_line-height: 1.6_) untuk kenyamanan membaca.

---

## 3. Komponen Kartu Portofolio

Kartu proyek didesain minimalis tanpa border yang tebal, melainkan memanfaatkan perbedaan warna latar belakang yang halus.

- **Radius Sudut (Border Radius)**: `12px` (Memberikan kesan modern dan ramah lingkungan).
- **Efek Hover**: Ketika kursor berada di atas kartu, kartu akan naik sedikit (`translateY(-4px)`) dengan transisi yang halus (`transition: all 0.3s ease`).

---

## 4. Spesifikasi Efek Latar Belakang (Interactive Dot Matrix Grid)

Efek ini meniru halaman utama [DESIGN.md](https://designmd.ai/), di mana titik-titik grid yang sudah ada akan merespons gerakan kursor.

### Logika Implementasi (Aplikasi Frontend):

1.  **Grid Generatif**: Buat sebuah elemen `<canvas>` yang memenuhi seluruh layar (_fixed background_). Gambar titik-titik kecil berdiameter $1.5\text{px}$ dengan jarak antar titik (grid) sebesar $25\text{px} - 30\text{px}$.
2.  **Deteksi Kursor**: Gunakan JavaScript `window.addEventListener('mousemove')` untuk merekam koordinat $X$ dan $Y$ dari kursor pengguna.
3.  **Efek Kedekatan (Proximity Effect)**:
    - Hitung jarak (radius) antara posisi kursor dengan setiap titik di dalam grid.
    - Jika jarak kursor dengan sebuah titik kurang dari $100\text{px}$, titik tersebut harus **membesar** (menjadi diameter $3\text{px} - 4\text{px}$) dan **warnanya berubah menjadi lebih terang/kontras** (Hitam di mode terang, Putih di mode gelap).
4.  **Smoothing**: Gunakan fungsi _linear interpolation_ (Lerp) atau _RequestAnimationFrame_ di JavaScript agar pembesaran dan pengecilan titik terasa sangat halus saat kursor lewat.
