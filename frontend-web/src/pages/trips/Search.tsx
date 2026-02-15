import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tripsApi, wilayasApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// @ts-ignore
import DatePicker from 'react-datepicker';

const TripSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for filter form (initialized from URL params)
  const [from, setFrom] = useState(searchParams.get('from') || '');
  const [to, setTo] = useState(searchParams.get('to') || '');
  const [date, setDate] = useState<Date | null>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : null
  );
  const [seats, setSeats] = useState(Number(searchParams.get('seats')) || 1);

  // Check if we have active search params
  const hasSearchParams = !!(searchParams.get('from') || searchParams.get('to'));

  // Fetch Wilayas for the select inputs
  const { data: wilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await wilayasApi.getAll();
      return response.data.data || response.data;
    }
  });

  // Fetch trips based on URL params (Only if we have params)
  const { data: trips, isLoading, isError } = useQuery({
    queryKey: ['trips', searchParams.toString()],
    queryFn: async () => {
      const params: any = {};
      if (searchParams.get('from')) params.from = searchParams.get('from');
      if (searchParams.get('to')) params.to = searchParams.get('to');
      if (searchParams.get('date')) params.date = searchParams.get('date');
      if (searchParams.get('seats')) params.seats = searchParams.get('seats');

      const response = await tripsApi.search(params);
      return response.data.data || [];
    },
    enabled: hasSearchParams // Only fetch if we have parameters
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', format(date, 'yyyy-MM-dd'));
    params.append('seats', seats.toString());
    navigate(`/trips/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-slate-100 pb-20">
      {/* Search Header */}
      <div className="bg-background-dark/95 backdrop-blur-md border-b border-white/10 sticky top-[72px] z-40 py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-4 items-end">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-teal transition-colors">location_on</span>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer [&>option]:text-slate-900"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                <option value="">Départ</option>
                {wilayas?.map((w: any) => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                ))}
              </select>
            </div>
            <div className="relative group">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-teal transition-colors">near_me</span>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer [&>option]:text-slate-900"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option value="">Destination</option>
                {wilayas?.map((w: any) => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                ))}
              </select>
            </div>
            <div className="relative group">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-teal transition-colors">event</span>
              <DatePicker
                selected={date}
                onChange={(d: Date | null) => setDate(d)}
                placeholderText="Date"
                locale="fr"
                dateFormat="dd MMMM yyyy"
                minDate={new Date()}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer outline-none"
                calendarClassName="font-sans border-0 rounded-2xl shadow-2xl overflow-hidden bg-white text-slate-800"
                popperPlacement="bottom-start"
              />
            </div>
            <div className="relative group">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-teal transition-colors">person</span>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer [&>option]:text-slate-900"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} Passager{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Fixed Search Button Color: Primary Gold with Black Text */}
          {/* Fixed Search Button Color: Primary Gold with Black Text */}
          <div className="flex gap-2 w-full xl:w-auto">
            {hasSearchParams && (
              <button
                onClick={() => {
                  setFrom('');
                  setTo('');
                  setDate(null);
                  setSeats(1);
                  navigate('/trips/search');
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-xl flex items-center justify-center transition-all shadow-lg min-w-[50px]"
                title="Effacer la recherche"
              >
                <span className="material-icons-round">close</span>
              </button>
            )}
            <button
              onClick={handleSearch}
              className="bg-primary hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl flex-1 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(232,184,75,0.3)] hover:shadow-[0_0_25px_rgba(232,184,75,0.5)] active:scale-95"
            >
              <span className="material-icons-round">search</span>
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!hasSearchParams ? (
          // Empty State / Initial State
          <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-glow">
              <span className="material-icons-round text-5xl text-primary">search</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">Où souhaitez-vous aller ?</h2>
            <p className="text-slate-400 text-lg max-w-lg text-center">
              Sélectionnez votre wilaya de départ et votre destination ci-dessus pour trouver les meilleurs trajets disponibles.
            </p>
          </div>
        ) : (
          // Results View
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display text-white">
                {isLoading ? 'Recherche en cours...' : `${trips?.length || 0} Trajets Dispos`}
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 flex items-center gap-2 text-slate-300 transition-colors">
                  <span className="material-icons-round text-sm">filter_list</span> Filtres
                </button>
                <button className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 flex items-center gap-2 text-slate-300 transition-colors">
                  <span className="material-icons-round text-sm">sort</span> Trier
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 animate-pulse">Recherche des meilleures options...</p>
              </div>
            ) : trips && trips.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {trips.map((trip: any) => (
                  <div key={trip.id} className="bg-accent border border-white/5 hover:border-primary/30 rounded-2xl p-6 transition-all hover:scale-[1.01] shadow-lg group cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col text-center min-w-[60px]">
                            <span className="text-xl font-bold text-white">{format(new Date(trip.departure_time), 'HH:mm')}</span>
                            <span className="text-xs text-slate-500 font-bold uppercase">{trip.from_city}</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-4 relative">
                            <div className="w-full h-[2px] bg-white/10 relative top-3"></div>
                            <div className="flex justify-between w-full text-[10px] text-slate-500 mt-4 font-mono uppercase tracking-wider">
                              <span>{trip.distance || '--- KM'}</span>
                              <span>Direct</span>
                            </div>
                            <span className="material-icons-round absolute top-0 text-slate-600 bg-accent px-2 group-hover:text-primary transition-colors">directions_car</span>
                          </div>
                          <div className="flex flex-col text-center min-w-[60px]">
                            <span className="text-xl font-bold text-slate-400">--:--</span>
                            <span className="text-xs text-slate-500 font-bold uppercase">{trip.to_city}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                              {trip.driver_name?.[0] || 'D'}
                            </div>
                            <span className="font-medium text-slate-300">{trip.driver_name}</span>
                            <span className="flex items-center text-primary text-xs"><span className="material-icons-round text-sm mr-1">star</span> {trip.driver_rating || '5.0'}</span>
                          </div>
                          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <span className="material-icons-round text-sm text-teal">verified_user</span>
                            <span className="text-xs font-bold text-teal">VÉRIFIÉ</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 md:min-w-[150px]">
                        <div className="text-right md:text-center">
                          <span className="block text-2xl font-display text-primary">{trip.price_per_seat} DZD</span>
                          <span className="text-xs text-slate-500">{trip.available_seats} places restantes</span>
                        </div>
                        <button className="bg-white/10 hover:bg-primary hover:text-black text-white text-sm font-medium px-6 py-2 rounded-lg transition-all mt-0 md:mt-4 flex items-center gap-2 group-hover:shadow-glow">
                          Réserver <span className="material-icons-round text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-accent/50 rounded-3xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons-round text-4xl text-slate-600">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Aucun trajet trouvé</h3>
                <p className="text-slate-400 max-w-md mx-auto">Essayez de modifier vos critères de recherche ou de changer la date de départ.</p>
                <button onClick={() => { setFrom(''); setTo(''); setDate(null); setSeats(1); }} className="mt-8 text-primary font-bold hover:underline">
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TripSearch;
