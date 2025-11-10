import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Hero() {
  const { session, userProfile } = useAuth();

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-6 relative overflow-x-hidden transition-colors duration-300">
      {/* Subtle noise texture */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Gunakan flex-col-reverse di mobile, dan flex-row di desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Bagian Kiri - Teks (akan muncul di bawah di mobile) */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Buat Undangan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Pernikahan
              </span>{" "}
              Digital yang Indah dan Praktis, Dirancang Otomatis oleh AI.{" "}
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
              Buat undangan pernikahan kamu yang kreatif dan personal dengan
              mudah. Tanpa ribet, cepat, dan hasilnya memukau!
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
              {userProfile?.subscription_status === 'premium' ? (
                <Link
                  to="/premium-generator"
                  className="px-8 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Buat Undangan Sekarang
                </Link>
              ) : (
                <Link
                  to="/chat"
                  className="px-8 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Coba Gratis
                </Link>
              )}
              <a
                href="/template"
                className="border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-8 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
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