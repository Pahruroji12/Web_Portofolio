# PRD Website Portofolio Pahruroji

## 1. Nama Produk

Website Portofolio Pahruroji

## 2. Deskripsi Singkat

Website portofolio ini dibuat sebagai media personal branding untuk menampilkan profil, pengalaman, skill, project, dan kontak Pahruroji. Website ini memperkenalkan Pahruroji sebagai seorang IT Support yang memiliki pengalaman di bidang jaringan, troubleshooting perangkat, instalasi software, dan kebutuhan teknis operasional. Selain itu, website juga menampilkan proses belajar dan pengembangan kemampuan di bidang Web Development dan Mobile Development.

Website dibuat menggunakan HTML, CSS, dan JavaScript tanpa framework utama. Icon pendukung menggunakan Boxicons melalui CDN. Desain website dan efek background mengacu pada file desain terpisah yang sudah disiapkan, sehingga file PRD tidak perlu digabung dengan file desain.

## 3. Tujuan Website

Tujuan utama website portofolio ini adalah:

1. Menampilkan profil Pahruroji secara profesional dan mudah dipahami.
2. Menjelaskan pengalaman di bidang IT Support.
3. Menampilkan skill di bidang networking, programming, dan tools.
4. Menampilkan project website dan aplikasi desktop dalam bentuk card yang menarik.
5. Memudahkan pengunjung untuk menghubungi melalui email, WhatsApp, LinkedIn, GitHub, dan Instagram.
6. Menjadi media pendukung untuk kebutuhan karier, pembelajaran, dan pengembangan diri di dunia teknologi.

## 4. Target Pengguna

Target pengguna website ini adalah:

1. Recruiter atau HRD yang ingin melihat profil dan kemampuan.
2. Rekan kerja atau teman kuliah yang ingin melihat project.
3. Dosen atau pembimbing yang ingin menilai hasil karya.
4. Orang umum yang ingin mengetahui pengalaman, skill, project, dan kontak pemilik website.

## 5. Konsep Desain Website

Konsep utama website adalah personal portfolio yang modern, bersih, interaktif, dan responsif. Website harus terlihat profesional, tetapi tetap sesuai dengan posisi pemilik website yang sedang belajar dan mengembangkan kemampuan di bidang web serta mobile development.

Arah desain utama:

1. Menggunakan background interaktif berbentuk titik-titik grid.
2. Mendukung mode terang dan mode gelap.
3. Menggunakan warna, tipografi, dan komponen berdasarkan file desain terpisah.
4. Menggunakan animasi ringan seperti typing effect, smooth scroll, hover card, dan transisi dark/light mode.
5. Tetap ringan karena hanya menggunakan HTML, CSS, dan JavaScript.
6. Tidak menggunakan animasi berlebihan agar website tetap nyaman digunakan.

## 6. Teknologi yang Digunakan

Teknologi utama:

1. HTML
2. CSS
3. JavaScript

Library atau CDN pendukung:

1. Boxicons CDN untuk icon pendukung.
2. Google Fonts atau font lokal jika dibutuhkan.

Batasan teknologi:

1. Tidak menggunakan React, Vue, Angular, atau framework JavaScript lain pada tahap awal.
2. Tidak menggunakan backend.
3. Tidak menggunakan database.
4. Tidak menggunakan Tailwind CSS pada versi awal, kecuali nanti dikembangkan lagi.
5. Semua interaksi dasar dibuat menggunakan JavaScript murni.

## 7. Struktur Halaman Website

Website dibuat dalam bentuk one page portfolio atau landing page dengan beberapa section utama.

Struktur section:

1. Navbar
2. Home / Beranda
3. About Me / Tentang Saya
4. Skills / Keahlian
5. Projects / Project
6. Contact / Kontak
7. Footer

## 8. Navbar

Navbar digunakan untuk navigasi antar section.

Menu navbar:

1. Home
2. About
3. Skills
4. Projects
5. Contact

Kebutuhan navbar:

1. Navbar berada di bagian atas halaman.
2. Navbar dapat dibuat sticky agar tetap terlihat saat halaman discroll.
3. Menu navbar menggunakan smooth scroll ke section yang dipilih.
4. Pada tampilan mobile, navbar berubah menjadi hamburger menu.
5. Navbar memiliki tombol dark/light mode.
6. Icon pada navbar atau tombol pendukung dapat menggunakan Boxicons CDN.

