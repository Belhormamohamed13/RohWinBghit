import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'passenger', // Default role
      });
      toast.success('Compte créé avec succès !');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#08110b] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden selection:bg-primary/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 transition-all animate-slide-up">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl p-10 lg:p-14 rounded-[3.5rem] border border-white dark:border-slate-800 shadow-elevated overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                <span className="material-symbols-outlined text-slate-900 font-black text-2xl italic">drive_eta</span>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">RohWin<span className="text-primary italic">Bghit</span></h2>
              </div>
            </Link>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 italic">Rejoignez <span className="text-primary">l'élite.</span></h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Créez votre profil et commencez l'expérience dès aujourd'hui.</p>
          </div>

          {/* Form - Multicolumn for Desktop */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">PRÉNOM</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">person</span>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm"
                    placeholder="Ahmed"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">NOM</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">badge</span>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm"
                    placeholder="Rahmani"
                    required
                  />
                </div>
              </div>

              <div className="group relative md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">ADRESSE EMAIL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">mail</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm"
                    placeholder="ahmed@example.dz"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">TÉLÉPHONE</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">call</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm"
                    placeholder="+213 5XX XX XX XX"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">TYPE DE COMPTE</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">account_circle</span>
                  <select className="w-full pl-14 pr-10 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer">
                    <option value="passenger">Passager uniquement</option>
                    <option value="driver">Conducteur & Passager</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">MOT DE PASSE</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">lock_open</span>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-2 block">CONFIRMATION</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">check_circle</span>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 px-6 mt-4">
              <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-primary focus:ring-primary transition-all cursor-pointer" />
              <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">
                J'accepte les <span className="text-primary font-black underline cursor-pointer">conditions d'utilisation</span> et la <span className="text-primary font-black underline cursor-pointer">politique de confidentialité</span> de RohWinBghit.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.3em] overflow-hidden shadow-2xl hover:bg-primary hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Invasion en cours...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Forger mon profil
                  <span className="material-symbols-outlined font-black">person_add</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Déjà parmi nous ?{' '}
              <Link to="/login" className="text-primary font-black uppercase tracking-widest hover:underline italic ml-1">
                S'identifier
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
