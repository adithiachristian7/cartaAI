import React from "react";
import { Link } from 'react-router-dom';
import TypingAnimation from './TypingAnimation';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Hero() {
  const { session } = useAuth(); // Get session from context

  return (
    <section className="relative text-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-blue-100/30"></div>
        <img
          alt=""
          className="h-full w-full object-cover opacity-60"
          src="/assets/bg_hero.jpg"
        />
      </div>
      <div className="container relative z-10 mx-auto px-6 py-24 sm:py-32 lg:py-40">
        <h1 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl lg:text-6xl" style={{ textShadow: '2px 2px 4px rgba(118, 117, 117, 0.8), 0 0 10px rgba(102, 100, 100, 0.6)' }}>
          <TypingAnimation
            text="Desain Undangan Pernikahan Cantik, Cepat, dan Otomatis Berbasis AI."
            speed={100}
            loop={false}
          />
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white font-medium leading-relaxed" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.6)' }}>
          <TypingAnimation
            text="Buat undangan pernikahan interaktif yang personal, elegan, dan siap kirim dalam hitungan menit."
            speed={80}
            loop={true}
            loopDelay={7000}
          />
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            // Conditionally set the destination URL
            to={session ? "/chat" : "/register"}
            className="btn-primary rounded-full px-8 py-3 text-base font-bold shadow-lg"
          >
            Coba Gratis Sekarang
          </Link>
          <a
            className="btn-secondary rounded-full px-8 py-3 text-base font-bold shadow-lg"
            href="template"
          >
            Lihat Contoh Undangan
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
