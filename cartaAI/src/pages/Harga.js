import React from 'react';
import { Link } from 'react-router-dom';

function Harga() {
  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Gratis',
      description: 'Untuk memulai',
      buttonText: 'Mulai Gratis',
      buttonLink: '/chat',
      features: [
        'Desain terbatas',
        'Fitur dasar',
        'Hingga 100 undangan'
      ]
    },
    {
      name: 'Premium',
      price: 'Rp 99rb',
      period: '/bulan',
      description: 'Untuk acara spesial',
      buttonText: 'Pilih Paket Premium',
      buttonLink: '/premium-generator',
      isPopular: true,
      features: [
        'Semua desain premium',
        'Fitur lengkap & interaktif',
        'Hingga 500 undangan',
        'Dukungan prioritas'
      ]
    }
  ];

  return (
    <section className="bg-white py-20 sm:py-24" id="pricing">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Fitur paket yang tersedia
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Pilih paket yang paling sesuai dengan kebutuhan Anda
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-2xl border p-8 pricing-card ${
                plan.isPopular
                  ? 'border-2 border-soft-blue shadow-2xl shadow-blue-200/50'
                  : 'border-slate-200'
              }`}
            >
              {plan.isPopular && (
                <p className="absolute top-0 -translate-y-1/2 rounded-full bg-soft-blue px-4 py-1 text-sm font-semibold text-white">
                  Terpopuler
                </p>
              )}
              <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold text-primary">
                {plan.price}
                {plan.period && (
                  <span className="text-base font-medium text-secondary">{plan.period}</span>
                )}
              </p>
              <p className="mt-1 text-secondary">{plan.description}</p>

              {/* Tombol utama */}
              <Link
                to={plan.buttonLink}
                className={`mt-8 w-full rounded-lg py-3 text-center font-bold ${
                  plan.isPopular ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.buttonText}
              </Link>

              {/* Tombol Bayar khusus Premium */}
              {plan.name === 'Premium' && (
                <Link
                  to="/payment"
                  className="mt-4 w-full rounded-lg py-3 text-center font-bold bg-blue-500 text-white hover:bg-white-600 transition-all duration-300"
                >
                  Bayar
                </Link>
              )}

              {/* List fitur */}
              <ul className="mt-8 space-y-3 text-secondary">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Harga;
