// src/pages/Tentang.js
import React, { useState, useEffect } from "react";

function Tentang() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers = [
    {
      name: "Prince",
      role: "Project Manager",
      image: "/assets/prince.jpg",
      bio: "Visioner di balik cartaAI.",
    },
    {
      name: "Adriel",
      role: "Lead Developer & AI Specialist",
      image: "/assets/adriel.jpg",
      bio: "Memimpin pengembangan solusi berbasis AI yang menyatukan kecerdasan mesin dengan pengalaman pengguna yang intuitif dan responsif.",
      isLead: true,
    },
    {
      name: "Julio",
      role: "AI Specialist & Backend Developer",
      image: "/assets/julio.jpg",
      bio: "Sebagai AI Specialist dan Backend Developer, saya berfokus merancang sistem cerdas yang scalable dan siap menghadirkan pengalaman real-time yang optimal.",
    },
    {
      name: "Adith",
      role: "UI/UX & Frontend Developer",
      image: "/assets/adith.jpg",
      bio: "Menciptakan pengalaman digital yang intuitif dan estetis, di mana setiap interaksi terasa alami dan bermakna.",
    },
    {
      name: "Andro",
      role: "Marketing Manager",
      image: "/assets/sandro.jpg",
      bio: "Menciptakan strategi pemasaran yang menggabungkan kreativitas dan analisis untuk hasil yang nyata dan berkelanjutan.",
    },
  ];

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 overflow-x-hidden relative transition-colors duration-300">
      {/* Subtle noise texture (light, non-distracting) */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Hero Section - Restyled with brand gradient */}
      <div
        className="relative bg-center bg-no-repeat flex items-end min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
        style={{
          backgroundImage: "url('/assets/bg_hero1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "scroll",
        }}
      >
        {/* Overlay: dark gradient + noise */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 w-full px-6 pb-12">
          <div className="container mx-auto text-center text-white"></div>
        </div>
      </div>

      {/* Opening Statement - Restyled */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-gray-900 dark:to-gray-900 rounded-full mx-auto"></div>
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 shadow-md"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
              cartaAI
            </span>{" "}
            hadir untuk membantu pasangan calon pengantin menciptakan undangan
            pernikahan yang personal, elegan, dan unik — dengan kekuatan AI yang
            dipadukan dengan sentuhan manusiawi. Kami percaya:{" "}
            <span className="italic">
              setiap kisah cinta layak diabadikan dalam undangan yang tak
              terlupakan.
            </span>
          </p>
        </div>
      </div>

      {/* Vision & Mission - Restyled with brand gradient borders */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Visi Kami",
                icon: "visibility",
                gradient:
                  "from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400",
                desc: "Menjadi solusi terdepan untuk undangan pernikahan digital yang menggabungkan keindahan desain, personalisasi mendalam, dan kecanggihan AI — tanpa kompromi pada makna.",
              },
              {
                title: "Misi Kami",
                icon: "flag",
                gradient: "from-purple-600 to-indigo-600",
                desc: "Memberikan pengalaman pembuatan undangan dalam 3 menit, desain eksklusif (bukan template), dan pilihan digital/cetak premium yang ramah lingkungan.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full shadow-xl">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md ${
                      i === 0 ? "bg-indigo-600" : "bg-purple-600"
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-2xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    {item.title}
                    <span
                      className="w-8 h-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #667eea, #764ba2)`,
                      }}
                    ></span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us - Restyled with brand aksen */}
      <div className="py-16 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-gray-900 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mengapa{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              cartaAI
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kami bukan hanya alat — kami mitra dalam merayakan kisah cinta Anda.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "bolt",
              title: "⚡ Cepat & Hemat",
              desc: "Dari ide ke undangan siap kirim hanya dalam hitungan menit — tanpa biaya cetak berlebihan.",
            },
            {
              icon: "brush",
              title: "🎨 Desain Unik",
              desc: "AI kami belajar dari ribuan desain premium untuk menghasilkan karya yang benar-benar orisinal.",
            },
            {
              icon: "account_circle",
              title: "❤️ Personalisasi",
              desc: "Setiap detail — dari font hingga ilustrasi — mencerminkan kepribadian dan kisah Anda.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-7 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works - Restyled with step badge gradient */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900  dark:text-white mb-4">
            Cara Kerja{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              cartaAI
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sederhana, cepat, dan penuh kejutan indah.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { step: 1, icon: "palette", title: "Pilih Tema" },
            { step: 2, icon: "text_fields", title: "Masukkan Detail" },
            { step: 3, icon: "auto_awesome", title: "AI Generate" },
            { step: 4, icon: "share", title: "Bagikan" },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center group relative transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <span className="material-symbols-outlined text-xl font-normal">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm max-w-[200px] mx-auto">
                  {item.title === "Pilih Tema"
                    ? "Klasik, modern, rustic, atau custom sesuai selera."
                    : item.title === "Masukkan Detail"
                    ? "Nama pasangan, tanggal, lokasi, dan pesan spesial."
                    : item.title === "AI Generate"
                    ? "AI merancang undangan berdasarkan preferensi Anda."
                    : "Undangan digital siap dikirim atau dicetak."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section - Restyled with conic border & highlight */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50/10 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tim di Balik{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              cartaAI
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kami bukan hanya tim — kami keluarga yang percaya pada kekuatan
            cinta & teknologi.
          </p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="text-center group transform transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <div
                className="relative w-36 h-36 mx-auto mb-4 cursor-pointer rounded-2xl overflow-visible"
                onClick={() => openModal(member)}
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "3px",
                  }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      style={{ display: "block" }}
                      onError={(e) => {
                        e.target.src = "/assets/team/default-avatar.png";
                        console.error(`Failed to load image: ${member.image}`);
                      }}
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Modal - with brand gradient header */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient header bar */}
            <div
              className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl"
              style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
              }}
            ></div>

            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-300 text-2xl font-light transition-colors"
              onClick={closeModal}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center mt-2">
              <div className="relative inline-block mb-6">
                <div
                  className="w-48 h-48 rounded-2xl mx-auto relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "3px",
                  }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 relative">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover rounded-xl"
                      style={{ display: "block" }}
                      onError={(e) => {
                        e.target.src = "/assets/team/default-avatar.png";
                        console.error(
                          `Failed to load image: ${selectedMember.image}`
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {selectedMember.name}
              </h3>
              <p className="text-indigo-600 font-medium mb-4">
                {selectedMember.role}
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {selectedMember.bio}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Button Classes (inline for portability) */}
      <style jsx>{`
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transition: all 0.3s ease;
          transform: translateY(0);
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </div>
  );
}

export default Tentang;
