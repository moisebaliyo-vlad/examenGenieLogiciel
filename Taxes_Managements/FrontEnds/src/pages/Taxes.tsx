import React, { useEffect, useState } from 'react';
import { taxesApi } from '../services/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Taxes() {
  const [taxes, setTaxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<any>(null);
  const [taxForm, setTaxForm] = useState({ nom: '', montant_base: '', frequence: 'Journalière', description: '' });
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  const fetchTaxes = async () => {
    try {
      const data = await taxesApi.getAll();
      setTaxes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleOpenCreate = () => {
    setEditingTax(null);
    setTaxForm({ nom: '', montant_base: '', frequence: 'Journalière', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (tax: any) => {
    setEditingTax(tax);
    setTaxForm({ 
      nom: tax.nom, 
      montant_base: tax.montant_base.toString(), 
      frequence: tax.frequence, 
      description: tax.description || '' 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const payload = {
        ...taxForm,
        montant_base: parseFloat(taxForm.montant_base)
      };
      
      if (editingTax) {
        await taxesApi.update(editingTax.id, payload, token);
      } else {
        await taxesApi.create(payload);
      }
      
      setShowModal(false);
      fetchTaxes();
    } catch (error) {
      alert('Erreur lors de l\'opération');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="px-4 pt-6 max-w-md mx-auto space-y-8 pb-32">
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-bold mb-4">{editingTax ? 'Modifier la Taxe' : 'Nouvelle Taxe'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Nom de la taxe" 
                className="w-full h-12 px-4 bg-surface-container-high rounded-lg border-none"
                value={taxForm.nom}
                onChange={e => setTaxForm({...taxForm, nom: e.target.value})}
                required
              />
              <input 
                placeholder="Montant de base" 
                type="number"
                className="w-full h-12 px-4 bg-surface-container-high rounded-lg border-none"
                value={taxForm.montant_base}
                onChange={e => setTaxForm({...taxForm, montant_base: e.target.value})}
                required
              />
              <select 
                className="w-full h-12 px-4 bg-surface-container-high rounded-lg border-none"
                value={taxForm.frequence}
                onChange={e => setTaxForm({...taxForm, frequence: e.target.value})}
              >
                <option>Journalière</option>
                <option>Hebdomadaire</option>
                <option>Mensuelle</option>
                <option>Annuelle</option>
              </select>
              <textarea 
                placeholder="Description" 
                className="w-full p-4 bg-surface-container-high rounded-lg border-none"
                value={taxForm.description}
                onChange={e => setTaxForm({...taxForm, description: e.target.value})}
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-lg font-bold text-outline">Annuler</button>
                <button type="submit" className="flex-1 h-12 bg-primary text-white rounded-lg font-bold">{editingTax ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section: Gestion des Taxes */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[1.375rem] font-bold leading-none">Configuration des Taxes</h2>
          <button 
            onClick={handleOpenCreate}
            className="text-primary font-semibold flex items-center gap-1 p-2 hover:bg-primary/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="text-sm">Nouveau</span>
          </button>
        </div>
        {/* Tax Cards Grid */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-8">Chargement...</p>
          ) : taxes.map((tax) => (
            <div key={tax.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(27,28,28,0.04)] group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-secondary-container text-[#217128] text-[0.75rem] font-bold rounded-full uppercase tracking-wider mb-2">Actif</span>
                  <h3 className="text-xl font-bold">{tax.nom}</h3>
                </div>
                <button 
                  onClick={() => handleOpenEdit(tax)}
                  className="p-2 text-outline-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-on-surface-variant text-sm">{tax.frequence}</p>
                  <p className="text-on-surface-variant text-xs opacity-70">{tax.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-[2.25rem] font-black leading-none text-primary">{tax.montant_base.toLocaleString()}</p>
                  <p className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">FC</p>
                </div>
              </div>
            </div>
          ))}
          {taxes.length === 0 && !loading && (
            <p className="text-center py-8 text-outline">Aucune taxe configurée.</p>
          )}
        </div>
      </section>

      {/* Section: Paramètres */}
      <section className="space-y-4">
        <h2 className="text-[1.375rem] font-bold leading-none">Paramètres Système</h2>
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          {/* Setting Row 1 */}
          <div className="flex items-center justify-between p-5 bg-surface-container-lowest border-b border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">language</span>
              </div>
              <div>
                <p className="font-bold">Langue de l'interface</p>
                <p className="text-sm text-on-surface-variant">Français (RDC)</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
          </div>
          {/* Setting Row 2 */}
          <div className="flex items-center justify-between p-5 bg-surface-container-lowest border-b border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div>
                <p className="font-bold">Profil utilisateur</p>
                <p className="text-sm text-on-surface-variant">{user?.email}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
          </div>
          {/* Setting Row 3 */}
          <div className="flex items-center justify-between p-5 bg-surface-container-lowest border-b border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <div>
                <p className="font-bold">Alertes & Notifications</p>
                <p className="text-sm text-on-surface-variant">Activé</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-secondary rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          {/* Setting Row 4 */}
          <div 
            onClick={handleLogout}
            className="flex items-center justify-between p-5 bg-surface-container-lowest cursor-pointer hover:bg-error/5 transition-colors"
          >
            <div className="flex items-center gap-4 text-error">
              <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <div>
                <p className="font-bold">Déconnexion</p>
                <p className="text-sm opacity-70">Fermer la session actuelle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Component: Version Info */}
      <div className="text-center pt-4 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full">
          <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sécurisé par le Gouvernement • v2.4.0</span>
        </div>
      </div>
    </div>
  );
}
