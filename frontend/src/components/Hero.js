import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Hero() {
  const { session } = useAuth();

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Gunakan flex-col-reverse di mobile, dan flex-row di desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Bagian Kiri - Teks (akan muncul di bawah di mobile) */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Buat Undangan <span className="text-blue-700">Pernikahan</span>{" "}
              Digital yang Indah dan Praktis, Dirancang Otomatis oleh AI.{" "}
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Buat undangan pernikahan kamu yang kreatif dan personal dengan
              mudah. Tanpa ribet, cepat, dan hasilnya memukau!
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
              <Link
                to="/chat"
                className="btn-primary bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Coba Gratis
              </Link>
              <a
                href="/template"
                className="border border-blue-700 text-blue-700 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                Lihat Contoh Undangan
              </a>
            </div>
          </div>

          {/* Bagian Kanan - Gambar (akan muncul di atas di mobile) */}
          <div className="flex-1 w-full">
            <div
              className="w-full h-80 md:h-96 lg:h-[450px] bg-cover bg-center rounded-xl shadow-xl overflow-hidden relative group"
              style={{ backgroundImage: "url('/assets/bg_hero1.jpg')" }}
            >
              {/* Overlay semi-transparent */}
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;