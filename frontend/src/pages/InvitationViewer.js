import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { supabase } from '../supabaseClient'; // No longer needed for fetching URL

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

      // Construct the URL directly to the backend endpoint
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const finalInvitationUrl = `${backendUrl}/invitations/${slug}`;
      
      setInvitationUrl(finalInvitationUrl);
      setIsLoading(false);

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