## 9. Dark Mode dan Light Mode

Website harus memiliki fitur pergantian tema dark mode dan light mode.

Kebutuhan fitur:

1. Tersedia tombol toggle dark/light mode.
2. Tombol dapat menggunakan icon Boxicons, misalnya icon bulan untuk dark mode dan matahari untuk light mode.
3. Warna background, teks, card, tombol, dan efek titik grid menyesuaikan mode yang aktif.
4. Mode terakhir yang dipilih pengguna disimpan menggunakan `localStorage`.
5. Saat halaman dibuka kembali, website menggunakan mode terakhir yang pernah dipilih pengguna.
6. Transisi perubahan warna dibuat halus agar tidak terasa mendadak.

## 10. Background Website

Background website menggunakan efek Interactive Dot Matrix Grid sesuai file desain background.

Kebutuhan background:

1. Background dibuat menggunakan elemen `canvas` yang memenuhi layar.
2. Canvas berada di belakang seluruh konten website.
3. Titik-titik grid tampil sebagai elemen visual utama background.
4. Titik bereaksi terhadap gerakan kursor.
5. Saat kursor mendekati titik, ukuran titik membesar secara halus.
6. Warna titik menyesuaikan mode terang dan mode gelap.
7. Background tidak boleh mengganggu keterbacaan teks.
8. Background harus tetap ringan dan tidak membuat website berat.
9. Pada perangkat mobile, efek background boleh dibuat lebih ringan agar performa tetap stabil.

## 11. Section Home / Beranda

Section Home adalah bagian pertama yang dilihat oleh pengunjung. Bagian ini harus langsung memperkenalkan Pahruroji dengan jelas.

Teks utama yang digunakan:

"Halo, saya Pahruroji."

Teks pendukung:

"Saya seorang IT Support yang sedang belajar dan mencoba hal baru di bidang Web Development dan Mobile Development."

Catatan gaya bahasa:

Kalimat tersebut dipilih agar terdengar natural, jujur, dan tidak terlalu berlebihan. Kata "sedang belajar" digunakan karena pemilik website masih dalam tahap mengembangkan kemampuan di bidang web dan mobile development.

Fitur pada section Home:

1. Terdapat teks perkenalan utama.
2. Terdapat typing effect atau teks berjalan pada bagian bidang yang sedang dipelajari.
3. Terdapat tombol "Lihat Project".
4. Terdapat tombol "Hubungi Saya".
5. Terdapat foto profil tanpa background di samping teks perkenalan.
6. Foto menggunakan format PNG atau WebP transparan.
7. Layout desktop menggunakan dua kolom, teks di kiri dan foto di kanan.
8. Layout mobile disusun vertikal agar tetap nyaman dilihat.

Perilaku tombol:

1. Tombol "Lihat Project" mengarah ke section Projects.
2. Tombol "Hubungi Saya" mengarah ke section Contact.

## 12. Section About Me / Tentang Saya

Section About Me berisi penjelasan singkat mengenai pengalaman, bidang keahlian, dan proses belajar yang sedang dijalani.

Teks About Me yang digunakan:

"Saya memiliki pengalaman di bidang IT Support, khususnya dalam jaringan komputer, troubleshooting perangkat, instalasi software, dan kebutuhan teknis operasional. Selain itu, saya juga sedang belajar dan mengembangkan kemampuan di bidang pemrograman web dan mobile sebagai bagian dari proses pengembangan diri serta karier di dunia teknologi."

Kebutuhan section About Me:

1. Menampilkan deskripsi diri dengan bahasa natural dan profesional.
2. Tidak terlalu panjang agar mudah dibaca.
3. Menjelaskan pengalaman di bidang IT Support.
4. Menjelaskan bahwa pemilik website sedang belajar web dan mobile development.
5. Dapat ditampilkan menggunakan layout teks dan card ringkas.

## 13. Section Skills / Keahlian

Section Skills digunakan untuk menampilkan kemampuan yang dimiliki. Skill dibagi menjadi tiga kategori utama, yaitu Network, Programming, dan Tools.

