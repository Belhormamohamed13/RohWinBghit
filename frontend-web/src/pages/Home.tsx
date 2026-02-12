import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { wilayasApi } from '../services/api';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Users2,
  PlusCircle,
  Navigation
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    date: '',
    seats: 1
  });

  const { data: wilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await wilayasApi.getAll();
      return response.data.data;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchFilters.from) params.append('from', searchFilters.from);
    if (searchFilters.to) params.append('to', searchFilters.to);
    if (searchFilters.date) params.append('date', searchFilters.date);
    params.append('seats', searchFilters.seats.toString());
    navigate(`/trips/results?${params.toString()}`);
  };

  const benefits = [
    {
      title: 'Économique',
      desc: 'Économisez sur chaque trajet en partageant les frais de carburant. Parfait pour les étudiants et les navetteurs réguliers.',
      icon: Wallet,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Sûr & Sécurisé',
      desc: 'Profils vérifiés, documents obligatoires et système de notation robuste pour votre tranquillité d\'esprit.',
      icon: ShieldCheck,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Communauté Locale',
      desc: 'Connectez-vous avec des milliers d\'Algériens. Faites de nouvelles rencontres et transformez vos trajets en moments agréables.',
      icon: Users2,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  const popularRoutes = [
    { from: 'Alger', to: 'Blida', price: '500', trips: '45', image: 'https://images.unsplash.com/photo-1578912995058-29307779f42b?auto=format&fit=crop&q=80&w=400' },
    { from: 'Alger', to: 'Oran', price: '1,200', trips: '12', image: 'https://images.unsplash.com/photo-1594226801341-43387fae51ca?auto=format&fit=crop&q=80&w=400' },
    { from: 'Constantine', to: 'Annaba', price: '900', trips: '8', image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=400' },
    { from: 'Alger', to: 'Ghardaïa', price: '2,500', trips: '4', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30eba?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08110b] selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-white dark:bg-[#08110b]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Voyagez à travers <br />
                  <span className="text-primary italic">l'Algérie</span>, <br />
                  en toute sécurité.
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
                  Connectez-vous avec des conducteurs fiables ou partagez votre trajet pour réduire vos frais. Rejoignez la plus grande communauté de covoiturage au pays.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"
                      alt="User"
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-primary flex items-center justify-center text-[10px] font-black text-slate-900 shadow-sm">
                    50K+
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">Approuvé par +50,000 voyageurs</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-white p-3 border border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=1200"
                  className="rounded-[2.5rem] w-full aspect-[4/3] object-cover"
                  alt="Scenario Algerie"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary text-slate-900 p-6 rounded-[2rem] shadow-2xl -rotate-6 border-4 border-white dark:border-slate-900">
                <p className="text-sm font-black uppercase tracking-tight">Voyagez Malin</p>
                <p className="text-xs font-bold opacity-80 mt-1 italic leading-none">Alger → Oran dès 800 DZD</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-elevated p-3 border border-slate-200 dark:border-slate-800"
        >
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:divide-x divide-slate-100 dark:divide-slate-800">
            {/* Departure */}
            <div className="flex-1 flex items-center px-6 py-4 gap-4">
              <MapPin className="text-primary w-6 h-6 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">DÉPART</label>
                <select
                  value={searchFilters.from}
                  onChange={(e) => setSearchFilters({ ...searchFilters, from: e.target.value })}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-900 dark:text-white font-bold text-base placeholder:text-slate-300 appearance-none"
                >
                  <option value="">D'où partez-vous ?</option>
                  {wilayas?.map((w: any) => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
                </select>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex-1 flex items-center px-6 py-4 gap-4">
              <Navigation className="text-slate-400 w-6 h-6 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">DESTINATION</label>
                <select
                  value={searchFilters.to}
                  onChange={(e) => setSearchFilters({ ...searchFilters, to: e.target.value })}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-900 dark:text-white font-bold text-base placeholder:text-slate-300 appearance-none"
                >
                  <option value="">Où allez-vous ?</option>
                  {wilayas?.map((w: any) => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="flex-1 flex items-center px-6 py-4 gap-4">
              <Calendar className="text-slate-400 w-6 h-6 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">DATE</label>
                <input
                  type="date"
                  value={searchFilters.date}
                  onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-900 dark:text-white font-bold text-base transition-all dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="w-full lg:w-48 flex items-center px-6 py-4 gap-4">
              <Users className="text-slate-400 w-6 h-6 shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">PASSAGERS</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={searchFilters.seats}
                  onChange={(e) => setSearchFilters({ ...searchFilters, seats: parseInt(e.target.value) })}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-900 dark:text-white font-bold text-base"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="p-2">
              <button
                type="submit"
                className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-slate-900 font-black py-5 px-10 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest"
              >
                <Search className="w-5 h-5" />
                Rechercher
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">
              Pourquoi choisir <span className="text-primary italic">RohWinBghit</span> ?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              La façon la plus simple de voyager entre les villes algériennes sans se ruiner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-elevated transition-all group"
              >
                <div className={`w-16 h-16 ${benefit.bg} ${benefit.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase leading-none italic">{benefit.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-white dark:bg-slate-900/30 py-32 rounded-[5rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 text-left">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Trajets Populaires</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Découvrez où les autres voyageurs se rendent aujourd'hui.</p>
            </div>
            <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:gap-5 transition-all group">
              Voir tous les trajets
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={route.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={route.to}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                    Dès {route.price} DZD
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-black text-slate-900 dark:text-white text-lg italic uppercase tracking-tight">{route.from} → {route.to}</p>
                  <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-[0.2em]">{route.trips} trajets dispos aujourd'hui</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 dark:bg-primary/10 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-white dark:text-primary leading-[1.1] tracking-tight italic">
                Prêt à partager votre <br /> prochain voyage ?
              </h2>
              <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto text-lg font-medium italic">
                Devenez conducteur et amortissez vos frais de route dès aujourd'hui.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/register" className="bg-primary hover:bg-primary/90 text-slate-900 font-black py-6 px-12 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                  <PlusCircle className="w-5 h-5" />
                  Publier un trajet
                </Link>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white font-black py-6 px-12 rounded-2xl transition-all uppercase tracking-widest text-xs backdrop-blur-md border border-white/10">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-[#08110b] border-t border-slate-100 dark:border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                  <Navigation className="w-6 h-6 text-slate-900 font-black" />
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic">RohWin<span className="text-primary italic">Bghit</span></span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                La plateforme de covoiturage la plus fiable d'Algérie. Ensemble, connectons nos villes.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] italic">Top Trajets</h4>
              <ul className="space-y-3">
                {['Alger - Oran', 'Alger - Constantine', 'Sétif - Alger', 'Oran - Tlemcen'].map(link => (
                  <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">{link}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] italic">À propos</h4>
              <ul className="space-y-3">
                {['Comment ça marche', 'Sécurité', 'Centre d\'aide', 'Nous contacter'].map(link => (
                  <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">{link}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] italic">Légal</h4>
              <ul className="space-y-3">
                {['Conditions d\'utilisation', 'Confidentialité', 'Cookies'].map(link => (
                  <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">© 2024 RohWinBghit. Tous droits réservés.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined text-2xl font-black italic">language</span></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined text-2xl font-black italic">share</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
