# Walkthrough: Implementasi Registrasi User Baru

Dokumen ini menjelaskan langkah-langkah yang telah diimplementasikan pada branch `feature/registrasi-user` untuk memenuhi [Issue #4](https://github.com/NursiNursi/belajar-vibe-coding/issues/4).

## 1. Perubahan Skema Database
**File:** `src/db/schema.ts`
- Menambahkan kolom `password` (tipe varchar 255) pada tabel `users`.
- Kolom ini diatur sebagai `notNull()` untuk memastikan setiap user memiliki password.

## 2. Pembuatan Layer Service
**File:** `src/services/users-service.ts`
- Membuat kelas `UserService` dengan metode statis `register(input)`.
- Mengimplementasikan pengecekan email ganda melalui query ke database. Jika ditemukan, akan melempar error `"Email sudah terdaftar"`.
- Menggunakan `Bun.password.hash` dengan algoritma `bcrypt` dan cost `10` untuk melakukan hashing pada password plain text sebelum disimpan.
- Menyimpan data user baru (termasuk password yang sudah di-hash) ke dalam database menggunakan `db.insert`.

## 3. Pembuatan Layer Route
**File:** `src/routes/users-route.ts`
- Menginisiasi router `Elysia` dengan prefix `/users`.
- Menambahkan route `POST /` (yang nantinya menjadi `POST /api/users`).
- Menambahkan validasi request body menggunakan `t.Object` untuk memastikan field `name`, `email` (format email), dan `password` (minimal 6 karakter) dikirim dengan benar.
- Menangani respons:
  - Sukses (200): `{ "data": "OK" }`
  - Gagal Validasi Email (400): `{ "error": "Email sudah terdaftar" }`
  - Gagal Server/Lainnya (500): `{ "error": "Pesan error" }`

## 4. Pembaruan Entry Point Aplikasi
**File:** `src/index.ts`
- Mengimpor `usersRoute` dari file route yang baru.
- Menambahkan `.group("/api", (app) => app.use(usersRoute))` agar seluruh endpoint user berada di bawah path `/api`.
- Menghapus route lama (`src/routes/users.ts`) yang tidak lagi digunakan.

## 5. Menjalankan & Verifikasi
- Jalankan sinkronisasi database dengan `bun run db:push`.
- Jalankan server `bun run dev`.
- Tes registrasi user menggunakan `curl` atau aplikasi seperti Postman/Insomnia.

---

# Walkthrough: Implementasi Login User & Sesi (Issue #6)

## 1. Perubahan Skema Database
**File:** `src/db/schema.ts`
- Menambahkan tabel `sessions` dengan field `id`, `token`, `user_id` (sebagai foreign key ke tabel `users`), dan `createdAt`.
- Tipe data `user_id` diatur sebagai `bigint` unsigned agar sesuai dengan tipe auto-increment pada Drizzle MySQL.

## 2. Pembuatan Layer Service
**File:** `src/services/users-service.ts`
- Menambahkan metode `login(input)` pada `UserService`.
- Pengecekan apakah user berdasarkan email tersedia, jika tidak throw `"Email atau password salah"`.
- Melakukan verifikasi hash password menggunakan `Bun.password.verify`.
- Generate UUID v4 (token) menggunakan `crypto.randomUUID()`.
- Insert token ke tabel `sessions` lalu me-return token tersebut.

## 3. Pembuatan Layer Route
**File:** `src/routes/users-route.ts`
- Menambahkan endpoint `POST /login` di router `Elysia`.
- Memvalidasi request body: `email` dan `password`.
- Menangani respons dengan mengembalikan token sesi (200) atau error `"Email atau password salah"` (400).

## 4. Menjalankan & Verifikasi
- Sinkronisasi database menggunakan `bun run db:push` (untuk tabel sessions baru).
- Menguji API dengan `curl` ke endpoint `http://localhost:3000/api/users/login`.
