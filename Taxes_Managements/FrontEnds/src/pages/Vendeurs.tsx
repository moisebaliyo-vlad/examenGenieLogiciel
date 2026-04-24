import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { vendeursApi, paiementsApi } from '../services/api';

export default function Vendeurs() {
  const { user, role } = useAppSelector((state) => state.auth);
  const [vendeurs, setVendeurs] = useState<any[]>([]);
  const [selectedVendeur, setSelectedVendeur] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === 'vendeur') {
      setSelectedVendeur(user);
    } else {
      const fetchVendeurs = async () => {
        try {
          const data = await vendeursApi.getAll();
          setVendeurs(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchVendeurs();
    }
  }, [role, user]);

  useEffect(() => {
    if (selectedVendeur) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const data = await paiementsApi.getByVendeur(selectedVendeur.id);
          setHistory(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [selectedVendeur]);

  if (role !== 'vendeur' && !selectedVendeur) {
    return (
      <div className="px-4 py-6 space-y-6">
        <h1 className="font-bold text-2xl text-primary px-2">Base des Vendeurs</h1>
        <div className="grid grid-cols-1 gap-3">
          {vendeurs.map((v) => (
            <div 
              key={v.id} 
              onClick={() => setSelectedVendeur(v)}
              className="bg-surface-container-lowest p-4 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md border border-outline-variant/5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold">
                  {v.nom[0]}{v.prenom[0]}
                </div>
                <div>
                  <p className="font-bold">{v.prenom} {v.nom}</p>
                  <p className="text-xs text-on-surface-variant">{v.emplacement}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalPaid = history.reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="max-w-md mx-auto px-4 pt-6 space-y-6 pb-24">
      <div className="flex items-center gap-3 mb-4">
        {role !== 'vendeur' && (
          <button onClick={() => setSelectedVendeur(null)} className="material-symbols-outlined">arrow_back</button>
        )}
        <h1 className="font-bold text-xl text-primary">{role === 'vendeur' ? 'Mon Profil Vendeur' : 'Détails Vendeur'}</h1>
      </div>

      {/* Vendor Profile Section - Bento Style */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_-8px_24px_rgba(27,28,28,0.02)] border border-outline-variant/10">
          <div className="flex items-start justify-between mb-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center text-3xl font-black text-primary/20">
              {selectedVendeur?.nom[0]}{selectedVendeur?.prenom[0]}
            </div>
            <div className="flex flex-col items-end">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${history.length > 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'} shadow-sm`}>
                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>
                  {history.length > 0 ? 'check_circle' : 'warning'}
                </span>
                {history.length > 0 ? 'À JOUR' : 'EN RETARD'}
              </span>
              <div className="mt-4 text-right">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">ID Fiscal</p>
                <p className="font-bold text-primary">#{selectedVendeur?.identifiant_national}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-on-surface leading-tight">{selectedVendeur?.prenom} {selectedVendeur?.nom}</h2>
            <div className="flex items-center gap-2 text-on-surface-variant mt-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <p className="text-sm font-medium">{selectedVendeur?.emplacement}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Payé</p>
            <p className="text-xl font-black text-primary">{totalPaid.toLocaleString()} FC</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Dernière Collecte</p>
            <p className="text-xl font-black text-secondary">{history.length > 0 ? new Date(history[0].date_paiement).toLocaleDateString() : 'Aucune'}</p>
          </div>
        </div>
      </section>

      {/* Timeline / History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-surface">Historique des Paiements</h3>
        </div>
        
        <div className="space-y-3">
          {loading ? (
            <p className="text-center py-8 text-outline">Chargement de l'historique...</p>
          ) : history.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between border-l-4 border-secondary shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-secondary-container/30 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>payments</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Taxe Perçue</p>
                  <p className="text-xs text-on-surface-variant">{new Date(p.date_paiement).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-on-surface">{p.montant.toLocaleString()} FC</p>
                <button className="text-[10px] font-bold text-primary flex items-center gap-1 mt-1 uppercase">
                  <span className="material-symbols-outlined text-[12px]">download</span> Reçu
                </button>
              </div>
            </div>
          ))}
          {history.length === 0 && !loading && (
            <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-outline/30 mb-2">history</span>
              <p className="text-on-surface-variant text-sm">Aucun historique de paiement</p>
            </div>
          )}
        </div>
      </section>

      {/* Action Button */}
      <div className="pt-4">
        <button className="w-full bg-primary text-white py-5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
          <span className="material-symbols-outlined">picture_as_pdf</span>
          GÉNÉRER UN REÇU GLOBAL PDF
        </button>
      </div>
    </div>
  );
}
