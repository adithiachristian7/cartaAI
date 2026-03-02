import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RecentInvitations() {
  const { session } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!session) return;
      try {
        const response = await fetch('/api/invitations/', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Ambil 3 undangan terbaru saja untuk di Home
          setInvitations(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3));
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [session]);

  if (!session || (invitations.length === 0 && !loading)) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Undangan Terakhir Anda</h2>
            <p className="text-gray-600 dark:text-gray-400">Lanjutkan mengelola atau lihat hasil undangan yang telah Anda buat.</p>
          </div>
          <Link to="/profile" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {invitations.map((inv) => (
              <div key={inv.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md">
                      {new Date(inv.created_at).toLocaleDateString('id-ID')}
                    </span>
                    <span className="material-symbols-outlined text-gray-400">drafts</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 truncate">
                    {inv.namaMempelaiPria && inv.namaMempelaiWanita 
                      ? `${inv.namaMempelaiPria} & ${inv.namaMempelaiWanita}` 
                      : inv.slug}
                  </h3>
                  <div className="flex gap-3">
                    <a 
                      href={`http://localhost:8000/api/invitations/${inv.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Lihat Hasil
                    </a>
                    <Link 
                      to="/profile" 
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">settings</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentInvitations;
