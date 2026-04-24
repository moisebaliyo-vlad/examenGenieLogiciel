import React, { useState, useEffect } from 'react';
import { vendeursApi, taxesApi, paiementsApi } from '../services/api';
import { useAppSelector } from '../store/hooks';

export default function Collecte() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [selectedTax, setSelectedTax] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const data = await taxesApi.getAll();
        setTaxes(data);
        if (data.length > 0) setSelectedTax(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTaxes();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const data = await vendeursApi.search(searchQuery);
      setVendors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedVendor || !selectedTax || !token) return;
    setLoading(true);
    try {
      const payload = {
        vendeur_id: selectedVendor.id,
        taxe_id: selectedTax.id,
        montant: parseFloat(amount) || selectedTax.montant_base,
        reference: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
      await paiementsApi.create(payload, token);
      setMessage('Paiement enregistré avec succès !');
      setTimeout(() => setMessage(''), 3000);
      setSelectedVendor(null);
      setAmount('');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-lg mx-auto pb-32">
      {message && (
        <div className={`p-4 rounded-xl text-center font-bold ${message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Search Section */}
      <section className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input 
            className="w-full h-14 pl-12 pr-14 bg-surface-container-high border-none rounded-xl text-body-lg focus:ring-2 focus:ring-primary transition-all shadow-sm" 
            placeholder="Trouver un vendeur (ID ou Nom)" 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="absolute inset-y-0 right-2 my-2 w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {vendors.length > 0 && !selectedVendor && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-lg overflow-hidden">
            {vendors.map((v) => (
              <div 
                key={v.id} 
                onClick={() => setSelectedVendor(v)}
                className="p-4 border-b border-outline-variant/5 hover:bg-surface-container-high cursor-pointer flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{v.prenom} {v.nom}</p>
                  <p className="text-xs text-outline">ID: {v.identifiant_national}</p>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tax Selection */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Type de Taxe</h2>
        <div className="grid grid-cols-1 gap-3">
          {taxes.map((t) => (
            <button 
              key={t.id}
              onClick={() => {
                setSelectedTax(t);
                setAmount(t.montant_base.toString());
              }}
              className={`p-5 border-2 rounded-2xl flex justify-between items-center transition-all ${selectedTax?.id === t.id ? 'bg-white border-primary' : 'bg-surface-container-lowest border-transparent'}`}
            >
              <div className="text-left">
                <span className={`block font-bold text-lg ${selectedTax?.id === t.id ? 'text-primary' : 'text-on-surface'}`}>{t.nom}</span>
                <span className="text-outline text-sm">{t.frequence}</span>
              </div>
              <div className="text-right">
                <span className={`block font-black text-xl ${selectedTax?.id === t.id ? 'text-primary' : 'text-on-surface'}`}>{t.montant_base}</span>
                <span className="font-bold text-xs uppercase opacity-60">FC</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Selected Vendor Context */}
      {selectedVendor && (
        <section className="bg-surface-container-low p-6 rounded-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-[#001a40] font-bold text-xl uppercase">
              {selectedVendor.nom[0]}{selectedVendor.prenom[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg">{selectedVendor.prenom} {selectedVendor.nom}</h3>
              <p className="text-outline text-sm">ID: {selectedVendor.identifiant_national} • {selectedVendor.emplacement}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase">Montant à percevoir</label>
            <input 
              type="number" 
              className="w-full h-12 px-4 bg-white border border-outline-variant/20 rounded-xl font-black text-xl text-primary"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </section>
      )}

      {/* Action Button */}
      <div className="fixed bottom-24 left-0 w-full px-4">
        <div className="max-w-lg mx-auto">
            <button 
              disabled={!selectedVendor || loading}
              onClick={handlePayment}
              className={`w-full h-[72px] rounded-xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 ${!selectedVendor || loading ? 'bg-outline/20 text-outline cursor-not-allowed' : 'bg-secondary text-white'}`}
            >
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>
                  {loading ? 'sync' : 'check_circle'}
                </span>
                {loading ? 'Traitement...' : 'Enregistrer Paiement'}
            </button>
        </div>
      </div>
    </div>
  );
}
