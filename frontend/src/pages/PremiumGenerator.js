import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const uploadAssets = async (files, userId) => {
  const uploadedUrls = {};
  const bucketName = "invitation-assets";
  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${userId}/${folder}/${Date.now()}-${sanitizedName}`;
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
    if (error) {
      throw new Error(`Gagal meng-upload ${file.name}: ${error.message}`);
    }
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };
  if (files.fotoMempelaiWanita) {
    uploadedUrls.fotoMempelaiWanita = await uploadFile(
      files.fotoMempelaiWanita,
      "bride"
    );
  }
  if (files.fotoMempelaiPria) {
    uploadedUrls.fotoMempelaiPria = await uploadFile(
      files.fotoMempelaiPria,
      "groom"
    );
  }
  if (files.musik) {
    uploadedUrls.musik = await uploadFile(files.musik, "music");
  }
  if (files.galeriFoto && files.galeriFoto.length > 0) {
    uploadedUrls.galeriFoto = await Promise.all(
      files.galeriFoto.map((file) => uploadFile(file, "gallery"))
    );
  }
  return uploadedUrls;
};

const saveInvitationData = async (invitationData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User tidak ditemukan.");
  const randomString = Math.random().toString(36).substring(2, 8);
  const slug = `${
    invitationData.namaMempelaiPria || "undangan"
  }-${randomString}`
    .toLowerCase()
    .replace(/\s+/g, "-");
  const newInvitation = {
    user_id: user.id,
    template_id: null,
    prompt: `Undangan untuk ${invitationData.namaMempelaiPria} dan ${invitationData.namaMempelaiWanita}`,
    generated_content: invitationData,
    slug: slug,
  };
  const { data: savedInvitation, error: insertError } = await supabase
    .from("invitations")
    .insert(newInvitation)
    .select()
    .single();
  if (insertError) {
    if (insertError.code === "23505") {
      throw new Error("Gagal membuat link unik, silakan coba generate lagi.");
    }
    throw insertError;
  }
  return savedInvitation;
};

function PremiumGenerator() {
  const { session } = useAuth();
  const { userProfile, loading } = useAuth();
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
    musik: null,
    temaWarna: "",
    jenisUndangan: "",
    agama: "",
    catatanKhusus: "",
  });

  const [previews, setPreviews] = useState({
    fotoMempelaiPria: null,
    fotoMempelaiWanita: null,
    galeriFoto: [],
    musik: null,
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Selamat datang! Lengkapi form, dan saya akan membuat undangan premium untuk Anda, lengkap dengan upload aset.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "galeriFoto") {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        [name]: [...prev.galeriFoto, ...newFiles],
      }));
      setPreviews((prev) => ({
        ...prev,
        [name]: [...prev.galeriFoto, ...newPreviews],
      }));
    } else {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [name]: file }));
        if (name === "musik") {
          setPreviews((prev) => ({ ...prev, [name]: file.name }));
        } else {
          setPreviews((prev) => ({
            ...prev,
            [name]: URL.createObjectURL(file),
          }));
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
      setFormData((prev) => ({ ...prev, galeriFoto: newFiles }));
      setPreviews((prev) => ({ ...prev, galeriFoto: newPreviews }));
    } else {
      if (
        previews[name] &&
        typeof previews[name] === "string" &&
        previews[name].startsWith("blob:")
      ) {
        URL.revokeObjectURL(previews[name]);
      }
      setFormData((prev) => ({ ...prev, [name]: null }));
      setPreviews((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGeneratedLink("");
    const requiredFields = [
      "namaMempelaiPria",
      "namaMempelaiWanita",
      "tanggalAcara",
      "lokasiAcara",
    ];
    if (requiredFields.some((field) => !formData[field])) {
      alert(
        "Mohon lengkapi field yang wajib diisi: " +
          requiredFields.filter((field) => !formData[field]).join(", ")
      );
      return;
    }
    setShowChat(true);
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Anda harus login untuk membuat undangan.");
      setIsLoading(false);
      return;
    }
    try {
      setLoadingMessage("Meng-upload gambar dan musik...");
      const assetUrls = await uploadAssets(
        {
          fotoMempelaiPria: formData.fotoMempelaiPria,
          fotoMempelaiWanita: formData.fotoMempelaiWanita,
          galeriFoto: formData.galeriFoto,
          musik: formData.musik,
        },
        user.id
      );
      const dataForDb = { ...formData, ...assetUrls };
      // Note: Do not delete the asset URLs as they are needed for the invitation generation
      setLoadingMessage("Menyimpan data undangan...");
      const savedInvitation = await saveInvitationData(dataForDb);

      // Prepare data for the AI backend, ensuring the slug is included
      const dataForBackend = {
        ...dataForDb,
        slug: savedInvitation.slug,
      };

      setLoadingMessage("Menghubungi AI untuk membuat file undangan...");
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      const endpoint =
        user.subscription_status === "free"
          ? `${backendUrl}/invitations/free-generate`
          : `${backendUrl}/invitations/generate`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForBackend),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Error dari Backend: ${errorData?.detail || response.statusText}`
        );
      }
      const finalUrl = `${backendUrl}/invitations/${savedInvitation.slug}`;
      if (!finalUrl) {
        throw new Error("Backend tidak mengembalikan URL undangan.");
      }
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: `🎉 Berhasil! Proses selesai.\n\nSilakan klik link di bawah untuk melihat undangan Anda:\n<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">Lihat Undangan: ${savedInvitation.slug}</a>`,
      };
      setMessages((prev) => [...prev, botResponse]);
      setGeneratedLink(finalUrl);
    } catch (error) {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: `Maaf, terjadi kesalahan:\n\n${error.message}\n\nSilakan coba lagi.`,
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Memuat data pengguna...
        </p>
      </div>
    );
  }

  if (userProfile?.subscription_status !== "premium") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <span className="material-symbols-outlined">error</span>
            Akses Ditolak
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Fitur Khusus Pengguna Premium
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-300 mb-6">
            Maaf, halaman ini hanya dapat diakses oleh pengguna dengan status
            langganan premium. Silakan upgrade akun Anda untuk menikmati semua
            fitur eksklusif kami.
          </p>
          <Link
            to="/harga"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Lihat Paket Harga
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .dark input[type="file"]::file-selector-text {
            color: white;
          }
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden relative">
        {/* Subtle noise texture */}
        <div
          className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                <span className="material-symbols-outlined">
                  workspace_premium
                </span>
                PREMIUM GENERATOR
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Generator Undangan Pernikahan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Premium
                </span>
              </h1>
              <div className="relative inline-block mb-6">
                <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 shadow-md"></div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Buat undangan pernikahan eksklusif dengan fitur premium.
                Lengkapi form di bawah ini dan biarkan AI membuat undangan yang
                tak terlupakan.
              </p>
            </div>

            {!showChat ? (
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                  }}
                ></div>

                <div
                  className="px-6 py-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Detail Acara Pernikahan
                  </h2>
                  <p className="text-indigo-100">
                    Lengkapi informasi di bawah ini untuk membuat undangan
                    premium
                  </p>
                </div>

                <form onSubmit={handleGenerate} className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Kolom Informasi Wajib */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                        Informasi Wajib
                      </h3>
                      {/* Input nama, tanggal, lokasi, dll. seperti sebelumnya */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Mempelai Pria{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="namaMempelaiPria"
                          value={formData.namaMempelaiPria}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                          placeholder="Masukkan nama mempelai pria"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Ayah Mempelai Pria
                        </label>
                        <input
                          type="text"
                          name="namaAyahMempelaiPria"
                          value={formData.namaAyahMempelaiPria}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan nama ayah mempelai pria"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Ibu Mempelai Pria
                        </label>
                        <input
                          type="text"
                          name="namaIbuMempelaiPria"
                          value={formData.namaIbuMempelaiPria}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan nama ibu mempelai pria"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Mempelai Wanita{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="namaMempelaiWanita"
                          value={formData.namaMempelaiWanita}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan nama mempelai wanita"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Ayah Mempelai Wanita
                        </label>
                        <input
                          type="text"
                          name="namaAyahMempelaiWanita"
                          value={formData.namaAyahMempelaiWanita}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan nama ayah mempelai wanita"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Ibu Mempelai Wanita
                        </label>
                        <input
                          type="text"
                          name="namaIbuMempelaiWanita"
                          value={formData.namaIbuMempelaiWanita}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan nama ibu mempelai wanita"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tanggal Acara <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="tanggalAcara"
                          value={formData.tanggalAcara}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Waktu Acara
                        </label>
                        <input
                          type="time"
                          name="waktuAcara"
                          value={formData.waktuAcara}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Lokasi Acara <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="lokasiAcara"
                          value={formData.lokasiAcara}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan alamat lengkap lokasi acara"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Waktu Resepsi
                        </label>
                        <input
                          type="time"
                          name="waktuResepsi"
                          value={formData.waktuResepsi}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tempat Resepsi
                        </label>
                        <textarea
                          name="tempatResepsi"
                          value={formData.tempatResepsi}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          placeholder="Masukkan alamat lengkap lokasi resepsi"
                        />
                      </div>
                    </div>

                    {/* Kolom Informasi Tambahan & Aset */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                        Informasi Tambahan & Aset
                      </h3>
                      {/* Input tema, jenis, dll. seperti sebelumnya */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tema Warna
                        </label>
                        <select
                          name="temaWarna"
                          value={formData.temaWarna}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Agama
                        </label>
                        <select
                          name="agama"
                          value={formData.agama}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        >
                          <option value="">Pilih agama</option>
                          <option value="islam">Islam</option>
                          <option value="kristen">Kristen</option>
                          <option value="hindu">Hindu</option>
                          <option value="buddha">Buddha</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Jenis Undangan
                        </label>
                        <select
                          name="jenisUndangan"
                          value={formData.jenisUndangan}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Musik Latar
                        </label>
                        {!previews.musik ? (
                          <input
                            type="file"
                            name="musik"
                            onChange={handleFileChange}
                            accept="audio/mp3"
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
                            style={{
                              "--tw-file-bg":
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          />
                        ) : (
                          <div className="mt-2 p-2 border dark:border-gray-600 dark:text-white rounded-lg flex items-center justify-between">
                            <span className="text-sm dark:text-white">
                              {previews.musik}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFileDelete("musik")}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                      {/* ... input file lainnya ... */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Foto Mempelai Pria
                        </label>
                        {!previews.fotoMempelaiPria ? (
                          <input
                            type="file"
                            name="fotoMempelaiPria"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
                          />
                        ) : (
                          <div className="mt-2 p-2 border dark:border-gray-600 rounded-lg">
                            <img
                              src={previews.fotoMempelaiPria}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleFileDelete("fotoMempelaiPria")
                              }
                              className="text-sm text-red-600 hover:underline mt-2"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Foto Mempelai Wanita
                        </label>
                        {!previews.fotoMempelaiWanita ? (
                          <input
                            type="file"
                            name="fotoMempelaiWanita"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
                          />
                        ) : (
                          <div className="mt-2 p-2 border dark:border-gray-600 rounded-lg">
                            <img
                              src={previews.fotoMempelaiWanita}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleFileDelete("fotoMempelaiWanita")
                              }
                              className="text-sm text-red-600 hover:underline mt-2"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Galeri Foto Pre-Wedding
                        </label>
                        <input
                          type="file"
                          name="galeriFoto"
                          onChange={handleFileChange}
                          accept="image/*"
                          multiple
                          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
                        />
                        {previews.galeriFoto.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {previews.galeriFoto.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${index}`}
                                  className="w-full h-20 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleFileDelete("galeriFoto", index)
                                  }
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Catatan Khusus
                        </label>
                        <textarea
                          name="catatanKhusus"
                          value={formData.catatanKhusus}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                          placeholder="Tambahkan catatan khusus atau permintaan lainnya..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                      style={{
                        background: isLoading
                          ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.background =
                            "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 6px 16px rgba(102, 126, 234, 0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.background =
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    >
                      <span className="material-symbols-outlined mr-2">
                        auto_awesome
                      </span>
                      {isLoading
                        ? loadingMessage || "Memproses..."
                        : "Generate Undangan Premium"}
                    </button>
                    <Link
                      to={session ? "/chat" : "/login"}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 text-center flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined mr-2">
                        chat
                      </span>
                      Kembali ke Chat Biasa
                    </Link>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                    }}
                  ></div>

                  <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 relative z-10">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                            message.type === "user"
                              ? "text-white"
                              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600"
                          }`}
                          style={
                            message.type === "user"
                              ? {
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                }
                              : {}
                          }
                        >
                          <p
                            className="text-sm whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: message.content,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            {loadingMessage || "Memproses..."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setShowChat(false)}
                    className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-6 py-3 rounded-lg font-bold"
                  >
                    Edit Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PremiumGenerator;
