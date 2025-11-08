import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/logo_cartaAI.png"
            alt="Logo Brand"
            className="w-10 h-10"
          />
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            cartaAI
          </h2>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            className={`${
              location.pathname === "/"
                ? "text-blue-600"
                : "text-secondary hover:text-blue-600"
            } text-sm font-medium`}
            to="/"
          >
            Beranda
          </Link>
          <Link
            className={`${
              location.pathname === "/tentang"
                ? "text-blue-600"
                : "text-secondary hover:text-blue-600"
            } text-sm font-medium`}
            to="/tentang"
          >
            Tentang Kami
          </Link>
          <Link
            className={`${
              location.pathname === "/template"
                ? "text-blue-600"
                : "text-secondary hover:text-blue-600"
            } text-sm font-medium`}
            to="/template"
          >
            Template
          </Link>
          <Link
            className={`${
              location.pathname === "/harga"
                ? "text-blue-600"
                : "text-secondary hover:text-blue-600"
            } text-sm font-medium`}
            to="/harga"
          >
            Harga
          </Link>
        </div>

        {/* Auth buttons for Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {userProfile?.subscription_status === 'premium' && (
            <Link
              to="/premium-generator"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Premium Generator
            </Link>
          )}
          {session ? (
            <Link
              to="/profile"
              className="btn-primary rounded-lg px-4 py-2 text-sm font-bold"
            >
              Profil
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-primary rounded-lg px-4 py-2 text-sm font-bold shadow-none hover:shadow-none text-white"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="btn-primary rounded-lg px-4 py-2 text-sm font-bold shadow-none hover:shadow-none"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {/* Navigation Links */}
              <Link
                className={`${
                  location.pathname === "/"
                    ? "text-blue-800"
                    : "text-gray-900 hover:text-blue-700"
                } text-sm font-medium`}
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                className={`${
                  location.pathname === "/tentang"
                    ? "text-blue-600"
                    : "text-secondary hover:text-blue-600"
                } text-sm font-medium`}
                to="/tentang"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                className={`${
                  location.pathname === "/template"
                    ? "text-blue-600"
                    : "text-secondary hover:text-blue-600"
                } text-sm font-medium`}
                to="/template"
                onClick={() => setIsMenuOpen(false)}
              >
                Template
              </Link>
              <Link
                className={`${
                  location.pathname === "/harga"
                    ? "text-blue-600"
                    : "text-secondary hover:text-blue-600"
                } text-sm font-medium`}
                to="/harga"
                onClick={() => setIsMenuOpen(false)}
              >
                Harga
              </Link>

              {/* Auth buttons for Mobile */}
              <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                {session ? (
                  <Link
                    to="/profile"
                    className="btn-primary rounded-lg px-4 py-2 text-sm font-bold text-white text-center block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-color-blue rounded-lg px-4 py-2 text-sm font-bold text-white text-center block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      className="btn-color-blue rounded-lg px-4 py-2 text-sm font-bold text-white text-center block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;