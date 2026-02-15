import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { wilayasApi } from '../services/api';
// @ts-ignore
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale/fr';
import { format } from 'date-fns';

registerLocale('fr', fr);

const Home = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [seats, setSeats] = useState(1);

  // Fetch Wilayas
  const { data: wilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await wilayasApi.getAll();
      return response.data.data || response.data;
    }
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (startDate) params.append('date', format(startDate, 'yyyy-MM-dd'));
    params.append('seats', seats.toString());
    navigate(`/trips/search?${params.toString()}`);
  };

  return (
    <div className="font-sans antialiased text-slate-800 dark:text-slate-100 bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* ... (Hero Image & Content - Unchanged) ... */}
        <img
          alt="Algerian Desert Landscape"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYGckyaVLE6nw2nGTIpoTG4OzP1h_6QVFsuzusghIchfrYuwAGGeMg_l_KqZZNnxlCiNeqOm3HDuAMJ9NSFMYYQSiyby3Kyp_lEJd3Av4JVhj0gUCR2MhvnyhOyRYMg3HKvMCibsdGjt_ltFDjeSWUddhLW1zEkU01PGobBxikA37YiYq-28XdfALeTu6jh13e9aIzOyUKBRijL2yDfl6kACAikp-CulLlJqpgmDp8WWEt09tcRwb9NIygsIOjeO4RgaTX8IuLuF9_"
        />
        <div className="absolute inset-0 hero-gradient"></div>

        <div className="relative z-10 text-center max-w-4xl mb-12 animate-fade-up">
          <h2 className="text-6xl md:text-8xl font-display text-white mb-4 tracking-tight drop-shadow-lg">
            VOTRE DESTINATION, <span className="text-primary">NOTRE PASSION.</span>
          </h2>
          <p className="text-xl text-slate-200 font-light max-w-2xl mx-auto drop-shadow-md">
            Explorez l'Algérie avec élégance. Le premier réseau de transport haut de gamme inter-wilayas.
          </p>
        </div>

        <div className="relative z-20 w-full max-w-[95vw] lg:max-w-7xl animate-fade-up flex flex-col gap-4 mt-24" style={{ animationDelay: '0.2s' }}>
          {/* SEARCH TABS */}
          <div className="flex items-center gap-6 px-4">
            <button className="bg-white text-slate-900 font-bold text-base px-6 py-2 rounded-t-xl flex items-center gap-2 shadow-lg">
              <span className="material-icons-round text-primary">directions_car</span>
              Covoiturage
            </button>
            <button className="bg-white/10 hover:bg-white text-slate-200 hover:text-slate-900 font-medium text-base px-6 py-2 rounded-t-xl flex items-center gap-2 transition-all">
              <span className="material-icons-round">directions_bus</span>
              Bus
            </button>
            <button className="bg-white/10 hover:bg-white text-slate-200 hover:text-slate-900 font-medium text-base px-6 py-2 rounded-t-xl flex items-center gap-2 transition-all">
              <span className="material-icons-round">train</span>
              Train
            </button>
          </div>

          {/* MAIN SEARCH BAR - LONG STRIP */}
          <div className="bg-white rounded-[20px] shadow-2xl p-2 flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-[80px]">

            {/* DEPARTURE */}
            <div className="flex-1 w-full lg:w-auto flex items-center px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl group relative">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-2xl mr-3">radio_button_unchecked</span>
              <div className="flex flex-col w-full">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Départ</label>
                <select
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold text-lg cursor-pointer focus:ring-0 outline-none leading-tight truncate appearance-none"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  <option value="" className="text-slate-300">D'où partez-vous ?</option>
                  {wilayas?.map((w: any) => (
                    <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DESTINATION */}
            <div className="flex-1 w-full lg:w-auto flex items-center px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl group relative">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-2xl mr-3">radio_button_unchecked</span>
              <div className="flex flex-col w-full">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destination</label>
                <select
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold text-lg cursor-pointer focus:ring-0 outline-none leading-tight truncate appearance-none"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  <option value="" className="text-slate-300">Où allez-vous ?</option>
                  {wilayas?.map((w: any) => (
                    <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DATE */}
            <div className="w-full lg:w-[220px] flex items-center px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl group relative">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-2xl mr-3">calendar_today</span>
              <div className="flex flex-col w-full">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  placeholderText="Aujourd'hui"
                  locale="fr"
                  dateFormat="dd MMM yyyy"
                  minDate={new Date()}
                  className="bg-transparent border-none focus:ring-0 w-full p-0 text-slate-900 font-bold text-lg placeholder-slate-900 cursor-pointer outline-none active:outline-none"
                  calendarClassName="font-sans border-0 rounded-2xl shadow-2xl overflow-hidden bg-white text-slate-800"
                  popperPlacement="bottom-start"
                />
              </div>
            </div>

            {/* PASSENGERS */}
            <div className="w-full lg:w-[180px] flex items-center px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl group relative">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-2xl mr-3">person_outline</span>
              <div className="flex flex-col w-full">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Passagers</label>
                <select
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold text-lg cursor-pointer focus:ring-0 outline-none leading-tight appearance-none"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Passager{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BUTTON */}
            <div className="p-2 w-full lg:w-auto">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto h-full bg-[#00AFF5] hover:bg-[#0099d6] text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center min-w-[140px]"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-6 relative z-30 pb-20 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-primary/30 group">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors">
              <span className="material-icons-round text-slate-900 dark:text-white text-3xl group-hover:text-inherit">directions_car</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Covoiturage</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Partagez vos trajets avec des voyageurs raffinés partout en Algérie.</p>
            <div onClick={() => navigate('/trips/search')} className="flex items-center text-primary font-bold cursor-pointer hover:underline decoration-primary underline-offset-4">
              En savoir plus <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-[#00AFF5]/30 group">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00AFF5] group-hover:text-white transition-colors">
              <span className="material-icons-round text-slate-900 dark:text-white text-3xl group-hover:text-inherit">directions_bus</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Bus Premium</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Plus de 48 wilayas desservies dans un confort absolu dès 1200 DA.</p>
            <div className="flex items-center text-[#00AFF5] font-bold cursor-pointer hover:underline decoration-[#00AFF5] underline-offset-4">
              Réserver <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-primary/30 group">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors">
              <span className="material-icons-round text-slate-900 dark:text-white text-3xl group-hover:text-inherit">train</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Train SNTF</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Billets sans frais supplémentaires. Le voyage iconique par excellence.</p>
            <div className="flex items-center text-primary font-bold cursor-pointer hover:underline decoration-primary underline-offset-4">
              Horaires <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="py-20 bg-slate-50 dark:bg-transparent berber-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display tracking-wide mb-2 text-slate-900 dark:text-white">LE MEILLEUR D'ALGÉRIE</h2>
              <p className="text-slate-500 dark:text-slate-400 font-light">Explorez nos joyaux nationaux à des tarifs exceptionnels.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 font-bold text-primary hover:underline underline-offset-4 transition-all">
              Voir tout <span className="material-icons-round">east</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Alger Card */}
            <div onClick={() => navigate('/trips/search?to=16')} className="group bg-white dark:bg-accent rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02] cursor-pointer">
              <div className="h-48 relative overflow-hidden">
                <img alt="Alger" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://source.unsplash.com/1600x900/?Algiers,skyline,sunset" />
                <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-primary font-bold text-xs ring-1 ring-primary/20">POPULAIRE</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <span className="material-icons-round text-sm">route</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Oran → Alger</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Alger la Blanche</h4>
                    <p className="text-slate-500 text-sm">À partir de <span className="text-primary font-bold">1,500 DA</span></p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-icons-round">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Constantine Card */}
            <div onClick={() => navigate('/trips/search?to=25')} className="group bg-white dark:bg-accent rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02] cursor-pointer">
              <div className="h-48 relative overflow-hidden">
                <img alt="Constantine" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://source.unsplash.com/1600x900/?Constantine,Algeria,bridge" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <span className="material-icons-round text-sm">route</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Alger → Constantine</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Constantine</h4>
                    <p className="text-slate-500 text-sm">À partir de <span className="text-primary font-bold">1,800 DA</span></p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-icons-round">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Oran Card */}
            <div onClick={() => navigate('/trips/search?to=31')} className="group bg-white dark:bg-accent rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02] cursor-pointer">
              <div className="h-48 relative overflow-hidden">
                src="https://source.unsplash.com/1600x900/?Oran,Algeria,sunset"
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <span className="material-icons-round text-sm">route</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Tlemcen → Oran</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Oran El Bahia</h4>
                    <p className="text-slate-500 text-sm">À partir de <span className="text-primary font-bold">1,200 DA</span></p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-icons-round">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ghardaia Card */}
            <div onClick={() => navigate('/trips/search?to=47')} className="group bg-white dark:bg-accent rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02] cursor-pointer">
              <div className="h-48 relative overflow-hidden">
                <img alt="Ghardaia" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://source.unsplash.com/1600x900/?Ghardaia,Mzab,valley" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <span className="material-icons-round text-sm">route</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Alger → Ghardaia</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Ghardaia</h4>
                    <p className="text-slate-500 text-sm">À partir de <span className="text-primary font-bold">2,500 DA</span></p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-icons-round">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECURITY/INFO SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl relative z-10">
            <img
              alt="Security Illustration"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDvEwsnh3UOwMcQ9OMT6BzK0fIk_qo5a6R9RQf8oalPOkJdhESfZ0CzGHHi_oKIHidCrBQzYlKPYWxVsDsPatM3cHWjvCnpeitELcEcRHKb1oMHJNgkqB25fT8xjDecvICSpdwRf2B_SwT2CEnYwY6KmsmVooIulwepEQzqPbn1YqMm6yZKH84DgB1Q2yehmUEv3mNWjiM0SMWnKBNcwftqCLZgSNw2avabx7L1a_YWxYM9wLLdC9RQyv8btzK4x8nKJdX4vRGKXRX"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" }}
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 border-8 border-primary/20 rounded-full z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 berber-pattern opacity-50 z-0"></div>
        </div>
        <div>
          <h2 className="text-5xl font-display mb-8 leading-tight text-white">VOTRE SÉCURITÉ EST <span className="text-teal">NOTRE PRIORITÉ</span></h2>
          <div className="space-y-8">
            <div className="flex gap-6 group">
              <div className="shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-icons-round">verified_user</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Identités vérifiées</h4>
                <p className="text-slate-500 dark:text-slate-400">Chaque membre est vérifié pour garantir une communauté de confiance et de respect mutuel.</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="shrink-0 h-12 w-12 rounded-full bg-teal/10 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-background-dark transition-colors">
                <span className="material-icons-round">support_agent</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Assistance 24/7</h4>
                <p className="text-slate-500 dark:text-slate-400">Une équipe locale dédiée pour vous accompagner durant tout votre voyage, partout en Algérie.</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-icons-round">security</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Paiement Sécurisé</h4>
                <p className="text-slate-500 dark:text-slate-400">Des transactions transparentes et sécurisées via BaridiMob et carte CIB.</p>
              </div>
            </div>
          </div>
          <button className="mt-12 bg-background-dark dark:bg-white text-white dark:text-background-dark px-8 py-4 rounded-xl font-bold hover:bg-primary dark:hover:bg-primary transition-all flex items-center gap-3">
            EN SAVOIR PLUS <span className="material-icons-round text-sm">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
