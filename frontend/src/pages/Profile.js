import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { session, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  
  // State for the custom confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slugsToDelete, setSlugsToDelete] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- Selection Handlers ---
  const handleSelection = (slug) => {
    setSelected(prevSelected => 
      prevSelected.includes(slug)
        ? prevSelected.filter(s => s !== slug)
        : [...prevSelected, slug]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(invitations.map(inv => inv.slug));
    } else {
      setSelected([]);
    }
  };

  // --- Delete Logic ---
  // Opens the confirmation modal
  const handleDeleteRequest = (slugs) => {
    if (slugs.length === 0) return;
    setSlugsToDelete(slugs);
    setIsModalOpen(true);
  };

  // The actual deletion logic, called from the modal
  const handleConfirmDelete = async () => {
    if (slugsToDelete.length === 0) return;

    try {
      const response = await fetch(`/api/invitations/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ slugs: slugsToDelete }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Gagal menghapus undangan.');
      }

      setInvitations(invitations.filter(inv => !slugsToDelete.includes(inv.slug)));
      setSelected([]); // Clear selection after deletion

    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      // Close the modal and clear the slugs to delete
      setIsModalOpen(false);
      setSlugsToDelete([]);
    }
  };

  useEffect(() => {
    if (!session) {
      const timer = setTimeout(() => navigate('/login'), 1000);
      return () => clearTimeout(timer);
    }

    const fetchInvitations = async () => {
      try {
        const response = await fetch('/api/invitations/', { headers: { 'Authorization': `Bearer ${session.access_token}` } });
        if (!response.ok) throw new Error('Gagal mengambil data undangan.');
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setInvitations(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchInvitations();
  }, [session, navigate]);

  if (!session) {
    return <div className="container mx-auto px-6 py-12 text-center dark:text-gray-300"><p>Mengalihkan ke halaman login...</p></div>;
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* --- User Profile Section --- */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {session.user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Pengguna</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{session.user.email}</p>
                <div className="mt-3">
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${userProfile?.subscription_status === 'premium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700' : 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'}`}>
                    Langganan: {userProfile?.subscription_status || 'basic'}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-5 rounded-lg transition duration-300 text-sm flex items-center gap-2 self-center sm:self-start mt-4 sm:mt-0 border border-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 dark:border-red-700">
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </div>

          {/* --- Invitation History Section --- */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Riwayat Undangan</h2>
              {invitations.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="selectAll" onChange={handleSelectAll} checked={selected.length === invitations.length && invitations.length > 0} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="selectAll" className="ml-2 text-sm text-gray-600 dark:text-gray-300">Pilih Semua</label>
                  </div>
                  <button onClick={() => handleDeleteRequest(selected)} disabled={selected.length === 0} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined">delete</span>
                    Hapus ({selected.length})
                  </button>
                </div>
              )}
            </div>

            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Memuat riwayat undangan...</p>}
            {error && <p className="text-center text-red-500 bg-red-50 p-4 rounded-lg dark:text-red-300 dark:bg-red-900">Error: {error}</p>}
            
            {!loading && !error && invitations.length === 0 && (
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-12 shadow-md">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">upcoming</span>
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">Anda belum pernah membuat undangan.</p>
                <Link to="/template" className="mt-6 inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 rounded-lg px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-shadow">Buat Undangan Sekarang</Link>
              </div>
            )}

            {!loading && invitations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitations.map((inv) => {
                  const title = (inv.namaMempelaiPria && inv.namaMempelaiWanita) ? `${inv.namaMempelaiPria} & ${inv.namaMempelaiWanita}` : (inv.slug || 'Undangan');
                  const isSelected = selected.includes(inv.slug);
                  return (
                    <div key={inv.id} className={`rounded-2xl shadow-lg border overflow-hidden flex flex-col group transition-all duration-300 bg-white dark:bg-gray-800 ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-100 dark:border-gray-700'}`}>
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">{new Date(inv.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelection(inv.slug)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-2 truncate" title={title}>{title}</h3>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t dark:border-gray-600 mt-auto flex items-center gap-2">
                        <a href={`/api/invitations/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition duration-300 text-sm">
                          Lihat Undangan
                        </a>
                        <button onClick={() => handleDeleteRequest([inv.slug])} className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition duration-300 dark:bg-red-800 dark:hover:bg-red-700 dark:text-red-300" title="Hapus Undangan">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 m-4 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-300">
                  warning
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" id="modal-title">Konfirmasi Penghapusan</h3>
              <div className="mt-4">
                <p className="text-base text-gray-600 dark:text-gray-300">
                  Apakah Anda yakin ingin menghapus {slugsToDelete.length} undangan? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg shadow-sm px-6 py-3 bg-red-600 text-base font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto transition-colors"
                onClick={handleConfirmDelete}
              >
                Hapus
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg shadow-sm px-6 py-3 bg-white dark:bg-gray-700 text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
