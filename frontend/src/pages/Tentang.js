import React from "react";

function Tentang() {
  const teamMembers = [
    { name: "Prince", role: "CEO & Founder", image: "/assets/prince.jpg" },
    {
      name: "Adriel",
      role: "Lead Developer",
      image: "/assets/adriel.jpg",
    },
    { name: "Julio", role: "AI Specialist", image: "/assets/julio.jpg" },
    { name: "Adith", role: "UI/UX Designer", image: "/assets/adith.jpg" },
    {
      name: "Sandro",
      role: "Marketing Manager",
      image: "/assets/sandro.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-64 md:h-[400px]"
        style={{ backgroundImage: "url('/assets/bg_hero1.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="container mx-auto text-center text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"></span>
            </h1>
          </div>
        </div>
      </div>

      {/* Opening Statement */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-600">cartaAI</span> hadir
            untuk membantu pasangan calon pengantin menciptakan undangan
            pernikahan yang personal, elegan, dan unik dengan bantuan teknologi
            kecerdasan buatan. Kami percaya, setiap kisah cinta layak diabadikan
            dalam undangan yang istimewa.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-16 bg-gradient-to-br from-blue-50/60 to-purple-50/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-2xl">
                  visibility
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Visi Kami
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi solusi modern untuk undangan pernikahan yang memadukan
                keindahan desain, personalisasi, dan efisiensi teknologi AI.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-2xl">
                  flag
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Misi Kami
              </h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5 text-lg">
                    check
                  </span>
                  <span>
                    Memberikan pengalaman mudah dan cepat dalam membuat undangan
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5 text-lg">
                    check
                  </span>
                  <span>
                    Menyediakan desain yang elegan dan dapat dipersonalisasi
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5 text-lg">
                    check
                  </span>
                  <span>
                    Menghadirkan undangan digital maupun cetak yang ramah
                    lingkungan
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose cartaAI */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
              cartaAI
            </span>
            ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menghadirkan solusi modern untuk undangan pernikahan impian
            Anda
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "bolt",
              title: "Cepat & Hemat Biaya",
              desc: "Hanya dengan beberapa klik, undangan siap dibagikan tanpa biaya cetak berlebihan.",
            },
            {
              icon: "brush",
              title: "Desain Unik",
              desc: "Didukung AI untuk menghasilkan desain kreatif sesuai tema pernikahan Anda.",
            },
            {
              icon: "account_circle",
              title: "Personalisasi Maksimal",
              desc: "Setiap undangan bisa disesuaikan dengan cerita cinta dan gaya Anda.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-white text-2xl">
                  {item.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How cartaAI Works */}
      <div className="py-16 bg-gradient-to-br from-pink-50/50 to-purple-50/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bagaimana{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-700">
              cartaAI
            </span>{" "}
            Bekerja?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Proses mudah dan cepat untuk membuat undangan impian Anda
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              step: 1,
              title: "Pilih Tema",
              desc: "Klasik, modern, rustic, atau custom sesuai selera.",
            },
            {
              step: 2,
              title: "Masukkan Detail",
              desc: "Nama pasangan, tanggal, lokasi, dan pesan spesial.",
            },
            {
              step: 3,
              title: "AI Generate",
              desc: "AI merancang undangan berdasarkan preferensi Anda.",
            },
            {
              step: 4,
              title: "Bagikan",
              desc: "Undangan digital siap dikirim atau dicetak.",
            },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tim{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-700">
              cartaAI
            </span>{" "}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tim ahli yang berdedikasi untuk mewujudkan undangan pernikahan
            impian Anda
          </p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group text-center transform transition-transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-2xl w-32 h-32 mx-auto mb-4 shadow-md border-2 border-white">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: member.objectPosition }}
                  onError={(e) => {
                    e.target.src = "/assets/team/default-avatar.png";
                  }}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tentang;
