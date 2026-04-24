import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { usersApi } from '../services/api';
import { loginSuccess, logout } from '../store/slices/authSlice';

export default function Profile() {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setLoading(true);
    try {
      const payload: any = { full_name: fullName, email };
      if (password) payload.password = password;
      
      const updatedUser = await usersApi.update(user.id, payload, token);
      dispatch(loginSuccess({ user: updatedUser, token }));
      setMessage('Profil mis à jour avec succès !');
      setPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-8 pb-24">
      <h2 className="text-2xl font-bold text-primary">Mon Profil</h2>
      
      {message && (
        <div className={`p-4 rounded-xl text-center font-bold ${message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-outline uppercase">Nom Complet</label>
          <input 
            className="w-full h-12 px-4 bg-surface-container-high rounded-xl border-none"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-outline uppercase">Email</label>
          <input 
            className="w-full h-12 px-4 bg-surface-container-high rounded-xl border-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-outline uppercase">Nouveau Mot de Passe (Optionnel)</label>
          <input 
            type="password"
            className="w-full h-12 px-4 bg-surface-container-high rounded-xl border-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
          />
        </div>
        
        <button 
          disabled={loading}
          className="w-full bg-primary text-white h-14 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
        </button>
      </form>

      <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-on-surface">Informations Système</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-outline uppercase font-bold">Rôle</p>
            <p className="font-bold text-primary capitalize">{user?.is_admin ? 'Admin' : 'Agent'}</p>
          </div>
          <div>
            <p className="text-[10px] text-outline uppercase font-bold">Statut</p>
            <p className="font-bold text-secondary">{user?.is_active ? 'Actif' : 'Inactif'}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => dispatch(logout())}
        className="w-full h-14 rounded-xl border-2 border-red-100 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <span className="material-symbols-outlined">logout</span>
        Déconnexion
      </button>
    </div>
  );
}
