import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login(formData.email, formData.password);
      const { user: userData, accessToken, refreshToken } = res.data.data;
      login(userData, accessToken, refreshToken);
      toast.success('Connexion réussie !');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#08110b] flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-xl relative z-10 transition-all animate-slide-up">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl p-12 lg:p-16 rounded-[3.5rem] border border-white dark:border-slate-800 shadow-elevated">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                <span className="material-symbols-outlined text-slate-900 font-black text-3xl italic">drive_eta</span>
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">RohWin<span className="text-primary">Bghit</span></h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Plateforme de covoiturage</p>
              </div>
            </Link>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 italic">Heureux de vous <span className="text-primary">revoir !</span></h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Connectez-vous pour commencer votre prochain voyage.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-6 mb-3 block">ADRESSE EMAIL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-16 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.75rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm tracking-tight placeholder:text-slate-400"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <div className="flex justify-between items-center mb-3 px-6">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">MOT DE PASSE</label>
                  <Link to="/forgot-password" title="Mot de passe oublié ?" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline italic">Oublié ?</Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-16 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.75rem] focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-sm tracking-tight placeholder:text-slate-400"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-primary focus:ring-primary transition-all cursor-pointer" />
              <label htmlFor="remember" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none uppercase tracking-widest">Rester connecté</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.3em] overflow-hidden shadow-2xl hover:bg-primary hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Synchronisation...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Connexion au Hub
                  <span className="material-symbols-outlined font-black">login</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Pas encore membre ?{' '}
              <Link to="/register" className="text-primary font-black uppercase tracking-widest hover:underline italic ml-1 transition-all">
                Créer un compte profil
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-10 text-center flex items-center justify-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2024 ROHWINBGHIT</p>
          <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sécurisé par biographie</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