Kategori Network:

1. Konfigurasi MikroTik
2. TCP/IP
3. DNS
4. DHCP
5. LAN
6. WAN
7. WiFi
8. Subnetting
9. Troubleshooting komputer
10. Instalasi software

Kategori Programming:

1. HTML
2. CSS
3. JavaScript
4. Flutter dasar
5. Dart dasar
6. Git dan GitHub

Kategori Tools:

1. VS Code
2. GitHub
3. MikroTik Winbox
4. Microsoft Office

Kebutuhan tampilan Skills:

1. Skill ditampilkan menggunakan card atau grid.
2. Setiap kategori skill memiliki judul yang jelas.
3. Skill dapat diberi icon pendukung menggunakan Boxicons CDN.
4. Tampilan tidak terlalu penuh.
5. Pada tampilan mobile, card skill tersusun ke bawah.

## 14. Section Projects / Project

Section Projects digunakan untuk menampilkan project yang pernah dibuat atau sedang dikembangkan. Jumlah project awal yang akan ditampilkan adalah 4 project.

Rencana project:

1. 2 project website.
2. 2 project aplikasi desktop.

Kebutuhan tampilan project:

1. Setiap project ditampilkan dalam bentuk card.
2. Card berisi thumbnail, nama project, jenis project, deskripsi singkat, dan teknologi yang digunakan.
3. Saat mouse diarahkan ke card, muncul overlay atau tombol "View".
4. Untuk project website, tombol "View" dapat diarahkan ke live website atau demo.
5. Untuk project aplikasi desktop, tombol "View" membuka detail project.
6. Detail project dapat ditampilkan menggunakan modal popup.
7. Modal detail project berisi penjelasan singkat, fitur utama, teknologi, dan screenshot aplikasi.
8. Card memiliki efek hover yang halus.
9. Tampilan project tetap responsif di desktop dan mobile.

Contoh struktur project:

Project 1:
Nama: Website Portofolio Pribadi  
Jenis: Website  
Deskripsi: Website pribadi untuk menampilkan profil, skill, project, dan kontak.  
Teknologi: HTML, CSS, JavaScript  
Aksi: View Website

Project 2:
Nama: Landing Page Website  
Jenis: Website  
Deskripsi: Website sederhana untuk menampilkan informasi produk, layanan, atau profil.  
Teknologi: HTML, CSS, JavaScript  
Aksi: View Website

Project 3:
Nama: Aplikasi Desktop Monitoring  
Jenis: Aplikasi Desktop  
Deskripsi: Aplikasi desktop untuk membantu proses monitoring atau kebutuhan teknis operasional.  
Teknologi: Flutter, Dart  
Aksi: Lihat Detail

Project 4:
Nama: Aplikasi Desktop Manajemen Data  
Jenis: Aplikasi Desktop  
Deskripsi: Aplikasi desktop untuk mengelola data dan membantu pekerjaan menjadi lebih rapi.  
Teknologi: Flutter, Dart  
Aksi: Lihat Detail

Catatan: nama, deskripsi, dan screenshot project dapat diganti sesuai project asli yang akan dimasukkan.

## 15. Detail Project

Detail project digunakan untuk memberikan informasi tambahan ketika pengunjung ingin melihat project lebih lengkap.

Untuk project website, tombol dapat mengarah ke:

1. Live demo website.
2. Repository GitHub.
3. Detail project jika website belum online.

Untuk aplikasi desktop, detail project berisi:

1. Nama aplikasi.
2. Deskripsi singkat aplikasi.
3. Tujuan aplikasi dibuat.
4. Fitur utama.
5. Teknologi yang digunakan.
6. Screenshot tampilan aplikasi.
7. Status project, misalnya selesai, dalam pengembangan, atau masih belajar.

## 16. Section Contact / Kontak

Section Contact digunakan agar pengunjung dapat menghubungi pemilik website.

Kontak yang ditampilkan:

1. Email
2. WhatsApp
3. LinkedIn
4. GitHub
5. Instagram

Kebutuhan section Contact:

