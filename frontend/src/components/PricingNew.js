import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

function Pricing() {
  const { session } = useAuth();
  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Gratis',
      description: 'Untuk memulai',
      buttonText: 'Mulai Gratis',
      buttonLink: '/chat',
      icon: 'card_giftcard',
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
      buttonLink: '/login',
      isPopular: true,
      icon: 'star',
      features: [
        'Semua desain premium',
        'Fitur lengkap & interaktif',
        'Hingga 500 undangan',
        'Dukungan prioritas'
      ]
    }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-24" id="pricing">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Harga yang Transparan
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Pilih paket yang paling sesuai dengan kebutuhan Anda. Tanpa biaya tersembunyi.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:scale-105 pricing-card-enhanced ${
                plan.isPopular
                  ? 'border-2 border-soft-blue shadow-2xl shadow-blue-200/50 bg-gradient-to-br from-white to-blue-50 premium-card-glow'
                  : 'border-slate-200 bg-white shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-soft-blue to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                    <span className="material-symbols-outlined text-base mr-1 icon-pulse">star</span>
                    Terpopuler
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl ${
                    plan.isPopular
                      ? 'bg-gradient-to-br from-soft-blue to-blue-600 text-white'
                      : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">{plan.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <p className="text-5xl font-bold text-primary">{plan.price}</p>
                  {plan.period && (
                    <span className="text-lg font-medium text-secondary ml-2">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-secondary">{plan.description}</p>
              </div>

              {plan.name === 'Premium' ? (
                <Link
                  to={session ? '/premium-generator' : '/login'}
                  className={`w-full rounded-2xl py-4 px-6 text-center font-bold transition-all duration-300 btn-pricing ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-soft-blue to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-white border-2 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              ) : session ? (
                <Link
                  to={plan.buttonLink}
                  className={`w-full rounded-2xl py-4 px-6 text-center font-bold transition-all duration-300 btn-pricing ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-soft-blue to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-white border-2 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`w-full rounded-2xl py-4 px-6 text-center font-bold transition-all duration-300 btn-pricing ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-soft-blue to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-white border-2 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              )}

              <ul className="mt-8 space-y-4 text-secondary">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3 feature-item">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-green-600">check</span>
                    </span>
                    <span className="text-sm">{feature}</span>
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

export default Pricing;
