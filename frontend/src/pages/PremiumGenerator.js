import React, { useState } from "react";
import { Link } from 'react-router-dom';

function PremiumGenerator() {
  const [formData, setFormData] = useState({
    namaMempelaiPria: "",
    namaMempelaiWanita: "",
    tanggalAcara: "",
    waktuAcara: "",
    lokasiAcara: "",
    waktuResepsi: "",
    tempatResepsi: "",
    fotoMempelaiPria: null,
    fotoMempelaiWanita: null,
    galeriFoto: [],
    temaWarna: "",
    jenisUndangan: "",
    catatanKhusus: ""
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Selamat datang di Generator Undangan Premium! Silakan lengkapi form di bawah ini dengan detail acara pernikahan Anda. Setelah itu, AI akan membantu membuat undangan yang sempurna.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'galeriFoto') {
      setFormData(prev => ({
        ...prev,
        [name]: Array.from(files)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['namaMempelaiPria', 'namaMempelaiWanita', 'tanggalAcara', 'lokasiAcara'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert("Mohon lengkapi field yang wajib diisi: " + missingFields.join(", "));
      return;
    }

    setShowChat(true);

    // Create initial message with form data
    const formSummary = `Saya ingin membuat undangan pernikahan premium dengan detail berikut:

👰 Mempelai Wanita: ${formData.namaMempelaiWanita}
🤵 Mempelai Pria: ${formData.namaMempelaiPria}
📅 Tanggal: ${formData.tanggalAcara}
⏰ Waktu: ${formData.waktuAcara || 'Belum ditentukan'}
📍 Lokasi: ${formData.lokasiAcara}
⏰ Waktu Resepsi: ${formData.waktuResepsi || 'Belum ditentukan'}
📍 Tempat Resepsi: ${formData.tempatResepsi || 'Belum ditentukan'}
🎨 Tema: ${formData.temaWarna || 'Default'}
📝 Catatan: ${formData.catatanKhusus || 'Tidak ada'}

${formData.fotoMempelaiPria ? '✅ Foto mempelai pria tersedia' : '❌ Foto mempelai pria belum diupload'}
${formData.fotoMempelaiWanita ? '✅ Foto mempelai wanita tersedia' : '❌ Foto mempelai wanita belum diupload'}
${formData.galeriFoto.length > 0 ? `✅ ${formData.galeriFoto.length} foto pre-wedding tersedia` : '❌ Galeri foto pre-wedding kosong'}`;

    setMessages(prev => [...prev, {
      id: messages.length + 1,
      type: "user",
      content: formSummary
    }]);

    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: `Terima kasih atas detail lengkap yang Anda berikan! 🎉

Saya akan membuat undangan pernikahan premium berdasarkan informasi yang telah Anda isi. Berikut yang akan saya lakukan:

✨ **Langkah-langkah pembuatan:**
1. **Desain Premium** - Membuat template undangan dengan kualitas tinggi
2. **Personalisasi** - Menyesuaikan dengan nama mempelai dan detail acara
3. **Integrasi Foto** - Memasukkan foto mempelai dan galeri pre-wedding
4. **Optimasi Layout** - Memastikan tampilan sempurna di semua device
5. **Preview Digital** - Menyediakan preview interaktif

🎨 **Fitur Premium yang akan disertakan:**
- Template eksklusif dengan animasi halus
- Integrasi peta lokasi interaktif
- Galeri foto pre-wedding yang dapat di-scroll
- Musik latar yang dapat dikustomisasi
- RSVP system terintegrasi
- Export dalam berbagai format (PDF, PNG, HTML)

⏱️ **Estimasi waktu:** 3-5 menit untuk pembuatan awal

Apakah ada detail tambahan yang ingin Anda tambahkan atau ubah sebelum saya mulai membuat undangan? Misalnya:
- Preferensi warna tertentu
- Gaya undangan (klasik, modern, rustic, minimalist)
- Jumlah undangan yang dibutuhkan
- Fitur khusus lainnya`,
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: `Baik! Saya akan menyesuaikan undangan premium sesuai permintaan Anda.

Untuk undangan premium Anda, saya akan:
✅ Menggunakan template eksklusif dengan fitur premium
✅ Mengintegrasikan semua foto yang telah diupload
✅ Menambahkan elemen interaktif dan animasi
✅ Memastikan responsive design untuk semua device
✅ Menyediakan opsi export dalam format berkualitas tinggi

Apakah Anda ingin saya lanjutkan dengan pembuatan undangan sekarang, atau ada detail lain yang perlu disesuaikan terlebih dahulu?`,
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              <span className="material-symbols-outlined">workspace_premium</span>
              PREMIUM GENERATOR
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Generator Undangan Pernikahan Premium
            </h1>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Buat undangan pernikahan eksklusif dengan fitur premium. Lengkapi form di bawah ini dan biarkan AI membuat undangan yang tak terlupakan.
            </p>
          </div>

          {!showChat ? (
            /* Generator Form */
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-soft-blue to-blue-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Detail Acara Pernikahan</h2>
                <p className="text-blue-950">Lengkapi informasi di bawah ini untuk membuat undangan premium</p>
              </div>

              <form onSubmit={handleGenerate} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Required Fields */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary border-b pb-2">Informasi Wajib</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Mempelai Wanita <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaMempelaiWanita"
                        value={formData.namaMempelaiWanita}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                        placeholder="Masukkan nama mempelai wanita"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Mempelai Pria <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaMempelaiPria"
                        value={formData.namaMempelaiPria}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                        placeholder="Masukkan nama mempelai pria"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Acara <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalAcara"
                        value={formData.tanggalAcara}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waktu Acara
                      </label>
                      <input
                        type="time"
                        name="waktuAcara"
                        value={formData.waktuAcara}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Acara <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="lokasiAcara"
                        value={formData.lokasiAcara}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                        placeholder="Masukkan alamat lengkap lokasi acara"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waktu Resepsi
                      </label>
                      <input
                        type="time"
                        name="waktuResepsi"
                        value={formData.waktuResepsi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempat Resepsi
                      </label>
                      <textarea
                        name="tempatResepsi"
                        value={formData.tempatResepsi}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                        placeholder="Masukkan alamat lengkap lokasi resepsi"
                      />
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary border-b pb-2">Informasi Tambahan</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tema Warna
                      </label>
                      <select
                        name="temaWarna"
                        value={formData.temaWarna}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                      >
                        <option value="">Pilih tema warna</option>
                        <option value="classic-gold">Classic Gold</option>
                        <option value="navy-blue">Navy Blue</option>
                        <option value="rose-pink">Rose Pink</option>
                        <option value="forest-green">Forest Green</option>
                        <option value="purple-royal">Purple Royal</option>
                        <option value="sunset-orange">Sunset Orange</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Undangan
                      </label>
                      <select
                        name="jenisUndangan"
                        value={formData.jenisUndangan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                      >
                        <option value="">Pilih jenis undangan</option>
                        <option value="classic">Klasik Elegan</option>
                        <option value="modern">Modern Minimalis</option>
                        <option value="rustic">Rustic Natural</option>
                        <option value="luxury">Luxury Premium</option>
                        <option value="vintage">Vintage Retro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Mempelai Wanita
                      </label>
                      <input
                        type="file"
                        name="fotoMempelaiWanita"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Mempelai Pria
                      </label>
                      <input
                        type="file"
                        name="fotoMempelaiPria"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Galeri Foto Pre-Wedding (maksimal 10 foto)
                      </label>
                      <input
                        type="file"
                        name="galeriFoto"
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600"
                      />
                      {formData.galeriFoto.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          {formData.galeriFoto.length} foto dipilih
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan Khusus
                      </label>
                      <textarea
                        name="catatanKhusus"
                        value={formData.catatanKhusus}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                        placeholder="Tambahkan catatan khusus atau permintaan lainnya..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-soft-blue to-blue-600 text-slate-800 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="material-symbols-outlined mr-2">auto_awesome</span>
                    Generate Undangan Premium
                  </button>
                  <Link
                    to="/chat"
                    className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-300 transition-all duration-300 text-center"
                  >
                    <span className="material-symbols-outlined mr-2">chat</span>
                    Kembali ke Chat Biasa
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            /* Chat Interface */
            <div className="space-y-6">
              {/* Chat Container */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-soft-blue to-blue-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-soft-blue">
                        workspace_premium
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI Premium Generator</h3>
                      <p className="text-blue-100 text-sm">
                        Siap membuat undangan premium untuk Anda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-soft-blue to-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Membuat undangan premium...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t p-6">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ketik permintaan tambahan atau revisi..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-soft-blue to-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setShowChat(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2">edit</span>
                  Edit Form
                </button>
                <Link
                  to="/chat"
                  className="bg-soft-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2">chat</span>
                  Chat Biasa
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PremiumGenerator;
