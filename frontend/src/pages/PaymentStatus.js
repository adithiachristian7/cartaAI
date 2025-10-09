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
    <div className="container mx-auto px-6 py-24 max-w-2xl text-center">
      <div className={`bg-white p-10 rounded-lg shadow-md border-t-8 ${isSuccess ? 'border-green-500' : 'border-yellow-500'}`}>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-700 text-lg mb-8">{message}</p>
        <Link 
          to="/"
          className="btn-primary rounded-full px-8 py-3 text-base font-bold shadow-lg"
        >
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}

export default PaymentStatus;
