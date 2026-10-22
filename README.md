# Website Refinol (PT Pilar Artha Oetama)

Situs statis (Astro) dengan panel admin Decap CMS di `/admin/`. Polanya sama dengan website SLI:
tidak ada PHP, database, atau plugin di server, jadi tidak ada celah seperti WordPress lama.
Semua konten berupa file di repo ini, dan setiap perubahan dari admin tercatat sebagai commit di GitHub.

## Coba di komputer sendiri

```
npm install
npm run dev          # website di http://localhost:4321
npm run cms          # (terminal kedua) admin lokal di http://localhost:4321/admin/index.html
```

## Struktur konten (semua bisa diedit lewat /admin/)

| Menu admin | Isi | Lokasi file |
| --- | --- | --- |
| Halaman | Home, About, Technology, Process, Quality control, Laboratory, Contact, dan halaman baru, disusun dari blok | `src/content/halaman/*.md` |
| Produk | Satu entri per jenis minyak (Palm oil, Palm kernel oil, Coconut oil, Soft oils) | `src/content/produk/*.md` |
| Berita | Artikel (belum ada; menu News ditambahkan lewat Pengaturan setelah ada artikel) | `src/content/berita/*.md` |
| Pengaturan | Logo, ikon, alamat, telepon, email, WhatsApp, medsos, menu, teks halaman Products | `src/data/site.json` |

Jenis blok: Hero (foto latar opsional + pita warna minyak), Judul halaman, Teks dengan foto, Teks, Galeri,
Alur proses (otomatis), Daftar produk minyak (otomatis), Berita terbaru (otomatis),
Ajakan menghubungi, Alamat dan kontak.

Halaman yang diberi nomor "Urutan di alur" otomatis masuk ke bagian *From deposit to your refinery*
di Home dan mendapat tombol Previous/Next. Saat ini: Technology (1), Process (2), Quality control (3),
Laboratory (4).

Nama halaman `home`, `products`, `news`, `admin`, dan `404` sudah dipakai sistem.
Isi website berbahasa Inggris; label di admin berbahasa Indonesia.

## Online-kan (Cloudflare Pages)

1. Upload folder ini ke repo GitHub baru, misalnya `websiteiipgroup-cell/refinol`
   (kalau namanya beda, ganti `repo` di `public/admin/config.yml`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → hubungkan repo.
   Build command: `npm run build`, output: `dist`.
3. Cek hasilnya di alamat `*.pages.dev`.
4. Login admin memakai worker yang sama dengan SLI (`sveltia-cms-auth.websiteiipgroup.workers.dev`).
   Tambahkan `refinol.com` dan alamat `*.pages.dev` Refinol ke variabel `ALLOWED_DOMAINS` di worker itu.
5. Hubungkan domain `refinol.com` (Custom domains). Email `@refinol.com` masih dipakai, jadi pastikan
   record MX (dan SPF/DKIM) ikut disalin sebelum nameserver dipindah.
6. Setelah domain pindah, matikan/hapus WordPress lama di cPanel dan ganti password database lama.

## Alamat lama

`public/_redirects` memetakan alamat WordPress lama (`/product/`, `/palm-oil/`, `/rapseed-oil/`,
`/technology-2/`, `/wp-admin/`, dll.) ke alamat baru. Link lama berbentuk `/?page_id=8` dipetakan oleh
skrip kecil di halaman Home, karena `_redirects` Cloudflare tidak bisa membaca query string.
Catatan: `/technology/` di situs lama berisi halaman Process; di situs baru alamat itu menampilkan Technology.

## Yang masih perlu diisi

- Deskripsi Palm kernel oil, Coconut oil, dan Soft oils (di situs lama halamannya kosong).
- Spesifikasi produk (grade, dosis, kemasan) kalau mau ditampilkan.
- Foto baru: foto lama dari 2017 dan sebagian dari WhatsApp, resolusinya rendah. Prioritas: foto latar hero di Home (landscape, minimal 1920 x 1000, tajam) — sekarang memakai foto pabrik 2017.
- Logo (sekarang memakai tulisan "Refinol").
- Klaim "patent pending" di halaman Process dan Quality control berasal dari 2017; cek apakah statusnya sudah berubah.
- Nomor WhatsApp dan medsos perusahaan di Pengaturan (akun medsos di situs lama masih contoh bawaan WordPress, jadi tidak dipindahkan).
