import React, { useState, useEffect } from 'react';
import { signalementsApi } from '../services/api';
import { useAppSelector } from '../store/hooks';

export default function Signalements() {
  const [typeAbus, setTypeAbus] = useState('Extorsion / Frais illégaux');
  const [nomAgent, setNomAgent] = useState('');
  const [description, setDescription] = useState('');
  const [signalements, setSignalements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const { token, role } = useAppSelector((state) => state.auth);

  const fetchSignalements = async () => {
    setLoading(true);
    try {
      const data = await signalementsApi.getAll();
      setSignalements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignalements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      const payload = {
        sujet: typeAbus,
        description: `Agent: ${nomAgent}\n\n${description}`
      };
      await signalementsApi.create(payload, token);
      setMessage('Signalement envoyé avec succès !');
      setTypeAbus('Extorsion / Frais illégaux');
      setNomAgent('');
      setDescription('');
      fetchSignalements();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcess = async (sigId: number, status: string) => {
    if (!token) return;
    try {
      await signalementsApi.update(sigId, { statut: status }, token);
      fetchSignalements();
      setMessage(`Signalement marqué comme ${status}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 py-6 space-y-8 max-w-md mx-auto pb-24">
      {message && (
        <div className={`p-4 rounded-xl text-center font-bold ${message.includes('succès') || message.includes('marqué') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {role !== 'admin' && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">Nouveau Signalement</h2>
            <span className="bg-tertiary-container text-[#ffc2a3] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Alerte Éthique</span>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(27,28,28,0.04)] space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Type d'abus</label>
              <div className="relative">
                <select 
                  value={typeAbus}
                  onChange={(e) => setTypeAbus(e.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-lg h-14 px-4 font-medium text-on-surface focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option>Extorsion / Frais illégaux</option>
                  <option>Harcèlement</option>
                  <option>Abus de pouvoir</option>
                  <option>Non-délivrance de quittance</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">expand_more</span>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Nom de l'agent concerné</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-high border-none rounded-lg h-14 px-4 font-medium text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary" 
                  placeholder="Entrez le nom ou matricule" 
                  type="text" 
                  value={nomAgent}
                  onChange={(e) => setNomAgent(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-4 text-outline">badge</span>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Description des faits</label>
              <textarea 
                className="w-full bg-surface-container-high border-none rounded-lg p-4 font-medium text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary" 
                placeholder="Détaillez l'incident avec précision (date, heure, lieu)..." 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button 
              disabled={submitting}
              className="w-full bg-primary text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">{submitting ? 'sync' : 'send'}</span>
              {submitting ? 'Envoi...' : 'Soumettre le signalement'}
            </button>
          </form>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">{role === 'admin' ? 'Tous les Signalements' : 'Mes Signalements'}</h2>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-8">Chargement...</p>
          ) : signalements.map((s) => (
            <div key={s.id} className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-tertiary shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-tertiary uppercase tracking-tighter">REF: #SIG-{s.id}</span>
                  <h3 className="font-bold text-lg leading-tight">{s.sujet}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.statut === 'Résolu' ? 'bg-green-100 text-green-800' : s.statut === 'Rejeté' ? 'bg-red-100 text-red-800' : 'bg-tertiary-fixed text-[#773200]'}`}>
                  {s.statut}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">{s.description}</p>
              
              {role === 'admin' && s.statut === 'Ouvert' && (
                <div className="flex gap-2 mb-4">
                  <button onClick={() => handleProcess(s.id, 'En cours')} className="flex-1 py-2 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-lg">Traiter</button>
                  <button onClick={() => handleProcess(s.id, 'Résolu')} className="flex-1 py-2 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-lg">Résoudre</button>
                  <button onClick={() => handleProcess(s.id, 'Rejeté')} className="flex-1 py-2 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-lg">Rejeter</button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                <span className="text-outline text-[10px] font-medium">{new Date(s.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {signalements.length === 0 && !loading && (
            <p className="text-center py-12 text-outline">Aucun signalement trouvé.</p>
          )}
        </div>
      </section>
    </div>
  );
}
