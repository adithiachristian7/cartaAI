import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const transactionStatus = searchParams.get('transaction_status');
  const orderId = searchParams.get('order_id');

  let title = 'Status Pembayaran';
  let message = 'Mengecek status pembayaran Anda...';
  let isSuccess = false;

  if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
    title = 'Pembayaran Berhasil!';
    message = `Terima kasih! Pembayaran Anda untuk pesanan ${orderId} telah kami terima. Akun Anda akan segera di-upgrade.`;
    isSuccess = true;
  } else if (transactionStatus === 'pending') {
    title = 'Pembayaran Tertunda';
    message = `Pembayaran Anda untuk pesanan ${orderId} sedang menunggu konfirmasi. Silakan selesaikan pembayaran Anda.`;
  } else if (transactionStatus === 'failure' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
    title = 'Pembayaran Gagal';
    message = `Maaf, pembayaran Anda untuk pesanan ${orderId} gagal atau dibatalkan. Silakan coba lagi.`;
  } else {
    title = 'Terima Kasih';
    message = 'Anda akan diarahkan kembali setelah pembayaran selesai.';
  }

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

      <div className="w-full max-w-2xl relative z-10 text-center">
        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg p-10 border border-gray-100 transition-all duration-300 hover:shadow-xl">
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{
              background: isSuccess
                ? "linear-gradient(90deg, #10b981, #059669)"
                : "linear-gradient(90deg, #f59e0b, #d97706)",
            }}
          ></div>

          <div className="relative z-10">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md ${
              isSuccess 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-yellow-500 to-orange-500'
            }`}>
              <span className="material-symbols-outlined text-white text-4xl">
                {isSuccess ? 'check_circle' : 'warning'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{message}</p>
            <Link 
              to="/"
              className="inline-block rounded-xl px-8 py-3 text-base font-semibold text-white transition-all duration-300"
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
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;
