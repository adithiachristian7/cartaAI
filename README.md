# CartaAI - AI-Powered Invitation Generator

CartaAI adalah sebuah aplikasi web yang memungkinkan pengguna untuk membuat undangan pernikahan yang interaktif dan personal menggunakan kekuatan AI. Pengguna cukup memberikan prompt, dan aplikasi akan menghasilkan undangan digital yang siap dibagikan dalam bentuk link.

## Fitur Utama

-   **Generator Berbasis AI**: Membuat konten undangan secara otomatis berdasarkan input (prompt) dari pengguna.
-   **Autentikasi Pengguna**: Sistem registrasi dan login yang aman menggunakan Email/Password dan Google OAuth.
-   **Template**: Pilihan template desain undangan yang bisa disesuaikan.
-   **Tingkatan Langganan**: Rencana gratis dan premium untuk fitur-fitur eksklusif.

## Teknologi yang Digunakan

| Bagian   | Teknologi                                                              |
| :------- | :--------------------------------------------------------------------- |
| **Frontend** | React, React Router, Tailwind CSS, Supabase.js                       |
| **Backend**  | FastAPI (Python), Uvicorn, Supabase-py, python-dotenv                |
| **Database** | Supabase (PostgreSQL)                                                |
| **Auth**     | Supabase Auth                                                        |
| **Storage**  | Supabase Storage (untuk upload gambar pengguna)                      |

## Struktur Proyek

```
cartaAI/
├── backend/         # Aplikasi Backend FastAPI (Python)
│   ├── venv/
│   ├── main.py
│   └── .env
└── frontend/        # Aplikasi Frontend React
    ├── public/
    ├── src/
    ├── .env
    └── package.json
```

## Skema Database (Supabase/PostgreSQL)

Berikut adalah struktur database yang digunakan dalam proyek ini.

### Tabel `users`
Menyimpan data profil publik pengguna, terhubung dengan sistem autentikasi Supabase.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    subscription_status TEXT DEFAULT 'free' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel `templates`
Menyimpan informasi mengenai template-template undangan yang tersedia.

```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    preview_image_url TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel `invitations`
Menyimpan data undangan yang telah dibuat oleh setiap pengguna.

```sql
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    prompt TEXT,
    generated_content JSONB, -- Menyimpan semua detail undangan (nama, alamat, jadwal, URL foto)
    slug TEXT UNIQUE NOT NULL, -- ID unik untuk URL publik
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel `subscriptions`
Melacak histori dan status langganan premium dari pengguna.

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Fungsi dan Trigger Otomatis
Fungsi ini secara otomatis membuat entri di tabel `public.users` setiap kali ada pengguna baru yang mendaftar melalui Supabase Auth.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Cara Menjalankan Proyek

### Backend
1.  Masuk ke direktori `backend`.
2.  Buat dan aktifkan virtual environment: `python -m venv venv` & `.\venv\Scripts\activate`.
3.  Install dependensi: `pip install fastapi uvicorn supabase python-dotenv`.
4.  Buat file `.env` dan isi `SUPABASE_URL` dan `SUPABASE_KEY`.
5.  Jalankan server: `uvicorn main:app --reload`.

### Frontend
1.  Masuk ke direktori `frontend`.
2.  Install dependensi: `npm install`.
3.  Buat file `.env` dan isi `REACT_APP_SUPABASE_URL` dan `REACT_APP_SUPABASE_KEY`.
4.  Jalankan aplikasi: `npm start`.

## Pengujian Pembayaran dengan Midtrans(Sandbox) & Ngrok

> **Catatan:** Alur pembayaran saat ini terintegrasi dengan **Sandbox Midtrans**. Ini hanya untuk tujuan pengembangan dan tidak menggunakan uang sungguhan.

Untuk menguji alur pembayaran secara lengkap (termasuk notifikasi/webhook dari Midtrans), server backend lokal Anda harus bisa diakses dari internet. Kita menggunakan `ngrok` untuk ini.

### Setup `ngrok`

1.  **Install `ngrok`**: Buka terminal (disarankan dengan hak administrator) dan install `ngrok` secara global melalui npm.
    ```bash
    npm install -g ngrok
    ```

2.  **Autentikasi `ngrok`**: Buat akun gratis di [dashboard.ngrok.com](https://dashboard.ngrok.com) untuk mendapatkan authtoken. Lalu jalankan perintah di bawah ini (cukup sekali).
    ```bash
    ngrok config add-authtoken <TOKEN_ANDA_DARI_DASHBOARD>
    ```

3.  **Jalankan `ngrok`**: Buka terminal, masuk ke direktori frontend/ backend terus jalankan perintah berikut:
    ```bash
    ngrok http 8000 # untuk backend
    ngrok http 3000 # untuk frontend
    ```
    Anda akan mendapatkan dua URL `Forwarding` yang baru.
    terus ganti URL webhook di dashboard Midtrans dengan URL `ngrok` yang baru.
    contohnya: https://aiko-raucous-misunderstandingly.ngrok-free.dev/payment-status
    taru di dalam(**Settings > snap refrence > system setting**)

### Konfigurasi Midtrans

Setiap kali Anda memulai `ngrok` dan mendapatkan URL baru, Anda harus memperbarui URL di dashboard Midtrans Anda (**Settings > Configuration**):

-   **Payment Notification URL**: Isi dengan URL `ngrok` untuk **backend** (port 8000) + `/api/payments/midtrans-notification`.
-   **Finish URL**: Isi dengan URL `ngrok` untuk **frontend** (port 3000) + `/#/payment-status` (jika menggunakan HashRouter) atau `/payment-status` (jika menggunakan BrowserRouter).
