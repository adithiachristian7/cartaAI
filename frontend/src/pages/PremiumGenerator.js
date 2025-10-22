import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar

// --- FUNGSI BARU UNTUK UPLOAD ASSETS ---
/**
 * Meng-upload semua file aset (gambar, musik) ke Supabase Storage.
 * @param {object} files - Objek berisi file dari formData.
 * @param {string} userId - ID pengguna untuk membuat folder unik.
 * @returns {Promise<object>} Objek berisi URL publik dari file yang diupload.
 */
const uploadAssets = async (files, userId) => {
  const uploadedUrls = {};
  const bucketName = 'invitation-assets';

  // Fungsi helper untuk upload satu file
  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const filePath = `${userId}/${folder}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
    if (error) {
      throw new Error(`Gagal meng-upload ${file.name}: ${error.message}`);
    }
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Upload foto mempelai wanita
  if (files.fotoMempelaiWanita) {
    uploadedUrls.fotoMempelaiWanita = await uploadFile(files.fotoMempelaiWanita, 'bride');
  }
  // Upload foto mempelai pria
  if (files.fotoMempelaiPria) {
    uploadedUrls.fotoMempelaiPria = await uploadFile(files.fotoMempelaiPria, 'groom');
  }
  // Upload musik
  if (files.musik) {
    uploadedUrls.musik = await uploadFile(files.musik, 'music');
  }
  // Upload galeri foto
  if (files.galeriFoto && files.galeriFoto.length > 0) {
    uploadedUrls.galeriFoto = await Promise.all(
      files.galeriFoto.map(file => uploadFile(file, 'gallery'))
    );
  }

  return uploadedUrls;
};


/**
 * Menyimpan metadata undangan ke database.
 * @param {object} invitationData - Objek berisi data form DAN URL aset.
 * @returns {Promise<object|null>} Objek undangan yang baru dibuat.
 */
const saveInvitationData = async (invitationData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User tidak ditemukan.");

  // URL undangan tidak lagi dibuat di sini. Hanya slug yang dibuat.
  const randomString = Math.random().toString(36).substring(2, 8);
  const slug = `${invitationData.namaMempelaiPria || 'undangan'}-${randomString}`.toLowerCase().replace(/\s+/g, '-');

  const newInvitation = {
    user_id: user.id,
    template_id: null, // atau dari form jika ada
    prompt: `Undangan untuk ${invitationData.namaMempelaiPria} dan ${invitationData.namaMempelaiWanita}`,
    generated_content: invitationData, // Data form + URL Aset
    slug: slug,
    // 'invitation_url' dan 'generated_html_url' akan diisi oleh backend
  };

  const { data: savedInvitation, error: insertError } = await supabase
    .from('invitations')
    .insert(newInvitation)
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') { // Error duplikat slug
      throw new Error("Gagal membuat link unik, silakan coba generate lagi.");
    }
    throw insertError;
  }

  return savedInvitation; // Mengembalikan record yang baru dibuat (termasuk slug)
};


function PremiumGenerator() {
  const [formData, setFormData] = useState({
    namaMempelaiPria: "",
    namaAyahMempelaiPria: "",
    namaIbuMempelaiPria: "",
    namaMempelaiWanita: "",
    namaAyahMempelaiWanita: "",
    namaIbuMempelaiWanita: "",
    tanggalAcara: "",
    waktuAcara: "",
    lokasiAcara: "",
    waktuResepsi: "",
    tempatResepsi: "",
    fotoMempelaiPria: null,
    fotoMempelaiWanita: null,
    galeriFoto: [],
    musik: null, // State baru untuk musik
    temaWarna: "",
    jenisUndangan: "",
    catatanKhusus: ""
  });

  const [previews, setPreviews] = useState({
    fotoMempelaiPria: null,
    fotoMempelaiWanita: null,
    galeriFoto: [],
    musik: null
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Selamat datang! Lengkapi form, dan saya akan membuat undangan premium untuk Anda, lengkap dengan upload aset.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'galeriFoto') {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, [name]: [...prev.galeriFoto, ...newFiles] }));
      setPreviews(prev => ({ ...prev, [name]: [...prev.galeriFoto, ...newPreviews] }));
    } else {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, [name]: file }));
        if (name === 'musik') {
          setPreviews(prev => ({ ...prev, [name]: file.name }));
        } else {
          setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
        }
      }
    }
  };

  const handleFileDelete = (name, index = null) => {
    if (index !== null) {
      const newFiles = [...formData.galeriFoto];
      const newPreviews = [...previews.galeriFoto];
      URL.revokeObjectURL(newPreviews[index]);
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);
      setFormData(prev => ({ ...prev, galeriFoto: newFiles }));
      setPreviews(prev => ({ ...prev, galeriFoto: newPreviews }));
    } else {
      if (previews[name] && typeof previews[name] === 'string' && previews[name].startsWith('blob:')) {
        URL.revokeObjectURL(previews[name]);
      }
      setFormData(prev => ({ ...prev, [name]: null }));
      setPreviews(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGeneratedLink('');

    const requiredFields = ['namaMempelaiPria', 'namaMempelaiWanita', 'tanggalAcara', 'lokasiAcara'];
    if (requiredFields.some(field => !formData[field])) {
      alert("Mohon lengkapi field yang wajib diisi: " + requiredFields.filter(field => !formData[field]).join(", "));
      return;
    }

    setShowChat(true);
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Anda harus login untuk membuat undangan.");
      setIsLoading(false);
      return;
    }

    try {
      // --- ALUR BARU ---
      // 1. Upload semua aset
      setLoadingMessage("Meng-upload gambar dan musik...");
      const assetUrls = await uploadAssets({
        fotoMempelaiPria: formData.fotoMempelaiPria,
        fotoMempelaiWanita: formData.fotoMempelaiWanita,
        galeriFoto: formData.galeriFoto,
        musik: formData.musik
      }, user.id);

      // 2. Siapkan data final untuk database
      const dataForDb = {
        ...formData,
        ...assetUrls, // Ganti file object dengan URL
      };
      // Hapus file object dari data final
      delete dataForDb.fotoMempelaiPria;
      delete dataForDb.fotoMempelaiWanita;
      delete dataForDb.galeriFoto;
      delete dataForDb.musik;


      // 3. Simpan metadata awal ke database (tanpa URL final)
      setLoadingMessage("Menyimpan data undangan...");
      const savedInvitation = await saveInvitationData(dataForDb);
      
      // 4. Panggil backend untuk generate file HTML
      setLoadingMessage("Menghubungi AI untuk membuat file undangan...");
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      
      const dataForBackend = {
        ...dataForDb,
        slug: savedInvitation.slug, // Kirim slug yang sudah dibuat ke backend
      };

      const response = await fetch(`${backendUrl}/invitations/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForBackend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Error dari Backend: ${errorData?.detail || response.statusText}`);
      }

      const result = await response.json();
      
      // **PERBAIKAN UTAMA**: Gunakan URL dari respons backend
      const finalUrl = result.invitation_public_url;

      if (!finalUrl) {
        throw new Error("Backend tidak mengembalikan URL undangan.");
      }

      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        // **PERBAIKAN UTAMA**: Tampilkan link yang bisa diklik
        content: `🎉 Berhasil! Proses selesai.

Silakan klik link di bawah untuk melihat undangan Anda:
<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">Lihat Undangan: ${savedInvitation.slug}</a>`,
      };
      setMessages(prev => [...prev, botResponse]);
      setGeneratedLink(finalUrl); // Simpan URL yang benar

    } catch (error) {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: `Maaf, terjadi kesalahan:

${error.message}

Silakan coba lagi.`,
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // ... (sisa komponen JSX tidak berubah secara signifikan, hanya penambahan input musik)
  // Saya akan memasukkan kode JSX yang sudah diperbarui di bawah ini

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
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-soft-blue to-blue-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-blue-950">Detail Acara Pernikahan</h2>
                <p className="text-blue-950">Lengkapi informasi di bawah ini untuk membuat undangan premium</p>
              </div>

              <form onSubmit={handleGenerate} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Kolom Informasi Wajib */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary border-b pb-2">Informasi Wajib</h3>
                    {/* Input nama, tanggal, lokasi, dll. seperti sebelumnya */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Mempelai Pria <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="namaMempelaiPria" value={formData.namaMempelaiPria} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan nama mempelai pria" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ayah Mempelai Pria
                      </label>
                      <input type="text" name="namaAyahMempelaiPria" value={formData.namaAyahMempelaiPria} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan nama ayah mempelai pria" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ibu Mempelai Pria
                      </label>
                      <input type="text" name="namaIbuMempelaiPria" value={formData.namaIbuMempelaiPria} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan nama ibu mempelai pria" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Mempelai Wanita <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="namaMempelaiWanita" value={formData.namaMempelaiWanita} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan nama mempelai wanita" required />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ayah Mempelai Wanita
                      </label>
                      <input type="text" name="namaAyahMempelaiWanita" value={formData.namaAyahMempelaiWanita} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan nama ayah mempelai wanita" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ibu Mempelai Wanita
                      </label>
                      <input type="text" name="namaIbuMempelaiWanita" value={formData.namaIbuMempelaiWanita} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan nama ibu mempelai wanita" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Acara <span className="text-red-500">*</span>
                      </label>
                      <input type="date" name="tanggalAcara" value={formData.tanggalAcara} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waktu Acara
                      </label>
                      <input type="time" name="waktuAcara" value={formData.waktuAcara} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Acara <span className="text-red-500">*</span>
                      </label>
                      <textarea name="lokasiAcara" value={formData.lokasiAcara} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan alamat lengkap lokasi acara" required />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waktu Resepsi
                      </label>
                      <input type="time" name="waktuResepsi" value={formData.waktuResepsi} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempat Resepsi
                      </label>
                      <textarea name="tempatResepsi" value={formData.tempatResepsi} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Masukkan alamat lengkap lokasi resepsi" />
                    </div>
                  </div>

                  {/* Kolom Informasi Tambahan & Aset */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary border-b pb-2">Informasi Tambahan & Aset</h3>
                    {/* Input tema, jenis, dll. seperti sebelumnya */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tema Warna
                      </label>
                      <select
                        name="temaWarna"
                        value={formData.temaWarna}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Musik Latar</label>
                      {!previews.musik ? (
                        <input type="file" name="musik" onChange={handleFileChange} accept="audio/mp3" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600" />
                      ) : (
                        <div className="mt-2 p-2 border rounded-lg flex items-center justify-between">
                          <span className="text-sm text-gray-600">{previews.musik}</span>
                          <button type="button" onClick={() => handleFileDelete('musik')} className="text-sm text-red-600 hover:underline">Hapus</button>
                        </div>
                      )}
                    </div>
                    {/* ... input file lainnya ... */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Mempelai Pria
                      </label>
                      {!previews.fotoMempelaiPria ? (
                        <input type="file" name="fotoMempelaiPria" onChange={handleFileChange} accept="image/*" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600" />
                      ) : (
                        <div className="mt-2 p-2 border rounded-lg"><img src={previews.fotoMempelaiPria} alt="Preview" className="w-24 h-24 object-cover rounded-md" /><button type="button" onClick={() => handleFileDelete('fotoMempelaiPria')} className="text-sm text-red-600 hover:underline mt-2">Hapus</button></div>
                      )}
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Mempelai Wanita
                      </label>
                      {!previews.fotoMempelaiWanita ? (
                        <input type="file" name="fotoMempelaiWanita" onChange={handleFileChange} accept="image/*" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600" />
                      ) : (
                        <div className="mt-2 p-2 border rounded-lg"><img src={previews.fotoMempelaiWanita} alt="Preview" className="w-24 h-24 object-cover rounded-md" /><button type="button" onClick={() => handleFileDelete('fotoMempelaiWanita')} className="text-sm text-red-600 hover:underline mt-2">Hapus</button></div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Galeri Foto Pre-Wedding
                      </label>
                      <input type="file" name="galeriFoto" onChange={handleFileChange} accept="image/*" multiple className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-soft-blue file:text-white hover:file:bg-blue-600" />
                      {previews.galeriFoto.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {previews.galeriFoto.map((preview, index) => (
                            <div key={index} className="relative"><img src={preview} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded-md" /><button type="button" onClick={() => handleFileDelete('galeriFoto', index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">X</button></div>
                          ))}
                        </div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="Tambahkan catatan khusus atau permintaan lainnya..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-soft-blue to-blue-600 text-slate-800 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined mr-2">auto_awesome</span>
                    {isLoading ? loadingMessage || 'Memproses...' : 'Generate Undangan Premium'}
                  </button>
                  <Link
                    to="/chat"
                    className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-300 transition-all duration-300 text-center flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined mr-2">chat</span>
                    Kembali ke Chat Biasa
                  </Link>
                </div>
              </form>
            </div>
          ) : (
             <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}>
                        <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }} />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="text-sm text-gray-500">{loadingMessage || "Memproses..."}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => setShowChat(false)} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold">
                  Edit Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PremiumGenerator;