# Website Refinol (PT Pilar Artha Oetama)

Situs statis (Astro) dengan panel admin Decap CMS di `/admin/`. Polanya sama dengan website SLI:
tidak ada PHP, database, atau plugin di server, jadi tidak ada celah seperti WordPress lama.
Semua konten berupa file di repo ini, dan setiap perubahan dari admin tercatat sebagai commit di GitHub.

## Coba di komputer sendiri

```
npm install
npm run dev          # website di http://localhost:4321
npm run cms          # (terminal kedua) admin lokal di http://localhost:4321/admin/index.html (tanpa login)
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

1. Upload folder ini ke repo GitHub baru, yaitu `websiteiipgroup-cell/website-pao`
   (kalau namanya beda, ganti `repo` di `public/admin/config.yml`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → hubungkan repo.
   Build command: `npm run build`, output: `dist`.
3. Cek hasilnya di alamat `*.pages.dev`.
4. Siapkan login admin (sekali saja). Login berjalan di domain website sendiri (`/api/auth`, kodenya di folder
   `functions/`), jadi tidak terganggu kalau ISP memblokir `*.workers.dev` atau `*.pages.dev`.
   - GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*:
     - Application name: `Admin Website Refinol`
     - Homepage URL: `https://www.refinol.com`
     - Authorization callback URL: `https://www.refinol.com/api/callback`
       (untuk tes sebelum domain pindah, isi dulu `https://website-pao.pages.dev/api/callback`,
       lalu ganti ke alamat www.refinol.com setelah domain tersambung).
   - Klik *Generate a new client secret*, salin Client ID dan Client Secret.
   - Cloudflare Pages → `website-pao` → Settings → Variables and Secrets, tambahkan:
     - `GITHUB_CLIENT_ID` = Client ID
     - `GITHUB_CLIENT_SECRET` = Client Secret (pilih tipe *Secret*)
   - Deploy ulang (Deployments → Retry deployment), lalu buka `/admin/` dan klik *Login with GitHub*.
   - Yang bisa masuk hanya akun GitHub yang punya akses ke repo ini (undang di repo → Settings → Collaborators).
5. Domain tetap dikelola di cPanel hosting lama (email `@refinol.com` tetap di sana):
   - Cloudflare Pages → `website-pao` → Custom domains → tambahkan `www.refinol.com`.
   - cPanel → Zone Editor → ubah record `www` menjadi CNAME ke `website-pao.pages.dev`
     (hapus dulu record A untuk `www` kalau ada).
   - cPanel → Redirects → arahkan `refinol.com` ke `https://www.refinol.com/` (301, permanen).
   - Jangan ubah record MX, supaya email tetap jalan.
6. Setelah `www.refinol.com` menampilkan website baru, hapus WordPress lama dari `public_html`
   (sisakan hanya `.htaccess` untuk redirect tadi) dan ganti password database lama.

## Alamat lama

`public/_redirects` memetakan alamat WordPress lama (`/product/`, `/palm-oil/`, `/rapseed-oil/`,
`/technology-2/`, `/wp-admin/`, dll.) ke alamat baru. Link lama berbentuk `/?page_id=8` dipetakan oleh
skrip kecil di halaman Home, karena `_redirects` Cloudflare tidak bisa membaca query string.
Catatan: `/technology/` di situs lama berisi halaman Process; di situs baru alamat itu menampilkan Technology.

## Yang masih perlu diisi

- Deskripsi Palm kernel oil, Coconut oil, dan Soft oils (di situs lama halamannya kosong).
- Spesifikasi produk (grade, dosis, kemasan) kalau mau ditampilkan.
- Foto baru: foto lama dari 2017 dan sebagian dari WhatsApp, resolusinya rendah. Prioritas: foto latar hero di Home (landscape, minimal 1920 x 1000, tajam) — sekarang memakai foto pabrik 2017.
- Logo (sekarang memakai tulisan "Refinol"). Logogram PAO dari situs lama ada di `public/images/uploads/logogram-pao.png` dan dipakai sebagai ikon tab browser.
- Klaim "patent pending" di halaman Process dan Quality control berasal dari 2017; cek apakah statusnya sudah berubah.
- Nomor WhatsApp dan medsos perusahaan di Pengaturan (akun medsos di situs lama masih contoh bawaan WordPress, jadi tidak dipindahkan).
