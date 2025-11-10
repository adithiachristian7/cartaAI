import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, logout, userProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/logo_cartaAI.png"
            alt="Logo Brand"
            className="w-10 h-10"
          />
          <h2 className="text-primary dark:text-white text-2xl font-bold tracking-tight">
            cartaAI
          </h2>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            className={`${
              location.pathname === "/"
                ? "text-blue-600 dark:text-indigo-400"
                : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
            } text-sm font-medium transition-colors`}
            to="/"
          >
            Beranda
          </Link>
          <Link
            className={`${
              location.pathname === "/tentang"
                ? "text-blue-600 dark:text-indigo-400"
                : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
            } text-sm font-medium transition-colors`}
            to="/tentang"
          >
            Tentang Kami
          </Link>
          <Link
            className={`${
              location.pathname === "/template"
                ? "text-blue-600 dark:text-indigo-400"
                : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
            } text-sm font-medium transition-colors`}
            to="/template"
          >
            Template
          </Link>
          <Link
            className={`${
              location.pathname === "/harga"
                ? "text-blue-600 dark:text-indigo-400"
                : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
            } text-sm font-medium transition-colors`}
            to="/harga"
          >
            Harga
          </Link>
        </div>

        {/* Auth buttons for Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
          
          {userProfile?.subscription_status === "premium" && (
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
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-bold"
            >
              Profil
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-bold shadow-none hover:shadow-none text-white"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-bold shadow-none hover:shadow-none"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Dark Mode Toggle Mobile */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 shadow-md transition-colors duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {/* Navigation Links */}
              <Link
                className={`${
                  location.pathname === "/"
                    ? "text-blue-800 dark:text-indigo-400"
                    : "text-gray-900 dark:text-gray-100 hover:text-blue-700 dark:hover:text-indigo-400"
                } text-sm font-medium transition-colors`}
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                className={`${
                  location.pathname === "/tentang"
                    ? "text-blue-600 dark:text-indigo-400"
                    : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
                } text-sm font-medium transition-colors`}
                to="/tentang"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                className={`${
                  location.pathname === "/template"
                    ? "text-blue-600 dark:text-indigo-400"
                    : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
                } text-sm font-medium transition-colors`}
                to="/template"
                onClick={() => setIsMenuOpen(false)}
              >
                Template
              </Link>
              <Link
                className={`${
                  location.pathname === "/harga"
                    ? "text-blue-600 dark:text-indigo-400"
                    : "text-secondary dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400"
                } text-sm font-medium transition-colors`}
                to="/harga"
                onClick={() => setIsMenuOpen(false)}
              >
                Harga
              </Link>

              {/* Auth buttons for Mobile */}
              <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                {userProfile?.subscription_status === "premium" && (
                  <Link
                    to="/premium-generator"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all duration-300 transform hover:scale-105 text-center block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Premium Generator
                  </Link>
                )}
                {session ? (
                  <Link
                    to="/profile"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-bold text-white text-center block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-bold text-white text-center block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-bold text-white text-center block"
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
