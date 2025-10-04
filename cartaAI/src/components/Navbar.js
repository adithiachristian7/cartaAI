import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/assets/logo_cartaAI.png" alt="Logo Brand" className="w-10 h-10" />
          <h2 className="text-primary text-2xl font-bold tracking-tight">cartaAI</h2>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link className="text-secondary hover:text-blue-600 text-sm font-medium" to="/">
            Beranda
          </Link>
          <Link className="text-secondary hover:text-blue-600 text-sm font-medium" to="/tentang">
            Tentang
          </Link>
          <Link className="text-secondary hover:text-blue-600 text-sm font-medium" to="/template">
            Template
          </Link>
          <Link className="text-secondary hover:text-blue-600 text-sm font-medium" to="/harga">
            Harga
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => window.location.href = '/login'}
            className="rounded-lg px-4 py-2 text-sm font-bold text-primary"
          >
            Masuk
          </button>
          <button
            onClick={() => window.location.href = '/register'}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-bold"
          >
            Daftar
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              <Link
                className="text-secondary hover:text-blue-600 text-sm font-medium"
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                className="text-secondary hover:text-blue-600 text-sm font-medium"
                to="/tentang"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                className="text-secondary hover:text-blue-600 text-sm font-medium"
                to="/template"
                onClick={() => setIsMenuOpen(false)}
              >
                Template
              </Link>
              <Link
                className="text-secondary hover:text-blue-600 text-sm font-medium"
                to="/harga"
                onClick={() => setIsMenuOpen(false)}
              >
                Harga
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <button className="rounded-lg px-4 py-2 text-sm font-bold text-primary text-left">
                  Masuk
                </button>
                <button className="btn-primary rounded-lg px-4 py-2 text-sm font-bold">
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
