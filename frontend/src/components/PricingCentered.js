import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Pricing() {
  const { session } = useAuth();
  const pricingPlans = [
    {
      name: "Basic",
      price: "Gratis",
      description: "Untuk memulai",
      buttonText: "Mulai Gratis",
      buttonLink: "/chat",
      features: ["Desain terbatas", "Fitur dasar", "Hingga 100 undangan"],
    },
    {
      name: "Premium",
      price: "Rp 99rb",
      period: "/bulan",
      description: "Untuk acara spesial",
      buttonText: "Pilih Paket Premium",
      buttonLink: "/premium-generator",
      isPopular: true,
      features: [
        "Semua desain premium",
        "Fitur lengkap & interaktif",
        "Hingga 500 undangan",
        "Dukungan prioritas",
      ],
    },
  ];

  const basicPlan = pricingPlans.find((plan) => plan.name === "Basic");
  const premiumPlan = pricingPlans.find((plan) => plan.name === "Premium");

  const renderPlanCard = (plan) => (
    <div
      className={`flex flex-col rounded-2xl border p-8 pricing-card ${
        plan.isPopular
          ? "border-2 border-soft-blue shadow-2xl shadow-blue-200/50"
          : "border-slate-200"
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
          <span className="text-base font-medium text-secondary">
            {plan.period}
          </span>
        )}
      </p>
      <p className="mt-1 text-secondary">{plan.description}</p>
      {plan.name === "Premium" ? (
        <Link
          to={session ? plan.buttonLink : "/login"}
          className={`mt-8 w-full rounded-lg py-3 text-center font-bold ${
            plan.isPopular ? "btn-primary" : "btn-secondary"
          }`}
        >
          {plan.buttonText}
        </Link>
      ) : session ? (
        <Link
          to={plan.buttonLink}
          className={`mt-8 w-full rounded-lg py-3 text-center font-bold ${
            plan.isPopular ? "btn-primary" : "btn-secondary"
          }`}
        >
          {plan.buttonText}
        </Link>
      ) : (
        <Link
          to="/login"
          className={`mt-8 w-full rounded-lg py-3 text-center font-bold ${
            plan.isPopular ? "btn-primary" : "btn-secondary"
          }`}
        >
          {plan.buttonText}
        </Link>
      )}
      <ul className="mt-8 space-y-3 text-secondary">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">
              check_circle
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="bg-white py-20 sm:py-24" id="pricing">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Harga yang Transparan
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Pilih paket yang paling sesuai dengan kebutuhan Anda. Tanpa biaya
            tersembunyi.
          </p>
        </div>

        {/* Two separate grids for Basic and Premium */}
        <div className="mt-16 flex justify-center gap-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8 w-full max-w-md">
            {renderPlanCard(basicPlan)}
          </div>
          <div className="grid grid-cols-1 gap-8 w-full max-w-md">
            {renderPlanCard(premiumPlan)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
