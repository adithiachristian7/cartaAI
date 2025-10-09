import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BlockchainPayment from '../components/BlockchainPayment';

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission
    alert('Pembayaran berhasil diproses!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Pembayaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Premium</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lengkapi pembayaran untuk mengakses semua fitur premium cartaAI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="font-semibold text-gray-800">Paket Premium</h3>
                  <p className="text-gray-600 text-sm">Akses penuh semua fitur</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">Rp 99.000</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b">
                <span className="font-semibold text-gray-800">Durasi</span>
                <span className="text-gray-600">1 Bulan</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b">
                <span className="font-semibold text-gray-800">Subtotal</span>
                <span className="text-2xl font-bold text-gray-800">Rp 99.000</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="font-bold text-xl text-gray-800">Total</span>
                <span className="text-3xl font-bold text-blue-600">Rp 99.000</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Pembayaran</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Informasi Pribadi</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nomor Telepon"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Metode Pembayaran</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <span className="material-symbols-outlined mr-3 text-blue-600">credit_card</span>
                      <span className="font-medium">Kartu Kredit/Debit</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <span className="material-symbols-outlined mr-3 text-blue-600">account_balance</span>
                      <span className="font-medium">Transfer Bank</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e_wallet"
                      checked={paymentMethod === 'e_wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <span className="material-symbols-outlined mr-3 text-blue-600">wallet</span>
                      <span className="font-medium">E-Wallet</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="blockchain"
                      checked={paymentMethod === 'blockchain'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-orange-600"
                    />
                    <div className="flex items-center">
                      <span className="material-symbols-outlined mr-3 text-orange-600">currency_bitcoin</span>
                      <span className="font-medium">Blockchain (ETH)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Credit Card Details */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Detail Kartu</h3>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Nomor Kartu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Transfer</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bank:</strong> BCA</p>
                    <p><strong>Nomor Rekening:</strong> 1234567890</p>
                    <p><strong>Atas Nama:</strong> PT CartaAI Indonesia</p>
                    <p><strong>Total:</strong> Rp 99.000</p>
                  </div>
                </div>
              )}

              {/* E-Wallet Details */}
              {paymentMethod === 'e_wallet' && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Pilih E-Wallet</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-green-500 transition-colors">
                      <span className="material-symbols-outlined text-green-600">GoPay</span>
                    </button>
                    <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                      <span className="material-symbols-outlined text-blue-600">DANA</span>
                    </button>
                    <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-purple-500 transition-colors">
                      <span className="material-symbols-outlined text-purple-600">OVO</span>
                    </button>
                    <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                      <span className="material-symbols-outlined text-orange-600">LinkAja</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Blockchain Payment */}
              {paymentMethod === 'blockchain' && (
                <BlockchainPayment />
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Bayar Sekarang - Rp 99.000
              </button>
            </form>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Payment;
