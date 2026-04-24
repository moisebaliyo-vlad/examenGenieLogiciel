import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { statsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getDashboard();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  const chartData = {
    labels: stats?.chart_data?.map((d: any) => d.day) || [],
    datasets: [
      {
        label: 'Recettes (FC)',
        data: stats?.chart_data?.map((d: any) => d.amount) || [],
        backgroundColor: '#003f87',
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: '#0056b3',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1b1c1c',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        display: false,
        grid: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10, weight: 'bold' as const },
          color: '#424752',
        },
      },
    },
  };

  return (
    <div className="px-4 pt-6 space-y-6 animate-in fade-in duration-700">
      
      {/* Main Performance Card */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className="stats-gradient p-6 rounded-2xl text-white shadow-xl ">
          <div className="flex justify-between items-start mb-2">
            <p className="text-white/80 font-semibold text-xs uppercase tracking-widest">Total collecté aujourd'hui</p>
            <span className="material-symbols-outlined text-white/50 animate-pulse">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.25rem] font-black leading-tight tracking-tight">{stats?.total_today?.toLocaleString() || 0}</span>
            <span className="text-xl font-bold opacity-80">FC</span>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
            <span className="text-[10px] font-bold">Mis à jour en temps réel</span>
          </div>
        </div>

        {/* Real-time Status Grid */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-primary mb-2 text-2xl">groups</span>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-1 tracking-wider">Vendeurs actifs</p>
          <p className="text-2xl font-black text-primary">{stats?.active_vendors || 0}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-secondary mb-2 text-2xl">engineering</span>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-1 tracking-wider">Agents terrain</p>
          <p className="text-2xl font-black text-secondary">{stats?.field_agents || 0}</p>
        </div>
        {currentUser?.is_admin && (
          <div 
            onClick={() => navigate('/admin/users')}
            className="bg-primary-container/20 p-5 rounded-2xl border border-primary/20 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-primary mb-2 text-2xl group-hover:scale-110 transition-transform">manage_accounts</span>
            <p className="text-primary text-[10px] font-bold uppercase mb-1 tracking-wider">Système</p>
            <p className="text-xl font-black text-primary">Comptes</p>
          </div>
        )}
      </section>
      

      {/* Evolution des recettes (Chart.js Bar Chart) */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
        <h3 className="font-bold text-lg mb-6 tracking-tight">Évolution des recettes</h3>
        <div className="h-64 px-2">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>

      {/* Alerts & Signals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-lg">Alertes prioritaires</h3>
          <span className="text-primary font-bold text-sm cursor-pointer hover:underline">Voir tout</span>
        </div>
        
        {/* Vendeurs Impayés Card */}
        <div className="bg-tertiary-container/10 p-5 rounded-2xl border border-tertiary/10 flex items-center gap-4 cursor-pointer hover:bg-tertiary-container/15 transition-colors">
          <div className="bg-tertiary-container p-3 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-on-tertiary-fixed-variant">Vendeurs Impayés</p>
            <p className="text-sm text-on-tertiary-fixed-variant/70">Analyse de conformité requise</p>
          </div>
          <span className="material-symbols-outlined text-tertiary">chevron_right</span>
        </div>

        {/* Signalements Card */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="bg-surface-container-high p-3 rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant">report_problem</span>
          </div>
          <div className="flex-1">
            <p className="font-bold">Signalements en attente</p>
            <p className="text-sm text-on-surface-variant">{stats?.pending_signals || 0} incidents à traiter</p>
          </div>
          {stats?.pending_signals > 0 && <div className="bg-error text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">NOUVEAU</div>}
        </div>
      </div>


      <section className="pb-8">
        <h3 className="font-bold text-lg mb-4 px-1">Dernières Collectes</h3>
        <div className="space-y-3">
          {stats?.recent_activities?.map((activity: any) => (
            <ActivityItem 
              key={activity.id}
              name={activity.vendeur_name} 
              location={activity.taxe_nom} 
              time={new Date(activity.date).toLocaleTimeString()} 
              amount={activity.montant.toLocaleString()} 
            />
          ))}
          {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
            <p className="text-center text-on-surface-variant text-sm py-4">Aucune activité récente</p>
          )}
        </div>
      </section>

    </div>
  );
}

function ActivityItem({ name, location, time, amount }: { name: string; location: string; time: string; amount: string }) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow border border-outline-variant/5">
      <div>
        <p className="font-bold text-on-surface">{name}</p>
        <p className="text-xs text-on-surface-variant">{location} • {time}</p>
      </div>
      <div className="text-right">
        <p className="font-black text-secondary">{amount} FC</p>
        <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full uppercase tracking-tighter">PAYÉ</span>
      </div>
    </div>
  );
}
