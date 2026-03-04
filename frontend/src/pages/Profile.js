import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { session, userProfile, logout } = useAuth();
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
      
      // Fetch Invitations
      const invRes = await fetch('/api/invitations/', { headers });
      if (!invRes.ok) throw new Error('Gagal mengambil data undangan.');
      const invData = await invRes.json();
      setInvitations(invData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      // Fetch All RSVPs
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
      // Refresh stats after deletion
      fetchData();
    } catch (err) {
      alert(`Error: ${err.message}`);
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
              <TabButton active={activeTab === 'rsvps'} onClick={() => setActiveTab('rsvps')} label="Daftar Tamu" icon="badge" />
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
                  />
                )}
                {activeTab === 'rsvps' && <RsvpTab rsvps={filteredRsvps} />}
                {activeTab === 'messages' && <MessagesTab rsvps={filteredRsvps} />}
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
    </div>
  );
}

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

function InvitationTab({ invitations, selected, handleSelection, handleSelectAll, handleDeleteRequest }) {
  const backendUrl = "http://localhost:8000";

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
          // Ambil nama dari generated_content jika kolom utama kosong
          const content = inv.generated_content || {};
          const pria = content.namaMempelaiPria || inv.namaMempelaiPria || "Mempelai Pria";
          const wanita = content.namaMempelaiWanita || inv.namaMempelaiWanita || "Mempelai Wanita";

          return (
            <div key={inv.id} className={`p-4 rounded-2xl border transition-all ${selected.includes(inv.slug) ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-700'}`}>
              <div className="flex justify-between items-start mb-3">
                <input type="checkbox" checked={selected.includes(inv.slug)} onChange={() => handleSelection(inv.slug)} className="rounded border-gray-300 text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white truncate mb-4">
                {pria} & {wanita}
              </h4>
              <div className="flex gap-2">
                <a href={`${backendUrl}/api/invitations/${inv.slug}`} target="_blank" rel="noreferrer" className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg text-xs font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Lihat Undangan</a>
                <button onClick={() => handleDeleteRequest([inv.slug])} className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
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
