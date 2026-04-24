import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { usersApi, vendeursApi } from '../services/api';

export default function AdminUsers() {
  const { token, user: currentUser } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [vendeurs, setVendeurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agents' | 'vendeurs'>('agents');

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      if (activeTab === 'agents') {
        const data = await usersApi.getAll(token);
        setUsers(data);
      } else {
        const data = await vendeursApi.getAll();
        setVendeurs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, activeTab]);

  const toggleUserStatus = async (user: any) => {
    if (!token) return;
    try {
      await usersApi.update(user.id, { is_active: !user.is_active }, token);
      fetchData();
    } catch (error) {
      alert('Erreur');
    }
  };

  const toggleVendeurStatus = async (v: any) => {
    if (!token) return;
    try {
      // In api.ts, I should add update to vendeursApi
      const response = await fetch(`http://localhost:8000/vendeurs/${v.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !v.is_active })
      });
      if (response.ok) fetchData();
    } catch (error) {
      alert('Erreur');
    }
  };

  if (!currentUser?.is_admin) {
    return <div className="p-8 text-center text-error font-bold">Accès refusé</div>;
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-primary">Gestion des Comptes</h2>
      
      <div className="flex bg-surface-container-high p-1 rounded-xl">
        <button onClick={() => setActiveTab('agents')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'agents' ? 'bg-white shadow-sm text-primary' : 'text-outline'}`}>Agents/Admins</button>
        <button onClick={() => setActiveTab('vendeurs')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'vendeurs' ? 'bg-white shadow-sm text-primary' : 'text-outline'}`}>Vendeurs</button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8">Chargement...</p>
        ) : activeTab === 'agents' ? (
          Array.isArray(users) && users.map((u) => (
            <div key={u.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${u.is_admin ? 'bg-primary-fixed text-primary' : 'bg-secondary-container text-secondary'}`}>
                  {u.full_name ? u.full_name[0] : u.email[0]}
                </div>
                <div>
                  <p className="font-bold">{u.full_name || 'Sans nom'}</p>
                  <p className="text-xs text-outline">{u.email}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.is_active ? 'Actif' : 'En attente'}
                  </span>
                </div>
              </div>
              {u.id !== currentUser.id && (
                <button 
                  onClick={() => toggleUserStatus(u)}
                  className={`p-2 rounded-lg transition-colors ${u.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                >
                  <span className="material-symbols-outlined">
                    {u.is_active ? 'person_off' : 'person_check'}
                  </span>
                </button>
              )}
            </div>
          ))
        ) : (
          Array.isArray(vendeurs) && vendeurs.map((v) => (
            <div key={v.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container text-tertiary flex items-center justify-center font-bold">
                  {v.nom[0]}
                </div>
                <div>
                  <p className="font-bold">{v.prenom} {v.nom}</p>
                  <p className="text-xs text-outline">ID: {v.identifiant_national}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {v.is_active ? 'Actif' : 'En attente'}
                  </span>
                </div>
              </div>
              <button 
                  onClick={() => toggleVendeurStatus(v)}
                  className={`p-2 rounded-lg transition-colors ${v.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                >
                  <span className="material-symbols-outlined">
                    {v.is_active ? 'block' : 'check_circle'}
                  </span>
                </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
