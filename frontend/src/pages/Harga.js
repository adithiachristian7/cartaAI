import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Harga() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingToken, setPendingToken] = useState(null);

  const payWithToken = (token) => {
    window.snap.pay(token, {
      onSuccess: function (result) {
        setPendingToken(null); // Hapus token jika pembayaran sukses
        navigate(
          `/payment-status?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`
        );
      },
      onPending: function (result) {
        // JANGAN NAVIGASI. Biarkan pengguna menyelesaikan pembayaran di popup.
        console.log("Payment is pending:", result);
      },
      onError: function (result) {
        setPendingToken(null); // Hapus token jika pembayaran error
        navigate(
          `/payment-status?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=failure`
        );
      },
      onClose: function () {
        // Saat popup ditutup, token tetap tersimpan di state `pendingToken`
        console.log("Popup closed, payment pending...");
      },
    });
  };

  const createNewPayment = async (plan) => {
    setLoading(true);
    setError("");

    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/payments/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: plan.planId || "premium_monthly" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Gagal membuat transaksi.");
      }

      if (data.token) {
        setPendingToken(data.token); // Simpan token baru
        payWithToken(data.token); // Langsung buka popup
      } else {
        throw new Error("Token pembayaran tidak diterima dari server.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resumePayment = () => {
    if (pendingToken) {
      payWithToken(pendingToken); // Buka lagi popup dengan token yang ada
    }
  };

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
      planId: "premium_monthly",
      isPopular: true,
      features: [
        "Semua desain premium",
        "Fitur lengkap & interaktif",
        "Hingga 500 undangan",
        "Dukungan prioritas",
      ],
    },
  ];

  return (
    <section className="bg-blue-100 py-20 sm:py-24" id="pricing">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Fitur paket yang tersedia
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Pilih paket yang paling sesuai dengan kebutuhan Anda
          </p>
          {error && <p className="mt-4 text-red-500">Error: {error}</p>}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-2xl border p-8 pricing-card ${
                plan.isPopular
                  ? "border-2 border-blue-700 shadow-2xl shadow-blue-200/50"
                  : "border-slate-200"
              }`}
            >
              {plan.isPopular && (
                <p className="">
                 
                </p>
              )}
              <h3 className="text-lg font-semibold text-primary">
                {plan.name}
              </h3>
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
                pendingToken ? (
                  <button
                    onClick={resumePayment}
                    disabled={loading}
                    className="mt-8 w-full rounded-lg py-3 text-center font-bold btn-primary disabled:bg-blue-400 bg-green-500 hover:bg-green-600"
                  >
                    Lanjutkan Pembayaran
                  </button>
                ) : (
                  <button
                    onClick={() => createNewPayment(plan)}
                    disabled={loading}
                    className="mt-8 w-full rounded-lg py-3 text-center font-bold btn-primary disabled:bg-blue-400"
                  >
                    {loading ? "Memproses..." : plan.buttonText}
                  </button>
                )
              ) : (
                <Link
                  to={plan.buttonLink}
                  className="mt-8 w-full rounded-lg py-3 text-center font-bold btn-primary"
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default Harga;
