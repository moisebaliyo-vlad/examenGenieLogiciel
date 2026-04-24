import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { notificationsApi } from '../services/api';

export default function AppLayout() {
  const { user, role, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (token) {
      notificationsApi.getAll(token).then(setNotifications).catch(console.error);
    }
  }, [token]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: number) => {
    if (!token) return;
    await notificationsApi.markAsRead(id, token);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface pb-24">
      {/* TopAppBar */}
      <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
          <h1 className="font-['Public_Sans'] font-black text-xl text-primary tracking-tight">
            Congo Tax App
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-stone-600 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-stone-100 p-2 z-[100] max-h-96 overflow-y-auto">
                <h4 className="px-4 py-2 font-bold text-sm border-b border-stone-50">Notifications</h4>
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-stone-400">Aucune notification</p>
                ) : notifications.map(n => (
                  <div key={n.id} onClick={() => handleMarkAsRead(n.id)} className={`p-4 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                    <p className="font-bold text-xs">{n.titre}</p>
                    <p className="text-[11px] text-stone-600 mt-1">{n.message}</p>
                    <p className="text-[9px] text-stone-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">
              {role === 'vendeur' ? `${user.prenom} ${user.nom}` : user.full_name || user.email}
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {role === 'admin' ? 'Administrateur' : role === 'agent' ? 'Agent de Collecte' : 'Vendeur'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-primary/10 cursor-pointer hover:bg-primary/5 transition-colors" 
              onClick={() => navigate('/profile')} 
              title="Mon Profil"
            >
              <span className="material-symbols-outlined text-slate-600">person</span>
            </div>
            <button 
              onClick={() => dispatch(logout())}
              className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
              title="Déconnexion"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white/85 backdrop-blur-xl z-50 rounded-t-xl shadow-[0_-8px_24px_rgba(27,28,28,0.06)] border-t border-stone-200/20">
        {role === 'admin' && <NavItem to="/dashboard" icon="dashboard" label="Tableau" />}
        {(role === 'admin' || role === 'agent') && <NavItem to="/collecte" icon="payments" label="Collecte" />}
        {(role === 'admin' || role === 'vendeur') && <NavItem to="/vendeurs" icon="groups" label="Vendeurs" />}
        {role === 'admin' && <NavItem to="/taxes" icon="settings_suggest" label="Taxes" />}
        {(role === 'admin' || role === 'vendeur') && <NavItem to="/signalements" icon="report_problem" label="Signalements" />}
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex flex-col items-center justify-center p-3 transition-all active:scale-90
        ${isActive 
          ? 'bg-primary text-white rounded-xl transform -translate-y-1 shadow-md' 
          : 'text-stone-500 hover:text-primary'}
      `}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
        {label}
      </span>
    </NavLink>
  );
}
