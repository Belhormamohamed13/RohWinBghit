import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast('Veuillez remplir tous les champs.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Debug: log the response
      console.log('Login response:', response.data);

      // Backend wraps response in { success, message, data, timestamp }
      const responseData = response.data.data;
      const token = responseData?.accessToken;
      const user = responseData?.user;

      if (!token || !user) {
        console.log('Missing token or user:', { token, user, responseData });
        throw new Error('Invalid response from server');
      }

      // Use authStore login
      login(user, token, responseData.refreshToken);

      showToast('Connexion réussie !', 'success');

      setTimeout(() => {
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'driver') {
          navigate('/driver');
        } else {
          navigate('/passenger');
        }
      }, 1200);
    } catch (error: any) {
      showToast(error.response?.data?.message || error.message || 'Identifiants invalides', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_10%,rgba(212,168,83,0.04),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(212,168,83,0.03),transparent_60%),radial-gradient(ellipse_50%_70%_at_50%_50%,rgba(10,11,14,0),#0a0b0e_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="w-full max-w-[480px] relative z-10 animate-[fadeUp_0.6s_ease_both]">
        <div className="bg-[rgba(16,18,24,0.85)] backdrop-blur-[24px] p-12 rounded-[28px] border border-[rgba(255,255,255,0.07)] shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] bg-[radial-gradient(circle,rgba(212,168,83,0.06),transparent_70%)] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 no-underline">
              <div className="w-12 h-12 bg-gradient-to-br from-sand-300 to-sand-500 rounded-[10px] flex items-center justify-center text-2xl shadow-[0_0_24px_rgba(212,168,83,0.3)] transition-transform duration-300 hover:rotate-3">
                🚗
              </div>
              <span className="font-['Bebas_Neue'] text-[30px] tracking-[4px] bg-gradient-to-r from-sand-100 to-sand-300 bg-clip-text text-transparent">
                ROHWINBGHIT
              </span>
            </Link>
            <h1 className="font-['Bebas_Neue'] text-[42px] tracking-[4px] text-[#f0e8d5] mb-2">CONNEXION</h1>
            <p className="text-[#6b6455] text-sm font-normal">Entrez vos identifiants pour accéder à votre espace.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10">
            {/* Email */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="email" className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px]">Adresse Email</label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl z-10">mail</span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3.5 pl-11 bg-night-900 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)] relative z-0"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px]">Mot de Passe</label>
                <Link to="/forgot-password" className="font-['JetBrains_Mono'] text-[10px] font-bold text-sand-300 no-underline uppercase tracking-[2px] hover:text-sand-200 transition-colors">Oublié ?</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl z-10">lock</span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 pl-11 bg-night-900 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)] relative z-0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sand-300 text-night-900 border-none rounded-xl font-['JetBrains_Mono'] text-[13px] font-bold tracking-[2.5px] uppercase cursor-pointer shadow-[0_0_30px_rgba(212,168,83,0.25),0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-sand-400 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,168,83,0.35),0_6px_20px_rgba(0,0,0,0.5)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-night-900 border-t-transparent rounded-full animate-spin" />
                  CONNEXION...
                </>
              ) : (
                'ACCÉDER AU COMPTE'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] text-center">
            <p className="text-[#6b6455] text-sm">
              Pas encore de compte ?<Link to="/register" className="text-sand-300 font-bold no-underline ml-1 hover:text-sand-200 transition-colors">S'inscrire gratuitement</Link>
            </p>
          </div>
        </div>

        {/* Page Footer */}
        <div className="mt-7 text-center">
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#3d3830] uppercase tracking-[2.5px]">© 2026 ROHWINBGHIT — SECURE ACCESS</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 p-3.5 rounded-xl text-[13px] font-semibold flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 z-50 max-w-[360px] ${toast.type === 'success' ? 'bg-[#1a2e1a] border border-[rgba(74,222,128,0.2)] text-green-400' : 'bg-[#2e1a1a] border border-[rgba(248,113,113,0.2)] text-red-400'} ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <span className="material-symbols-outlined text-lg">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
