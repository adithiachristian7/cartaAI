import React from 'react';
import { Link } from 'react-router-dom';

function Tentang() {
  // data tim
  const teamMembers = [
    { name: 'Prince', role: 'CEO & Founder' },
    { name: 'Adriel', role: 'Lead Developer' },
    { name: 'Julio', role: 'AI Specialist' },
    { name: 'Adith', role: 'UI/UX Designer' },
    { name: 'Sandro', role: 'Marketing Manager' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-100 to-purple-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">cartaAI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Mewujudkan Undangan Impian dengan Sentuhan AI
          </p>
        </div>
      </div>

      {/* Opening Statement */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              <span className="font-semibold text-blue-600">cartaAI</span> hadir untuk membantu pasangan calon pengantin
              menciptakan undangan pernikahan yang personal, elegan, dan unik dengan bantuan teknologi kecerdasan buatan.
              Kami percaya, setiap kisah cinta layak diabadikan dalam undangan yang istimewa.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-2xl">visibility</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Visi Kami</h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi solusi modern untuk undangan pernikahan yang memadukan keindahan desain,
                personalisasi, dan efisiensi teknologi AI.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-2xl">flag</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Misi Kami</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-blue-500 mr-2 mt-1 text-sm">check_circle</span>
                  Memberikan pengalaman mudah dan cepat dalam membuat undangan
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-blue-500 mr-2 mt-1 text-sm">check_circle</span>
                  Menyediakan desain yang elegan dan dapat dipersonalisasi
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-blue-500 mr-2 mt-1 text-sm">check_circle</span>
                  Menghadirkan undangan digital maupun cetak yang ramah lingkungan
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose cartaAI */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">cartaAI</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menghadirkan solusi modern untuk undangan pernikahan impian Anda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-2xl">flash_on</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cepat, Praktis dan hemat biaya</h3>
              <p className="text-gray-600">Hanya dengan beberapa klik, undangan siap dibagikan</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-2xl">palette</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Desain Unik</h3>
              <p className="text-gray-600">Didukung AI untuk menghasilkan desain kreatif sesuai tema pernikahan</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-2xl">person</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Personalisasi Maksimal</h3>
              <p className="text-gray-600">Setiap undangan bisa disesuaikan dengan cerita cinta Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* How cartaAI Works */}
      <div className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bagaimana <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">cartaAI</span> Bekerja?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proses mudah dan cepat untuk membuat undangan impian Anda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Pilih Tema</h3>
              <p className="text-gray-600">Pilih tema pernikahan (klasik, modern, rustic, dll)</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Masukkan Detail</h3>
              <p className="text-gray-600">Masukkan detail acara (nama pasangan, tanggal, lokasi)</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">AI Generate</h3>
              <p className="text-gray-600">AI akan menghasilkan desain undangan sesuai preferensi</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Bagikan</h3>
              <p className="text-gray-600">Bagikan undangan digital atau cetak dengan mudah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tim Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tim ahli yang berdedikasi untuk mewujudkan undangan pernikahan impian Anda
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Tentang;
