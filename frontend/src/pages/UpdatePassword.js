import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMessage('Anda sekarang bisa membuat password baru.');
      } else {
        // If not in password recovery, redirect away.
        // navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setMessage('Password Anda telah berhasil diperbarui! Anda akan diarahkan ke halaman login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden relative flex items-center justify-center px-4 py-12">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Update{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Password
            </span>
          </h1>
          <div className="relative inline-block mb-6">
            <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white rounded-full border-4 border-indigo-500 shadow-md"></div>
          </div>
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

        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
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
                <span className="text-sm font-medium text-gray-700">Password Baru</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="mt-1 block w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.975-7 1.707-4.057 5.497-7 9.975-7A9.95 9.95 0 0118 5.175M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 4.5l15 15"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.43a1.012 1.012 0 011.42 0l4.43 4.43a1.012 1.012 0 010 .639l-4.43 4.43a1.012 1.012 0 01-1.42 0l-4.43-4.43z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="mt-1 block w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.975-7 1.707-4.057 5.497-7 9.975-7A9.95 9.95 0 0118 5.175M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 4.5l15 15"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.43a1.012 1.012 0 011.42 0l4.43 4.43a1.012 1.012 0 010 .639l-4.43 4.43a1.012 1.012 0 01-1.42 0l-4.43-4.43z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
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
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
