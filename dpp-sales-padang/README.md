# DPP - Sales MyRepublic Padang (versi Vercel)
Situs sales mandiri, bukan situs resmi penyedia layanan.

## Pasang
1. Extract zip, upload isinya ke repo GitHub baru (file `vercel.json`, `api/`, `public/` harus di root repo).
2. Vercel > Add New > Project > pilih repo > Framework "Other" > Deploy.
3. Tab Storage > Create Database > Upstash for Redis > hubungkan ke project (variabel Redis terisi otomatis).
4. Settings > Environment Variables: tambah `ADMIN_PASSWORD` dan `SESSION_SECRET` (acak, 32+ karakter).
5. Deployments > Redeploy. Situs: `/`, admin: `/tab/admin`.

## Catatan
- Data (pengaturan, pesanan, statistik, gambar) disimpan di Redis, bukan di file. Gambar diperkecil otomatis di browser (maks 600 KB).
- Isi harga/biaya resmi di Admin lalu centang "terverifikasi". Data awal hanya contoh.
- Lokasi otomatis memakai Nominatim (OpenStreetMap) untuk trafik kecil; alamat bisa diisi manual.