1. Kontak ditampilkan dengan rapi dan mudah diklik.
2. Email menggunakan link `mailto:`.
3. WhatsApp diarahkan ke link chat WhatsApp.
4. LinkedIn, GitHub, dan Instagram diarahkan ke profil masing-masing.
5. Icon kontak menggunakan Boxicons CDN.
6. Terdapat teks ajakan singkat.

Contoh teks Contact:

"Tertarik untuk berdiskusi, bekerja sama, atau melihat project saya lebih lanjut? Silakan hubungi saya melalui kontak berikut."

## 17. Footer

Footer berada di bagian paling bawah website.

Isi footer:

"© 2026 Pahruroji. All Rights Reserved."

Kebutuhan footer:

1. Footer harus sederhana dan rapi.
2. Warna footer menyesuaikan tema website.
3. Teks berada di tengah atau kiri sesuai desain.
4. Footer tetap terbaca dengan jelas di desktop dan mobile.

## 18. Kebutuhan Fungsional

Kebutuhan fungsional website:

1. Website menampilkan section Home, About, Skills, Projects, Contact, dan Footer.
2. Navbar dapat digunakan untuk berpindah ke setiap section.
3. Tombol "Lihat Project" mengarah ke section Projects.
4. Tombol "Hubungi Saya" mengarah ke section Contact.
5. Teks berjalan atau typing effect muncul pada section Home.
6. Foto profil tanpa background tampil di samping teks perkenalan.
7. Website memiliki tombol dark/light mode.
8. Pilihan tema disimpan menggunakan `localStorage`.
9. Background Interactive Dot Matrix Grid berjalan di belakang konten.
10. Skill ditampilkan berdasarkan kategori Network, Programming, dan Tools.
11. Project ditampilkan dalam bentuk card.
12. Saat card project diarahkan mouse, muncul tombol View.
13. Tombol project website mengarah ke website atau live demo.
14. Tombol project aplikasi desktop membuka detail project.
15. Kontak dapat diklik dan mengarah ke platform yang sesuai.
16. Website dapat diakses dengan baik melalui desktop dan mobile.

## 19. Kebutuhan Non-Fungsional

Kebutuhan non-fungsional website:

1. Website harus ringan dan cepat dibuka.
2. Website harus responsif di desktop, tablet, dan mobile.
3. Tampilan harus rapi, profesional, dan mudah dibaca.
4. Animasi tidak boleh berlebihan.
5. Warna, font, spacing, dan komponen harus konsisten.
6. Website harus mudah dikembangkan kembali saat ada project baru.
7. Struktur kode harus rapi dan mudah dipahami.
8. Website menggunakan bahasa Indonesia yang natural dan tidak kaku.
9. Efek background tidak boleh menurunkan performa website secara berlebihan.
10. Website tetap dapat digunakan meskipun JavaScript animasi background tidak berjalan.

## 20. Kriteria Keberhasilan

Website dianggap berhasil apabila:

1. Pengunjung dapat mengetahui profil Pahruroji dengan cepat dari section Home.
2. Pengunjung dapat memahami pengalaman di bidang IT Support melalui section About.
3. Skill ditampilkan dengan jelas berdasarkan kategori.
4. Project ditampilkan secara menarik dalam bentuk card.
5. Tombol View pada project berfungsi dengan baik.
6. Detail project aplikasi desktop dapat ditampilkan dengan jelas.
7. Kontak dapat diklik dan mengarah ke platform yang sesuai.
8. Website memiliki dark mode dan light mode yang berjalan baik.
9. Efek background tampil menarik tetapi tidak mengganggu keterbacaan.
10. Website tampil rapi di desktop dan mobile.
11. Website terasa ringan, profesional, dan mudah digunakan.

## 21. Kesimpulan

Website portofolio Pahruroji dibuat sebagai media untuk menampilkan profil, pengalaman, skill, project, dan kontak secara profesional. Website ini menonjolkan pengalaman di bidang IT Support serta proses belajar di bidang Web Development dan Mobile Development. Website dibuat menggunakan HTML, CSS, dan JavaScript, dilengkapi Boxicons CDN, dark/light mode, project card interaktif, dan background Interactive Dot Matrix Grid sesuai file desain terpisah.

File PRD, file desain background, dan file design system tetap dipisahkan agar lebih mudah dikelola, dibaca, dan digunakan dalam proses pembuatan website.
