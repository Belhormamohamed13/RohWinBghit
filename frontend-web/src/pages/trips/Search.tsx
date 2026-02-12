import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { wilayasApi } from '../../services/api';
import DateUtil from '../../utils/dateUtil';

const TripSearch = () => {
  const navigate = useNavigate();
  const [fromWilaya, setFromWilaya] = useState('');
  const [toWilaya, setToWilaya] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const { data: wilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await wilayasApi.getAll();
      return response.data.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromWilaya) params.append('from', fromWilaya);
    if (toWilaya) params.append('to', toWilaya);
    if (date) params.append('date', date);
    params.append('seats', seats.toString());

    navigate(`/trips/results?${params.toString()}`);
  };

  const swapLocations = () => {
    setFromWilaya(toWilaya);
    setToWilaya(fromWilaya);
  };

  const availableDates = DateUtil.getAvailableTripDates();

  return (
    <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#08110b] relative overflow-hidden flex items-center justify-center p-6 selection:bg-primary/30">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10 transition-all animate-slide-up">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full mb-8 shadow-soft">
            <span className="material-symbols-outlined text-primary text-xl">explore</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 italic">Plateforme de Mobility Intelligence</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic">Où <span className="text-primary">l'aventure</span> commence ?</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-4 max-w-lg mx-auto">Trouvez votre prochain trajet parmi des milliers de conducteurs certifiés.</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl p-10 lg:p-14 rounded-[3.5rem] border border-white dark:border-slate-800 shadow-elevated">
          <form onSubmit={handleSearch} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-end relative">
              {/* Departure */}
              <div className="lg:col-span-5 group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-3 block">WILAYA DE DÉPART</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">location_on</span>
                  <select
                    value={fromWilaya}
                    onChange={(e) => setFromWilaya(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.75rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white tracking-tighter appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white dark:bg-slate-900">Origine</option>
                    {wilayas?.map((w: any) => (
                      <option key={w.code} value={w.code} className="bg-white dark:bg-slate-900">{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center mb-1">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center shadow-xl hover:rotate-180 transition-all duration-500 group"
                >
                  <span className="material-symbols-outlined font-black group-hover:scale-110">sync_alt</span>
                </button>
              </div>

              {/* Arrival */}
              <div className="lg:col-span-5 group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-3 block">WILAYA DE DESTINATION</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">flag</span>
                  <select
                    value={toWilaya}
                    onChange={(e) => setToWilaya(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.75rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white tracking-tighter appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white dark:bg-slate-900">Destination</option>
                    {wilayas?.map((w: any) => (
                      <option key={w.code} value={w.code} className="bg-white dark:bg-slate-900">{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-3 block">DATE DU DÉPART</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">calendar_today</span>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.75rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                  >
                    <option value="" className="bg-white dark:bg-slate-900">Aujourd'hui / Toute date</option>
                    {availableDates.map((d: any) => (
                      <option key={d.value} value={d.value} className="bg-white dark:bg-slate-900">{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-3 block">NOMBRE DE PASSAGERS</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">groups</span>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full pl-16 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.75rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n} className="bg-white dark:bg-slate-900">{n} Passager{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-6 bg-[#13ec6d] text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-[#13ec6d]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
              <span className="material-symbols-outlined font-black group-hover:rotate-12 transition-transform">rocket_launch</span>
              Lancer la recherche
            </button>
          </form>
        </div>

        {/* Popular Destinations Spotlight */}
        <div className="mt-16 text-center animate-fade-in delay-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">DESTINATIONS POPULAIRES CETTE SEMAINE</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { from: '16', to: '31', label: 'Alger → Oran' },
              { from: '16', to: '25', label: 'Alger → Constantine' },
              { from: '31', to: '13', label: 'Oran → Tlemcen' },
            ].map((route, i) => (
              <button
                key={i}
                onClick={() => {
                  setFromWilaya(route.from);
                  setToWilaya(route.to);
                }}
                className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary/40 hover:shadow-soft transition-all"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSearch;
