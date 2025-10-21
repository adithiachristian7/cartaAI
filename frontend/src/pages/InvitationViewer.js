import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function InvitationViewer() {
  const { slug } = useParams(); // Mengambil slug dari URL, misal: "haha--b0aazt"
  const [invitationUrl, setInvitationUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!slug) {
        setError("Slug undangan tidak ditemukan di URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Cari di tabel 'invitations' berdasarkan kolom 'slug'
        const { data, error: dbError } = await supabase
          .from('invitations')
          .select('generated_html_url') // Kita hanya butuh URL HTML nya
          .eq('slug', slug)
          .single(); // Karena slug itu unik, kita hanya harapkan satu hasil

        if (dbError || !data) {
          throw new Error("Undangan tidak ditemukan atau terjadi kesalahan saat mengambil data.");
        }

        if (data.generated_html_url) {
          setInvitationUrl(data.generated_html_url);
        } else {
          throw new Error("URL Undangan belum di-generate. Silakan coba generate ulang.");
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]); // Efek ini akan berjalan setiap kali slug di URL berubah

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Memuat Undangan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (invitationUrl) {
    // Menggunakan iframe untuk menampilkan file HTML secara penuh dan aman
    return (
      <iframe
        src={invitationUrl}
        title={`Undangan ${slug}`}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          border: 'none' 
        }}
      />
    );
  }

  return null; // Seharusnya tidak pernah sampai sini
}

export default InvitationViewer;
