import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  
  // Data States
  const [invitations, setInvitations] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({ total: 0, hadir: 0, tidak_hadir: 0 });
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('invitations'); // 'invitations', 'rsvps', 'messages'
  const [selectedInvitationFilter, setSelectedInvitationFilter] = useState('all');
  const [selected, setSelected] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slugsToDelete, setSlugsToDelete] = useState([]);

  // Share/Guest Management States
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSlug, setShareSlug] = useState("");
  const [guestNames, setGuestNames] = useState("");
  const [persistedGuests, setPersistedGuests] = useState([]);
  const [isSavingGuests, setIsSavingGuests] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- Computed Data ---
  const filteredRsvps = selectedInvitationFilter === 'all' 
    ? rsvps 
    : rsvps.filter(r => r.undangan_id === selectedInvitationFilter);

  const dynamicStats = selectedInvitationFilter === 'all'
    ? stats
    : {
        total: filteredRsvps.length,
        hadir: filteredRsvps.filter(r => !r.kehadiran.toLowerCase().includes('tidak')).length,
        tidak_hadir: filteredRsvps.filter(r => r.kehadiran.toLowerCase().includes('tidak')).length
      };

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${session.access_token}` };
      
      const invRes = await fetch('/api/invitations/', { headers });
      if (!invRes.ok) throw new Error('Gagal mengambil data undangan.');
      const invData = await invRes.json();
      setInvitations(invData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      const rsvpRes = await fetch('/api/invitations/all-rsvps', { headers });
      if (rsvpRes.ok) {
        const rsvpData = await rsvpRes.json();
        setRsvps(rsvpData.messages || []);
        setStats(rsvpData.stats || { total: 0, hadir: 0, tidak_hadir: 0 });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [session, navigate]);

  // --- Guest Management Functions ---
  const fetchGuests = async (slug) => {
    try {
      const headers = { 'Authorization': `Bearer ${session.access_token}` };
      const res = await fetch(`/api/invitations/guests/${slug}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setPersistedGuests(data);
      }
    } catch (err) {
      console.error("Error fetching guests:", err);
    }
  };

  const handleShareClick = (slug) => {
    setShareSlug(slug);
    setGuestNames("");
    setPersistedGuests([]);
    setShareModalOpen(true);
    fetchGuests(slug);
  };

  const saveGuests = async () => {
    const names = guestNames.split('\n').map(n => n.trim()).filter(n => n);
    if (names.length === 0) return;

    setIsSavingGuests(true);
    try {
      const response = await fetch('/api/invitations/guests/bulk', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ slug: shareSlug, names })
      });

      if (response.ok) {
        setGuestNames("");
        fetchGuests(shareSlug);
      } else {
        alert("Gagal menyimpan daftar tamu.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSavingGuests(false);
    }
  };

  const deleteGuest = async (guestId) => {
    if (!window.confirm("Hapus tamu ini dari daftar?")) return;
    try {
      const headers = { 'Authorization': `Bearer ${session.access_token}` };
      const res = await fetch(`/api/invitations/guests/${guestId}`, { 
        method: 'DELETE',
        headers 
      });
      if (res.ok) {
        setPersistedGuests(persistedGuests.filter(g => g.id !== guestId));
      }
    } catch (err) {
      alert("Gagal menghapus tamu.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link disalin ke clipboard!');
  };

  const getGuestUrl = (name) => {
    const backendUrl = window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin;
    return `${backendUrl}/api/invitations/${shareSlug}?to=${encodeURIComponent(name)}`;
  };

  // --- Handlers ---
  const handleSelection = (slug) => {
    setSelected(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? invitations.map(inv => inv.slug) : []);
  };

  const handleDeleteRequest = (slugs) => {
    if (slugs.length === 0) return;
    setSlugsToDelete(slugs);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/invitations/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ slugs: slugsToDelete }),
      });

      if (!response.ok) throw new Error('Gagal menghapus undangan.');
      
      setInvitations(invitations.filter(inv => !slugsToDelete.includes(inv.slug)));
      setSelected([]);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleFinalize = async (slug) => {
    if (!window.confirm("Kunci undangan ini? Setelah dikunci, desain dan data pengantin tidak dapat diubah lagi, dan Anda bisa mulai mengelola daftar tamu.")) return;
    
    try {
      const response = await fetch(`/api/invitations/${slug}/finalize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        fetchData(); // Refresh to update status
      }
    } catch (err) {
      alert("Gagal mengunci undangan.");
    }
  };

  if (!session) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- Dashboard Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {session.user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Halo, {session.user.email.split('@')[0]}!</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Selamat datang di Dashboard CartaAI Anda.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/template" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span> Buat Undangan
            </Link>
            <button onClick={handleLogout} className="bg-white dark:bg-gray-800 text-red-500 border border-red-100 dark:border-red-900/30 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">logout</span> Keluar
            </button>
          </div>
        </div>

        {/* --- Stats Overview --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Undangan" value={invitations.length} icon="description" color="blue" />
          <StatCard title="Total RSVP" value={dynamicStats.total} icon="group" color="purple" />
          <StatCard title="Tamu Hadir" value={dynamicStats.hadir} icon="check_circle" color="green" />
          <StatCard title="Tamu Berhalangan" value={dynamicStats.tidak_hadir} icon="cancel" color="red" />
        </div>

        {/* --- Filter & Tabs --- */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-1">
              <TabButton active={activeTab === 'invitations'} onClick={() => setActiveTab('invitations')} label="Riwayat Undangan" icon="history" />
              <TabButton active={activeTab === 'rsvps'} onClick={() => setActiveTab('rsvps')} label="Data RSVP" icon="badge" />
              <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} label="Ucapan & Doa" icon="chat" />
            </div>
            
            {(activeTab === 'rsvps' || activeTab === 'messages') && invitations.length > 0 && (
              <div className="p-3 sm:border-l dark:border-gray-700 flex items-center bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2 w-full">
                  <span className="material-symbols-outlined text-gray-400 text-sm">filter_list</span>
                  <select 
                    value={selectedInvitationFilter} 
                    onChange={(e) => setSelectedInvitationFilter(e.target.value)}
                    className="text-xs font-semibold bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 cursor-pointer w-full"
                  >
                    <option value="all">Semua Undangan</option>
                    {invitations.map(inv => {
                      const content = inv.generated_content || {};
                      const pria = content.namaMempelaiPria || inv.namaMempelaiPria || "Pria";
                      const wanita = content.namaMempelaiWanita || inv.namaMempelaiWanita || "Wanita";
                      return (
                        <option key={inv.id} value={inv.id}>
                          {pria} & {wanita}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-20 text-center text-gray-400">Memuat data...</div>
            ) : error ? (
              <div className="py-20 text-center text-red-500">{error}</div>
            ) : (
              <>
                {activeTab === 'invitations' && (
                  <InvitationTab 
                    invitations={invitations} 
                    selected={selected} 
                    handleSelection={handleSelection} 
                    handleSelectAll={handleSelectAll} 
                    handleDeleteRequest={handleDeleteRequest}
                    handleShareClick={handleShareClick}
                    handleFinalize={handleFinalize}
                  />
                )}
                {activeTab === 'rsvps' && <RsvpTab rsvps={filteredRsvps} />}
                {activeTab === 'messages' && <MessagesTab rsvps={filteredRsvps} />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Hapus Undangan?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Tindakan ini permanen dan akan menghapus semua data tamu yang terkait.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Batal</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Manajemen Tamu</h3>
              <button onClick={() => setShareModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tambah Tamu Baru (Satu nama per baris)</label>
              <textarea
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl mb-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                rows="4"
                placeholder="Budi Santoso&#10;Keluarga Andi"
                value={guestNames}
                onChange={(e) => setGuestNames(e.target.value)}
              ></textarea>
              <button 
                onClick={saveGuests}
                disabled={isSavingGuests || !guestNames.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSavingGuests ? "Menyimpan..." : <><span className="material-symbols-outlined">person_add</span> Simpan ke Database</>}
              </button>
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">group</span> 
                Daftar Tamu Tersimpan ({persistedGuests.length})
              </h4>
              
              {persistedGuests.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-gray-400 text-sm">Belum ada tamu yang disimpan di database.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="p-4 font-bold text-gray-600 dark:text-gray-200">Nama Tamu</th>
                        <th className="p-4 font-bold text-gray-600 dark:text-gray-200">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {persistedGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="p-4 text-gray-800 dark:text-white font-medium">{guest.name}</td>
                          <td className="p-4 flex gap-2">
                            <button 
                              onClick={() => copyToClipboard(getGuestUrl(guest.name))}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-[10px] font-bold flex items-center gap-1"
                              title="Salin Link"
                            >
                              <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                            </button>
                            <a 
                              href={`https://wa.me/?text=${encodeURIComponent(`Kepada Yth. ${guest.name},\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBerikut link undangan Anda:\n${getGuestUrl(guest.name)}\n\nTerima Kasih.`)}`}
                              target="_blank" rel="noreferrer"
                              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[10px] font-bold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">send</span> WA
                            </a>
                            <button 
                              onClick={() => deleteGuest(guest.id)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                              title="Hapus"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
        active 
          ? 'border-indigo-500 text-indigo-600 bg-white dark:bg-gray-800' 
          : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
      }`}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function InvitationTab({ invitations, selected, handleSelection, handleSelectAll, handleDeleteRequest, handleShareClick, handleFinalize }) {
  const backendUrl = window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin;
  const navigate = useNavigate();

  if (invitations.length === 0) return (
    <div className="text-center py-12">
      <p className="text-gray-400 mb-4">Belum ada riwayat undangan.</p>
      <Link to="/template" className="text-indigo-600 font-bold hover:underline">Buat Sekarang &rarr;</Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input type="checkbox" onChange={handleSelectAll} checked={selected.length === invitations.length} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-sm text-gray-500">Pilih Semua</span>
        </div>
        {selected.length > 0 && (
          <button onClick={() => handleDeleteRequest(selected)} className="text-sm font-bold text-red-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">delete</span> Hapus ({selected.length})
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invitations.map((inv) => {
          const content = inv.generated_content || {};
          const pria = content.namaMempelaiPria || inv.namaMempelaiPria || "Mempelai Pria";
          const wanita = content.namaMempelaiWanita || inv.namaMempelaiWanita || "Mempelai Wanita";
          const isFinalized = inv.is_finalized;

          return (
            <div key={inv.id} className={`p-5 rounded-2xl border transition-all ${selected.includes(inv.slug) ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={selected.includes(inv.slug)} onChange={() => handleSelection(inv.slug)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider">AKTIF</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</span>
              </div>
              
              <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-5">
                {pria} & {wanita}
              </h4>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleShareClick(inv.slug)} 
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">group</span> Daftar Tamu & Kirim
                </button>
                
                <div className="flex gap-2">
                  <a 
                    href={`${backendUrl}/api/invitations/${inv.slug}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-xs font-bold text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span> Lihat
                  </a>
                  <button 
                    onClick={() => handleDeleteRequest([inv.slug])} 
                    className="px-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
                    title="Hapus Undangan"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RsvpTab({ rsvps }) {
  if (rsvps.length === 0) return <div className="text-center py-12 text-gray-400">Belum ada tamu yang mengisi RSVP.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs uppercase text-gray-400 border-b dark:border-gray-700">
            <th className="py-3 px-2">Nama Tamu</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Undangan</th>
            <th className="py-3 px-2 text-right">Tanggal</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {rsvps.map((rsvp) => (
            <tr key={rsvp.id} className="text-sm">
              <td className="py-4 px-2 font-semibold text-gray-800 dark:text-white">{rsvp.nama}</td>
              <td className="py-4 px-2">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${rsvp.kehadiran.toLowerCase() === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {rsvp.kehadiran}
                </span>
              </td>
              <td className="py-4 px-2 text-gray-500 text-xs">{rsvp.nama_undangan}</td>
              <td className="py-4 px-2 text-right text-gray-400 text-[10px]">{new Date(rsvp.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessagesTab({ rsvps }) {
  const messages = rsvps.filter(r => r.ucapan);
  if (messages.length === 0) return <div className="text-center py-12 text-gray-400">Belum ada ucapan atau doa masuk.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {messages.map((m) => (
        <div key={m.id} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-bold text-gray-800 dark:text-white text-sm">{m.nama}</h5>
            <span className="text-[10px] text-gray-400">{m.nama_undangan}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{m.ucapan}"</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;
