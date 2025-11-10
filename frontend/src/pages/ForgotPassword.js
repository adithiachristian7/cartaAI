import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setMessage('Instruksi untuk reset password telah dikirim ke email Anda.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden relative flex items-center justify-center px-4 py-12 transition-colors duration-300">
      {/* Subtle noise texture */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Lupa{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Password
            </span>
          </h1>
          <div className="relative inline-block mb-6">
            <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 shadow-md"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Masukkan email Anda, dan kami akan mengirimkan link untuk me-reset password Anda.</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg text-sm text-center font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{
              background: "linear-gradient(90deg, #667eea, #764ba2)",
            }}
          ></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-white">Email</span>
                <input
                  type="email"
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background =
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(102, 126, 234, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background =
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {loading ? 'Mengirim...' : 'Kirim Instruksi Reset'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-8">
          Ingat password Anda?{" "}
          <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
