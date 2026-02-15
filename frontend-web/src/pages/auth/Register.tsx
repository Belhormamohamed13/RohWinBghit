import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'passenger',
    carBrand: '',
    carModel: '',
    carYear: '',
    carPlate: '',
  });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      showToast('Veuillez remplir tous les champs.', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
    if (!terms) {
      showToast('Veuillez accepter les conditions d\'utilisation.', 'error');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'driver' && {
          vehicle: {
            brand: formData.carBrand,
            model: formData.carModel,
            year: parseInt(formData.carYear),
            plate: formData.carPlate,
          }
        })
      };

      const response = await api.post('/auth/register', userData);

      showToast('Compte créé avec succès !', 'success');

      setTimeout(() => {
        navigate('/login');
      }, 1400);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Une erreur est survenue. Réessayez.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(45,212,191,0.03),transparent_60%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(212,168,83,0.04),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="w-full max-w-[640px] relative z-10 animate-[fadeUp_0.6s_ease_both]">
        <div className="bg-[rgba(16,18,24,0.85)] backdrop-blur-[24px] p-12 rounded-[28px] border border-[rgba(255,255,255,0.07)] shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-[-80px] left-[-80px] w-[260px] h-[260px] bg-[radial-gradient(circle,rgba(45,212,191,0.04),transparent_70%)] rounded-full pointer-events-none" />

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
            <h1 className="font-['Bebas_Neue'] text-[42px] tracking-[4px] text-[#f0e8d5] mb-2">INSCRIPTION</h1>
            <p className="text-[#6b6455] text-sm">Rejoignez la plus grande communauté de covoiturage en Algérie.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10">
            {/* Role Selector */}
            <div className="mb-7">
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-3 block">Je suis un</span>
              <div className="grid grid-cols-2 gap-3">
                <label className={`role-card passenger cursor-pointer ${formData.role === 'passenger' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="passenger"
                    checked={formData.role === 'passenger'}
                    onChange={() => handleRoleChange('passenger')}
                    className="hidden"
                  />
                  <div className={`flex flex-col items-center justify-center gap-[10px] p-5 bg-night-700 border-[1.5px] border-[rgba(255,255,255,0.07)] rounded-4xl transition-all duration-300 text-center ${formData.role === 'passenger' ? 'border-sand-300 bg-[rgba(212,168,83,0.06)] shadow-[0_0_0_3px_rgba(212,168,83,0.08),inset_0_0_20px_rgba(212,168,83,0.04)]' : 'hover:border-[rgba(212,168,83,0.25)]'}`}>
                    <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-[#3d3830]">person</span>
                    </div>
                    <span className="font-['Bebas_Neue'] text-lg tracking-[2px] text-[#f0e8d5]">Passager</span>
                    <span className="text-[11px] text-[#6b6455] leading-relaxed">Je cherche un trajet</span>
                    <span className={`inline-block font-['JetBrains_Mono'] text-[9px] font-bold uppercase tracking-[1px] px-2 py-1 rounded-md bg-[rgba(212,168,83,0.1)] text-sand-300 border border-[rgba(212,168,83,0.2)] ${formData.role === 'passenger' ? 'opacity-100 scale-100' : 'opacity-0 scale-80'} transition-all`}>Sélectionné</span>
                  </div>
                </label>
                <label className={`role-card driver cursor-pointer ${formData.role === 'driver' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="driver"
                    checked={formData.role === 'driver'}
                    onChange={() => handleRoleChange('driver')}
                    className="hidden"
                  />
                  <div className={`flex flex-col items-center justify-center gap-[10px] p-5 bg-night-700 border-[1.5px] border-[rgba(255,255,255,0.07)] rounded-4xl transition-all duration-300 text-center ${formData.role === 'driver' ? 'border-teal bg-[rgba(45,212,191,0.06)] shadow-[0_0_0_3px_rgba(45,212,191,0.08),inset_0_0_20px_rgba(45,212,191,0.04)]' : 'hover:border-[rgba(45,212,191,0.25)]'}`}>
                    <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-[#3d3830]">directions_car</span>
                    </div>
                    <span className="font-['Bebas_Neue'] text-lg tracking-[2px] text-[#f0e8d5]">Conducteur</span>
                    <span className="text-[11px] text-[#6b6455] leading-relaxed">Je propose un trajet</span>
                    <span className={`inline-block font-['JetBrains_Mono'] text-[9px] font-bold uppercase tracking-[1px] px-2 py-1 rounded-md bg-[rgba(45,212,191,0.1)] text-teal border border-[rgba(45,212,191,0.2)] ${formData.role === 'driver' ? 'opacity-100 scale-100' : 'opacity-0 scale-80'} transition-all`}>Sélectionné</span>
                  </div>
                </label>
              </div>

              {/* Driver extra fields */}
              <div className={`overflow-hidden transition-all duration-500 ${formData.role === 'driver' ? 'max-h-[400px] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="p-5 bg-[rgba(45,212,191,0.03)] border border-[rgba(45,212,191,0.1)] rounded-4xl">
                  <div className="font-['JetBrains_Mono'] text-[10px] font-bold text-teal uppercase tracking-[2px] mb-4 flex items-center gap-[6px]">
                    <span className="material-symbols-outlined text-sm">directions_car</span>
                    Informations du véhicule
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Marque</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">car_tag</span>
                        <input
                          type="text"
                          name="carBrand"
                          value={formData.carBrand}
                          onChange={handleChange}
                          placeholder="Ex: Renault"
                          className="w-full px-4 py-3.5 pl-11 bg-night-900 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-teal focus:shadow-[0_0_0_3px_rgba(45,212,191,0.08)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Modèle</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">directions_car</span>
                        <input
                          type="text"
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleChange}
                          placeholder="Ex: Clio"
                          className="w-full px-4 py-3.5 pl-11 bg-night-900 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-teal focus:shadow-[0_0_0_3px_rgba(45,212,191,0.08)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Année</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">calendar_month</span>
                        <input
                          type="text"
                          name="carYear"
                          value={formData.carYear}
                          onChange={handleChange}
                          placeholder="Ex: 2019"
                          maxLength={4}
                          className="w-full px-4 py-3.5 pl-11 bg-night-900 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-teal focus:shadow-[0_0_0_3px_rgba(45,212,191,0.08)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Immatriculation</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">pin</span>
                        <input
                          type="text"
                          name="carPlate"
                          value={formData.carPlate}
                          onChange={handleChange}
                          placeholder="Ex: 123-456-16"
                          className="w-full px-4 py-3.5 pl-11 bg-night-900 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-teal focus:shadow-[0_0_0_3px_rgba(45,212,191,0.08)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-5">
              {/* Prénom */}
              <div>
                <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Prénom</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">person</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    required
                    autoComplete="given-name"
                    className="w-full px-4 py-3.5 pl-11 bg-night-700 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)]"
                  />
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Nom</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">badge</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    autoComplete="family-name"
                    className="w-full px-4 py-3.5 pl-11 bg-night-700 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Adresse Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">mail</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nom@exemple.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3.5 pl-11 bg-night-700 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)]"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="col-span-2">
                <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Téléphone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">call</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0550 12 34 56"
                    required
                    autoComplete="tel"
                    className="w-full px-4 py-3.5 pl-11 bg-night-700 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)]"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Mot de Passe</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">lock</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 pl-11 bg-night-700 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)]"
                  />
                </div>
                {/* Password strength */}
                <div className="flex gap-1 mt-2">
                  <div className="flex-1 h-[3px] rounded-[2px] bg-night-700 transition-colors" id="seg1" />
                  <div className="flex-1 h-[3px] rounded-[2px] bg-night-700 transition-colors" id="seg2" />
                  <div className="flex-1 h-[3px] rounded-[2px] bg-night-700 transition-colors" id="seg3" />
                </div>
              </div>

              {/* Confirmation */}
              <div>
                <label className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#6b6455] uppercase tracking-[2px] mb-2 block">Confirmation</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d3830] text-xl">check_circle</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 pl-11 bg-night-700 border border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0e8d5] font-['DM_Sans'] text-sm font-bold outline-none focus:border-sand-300 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)]"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 mt-5">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-[18px] h-[18px] min-w-[18px] p-0 bg-night-900 border-[1.5px] border-[rgba(255,255,255,0.07)] rounded-md cursor-pointer accent-sand-300 mt-0.5"
              />
              <label htmlFor="terms" className="font-['DM_Sans'] text-xs text-[#6b6455] leading-relaxed cursor-pointer">
                J'accepte les <a href="#" className="text-sand-300 no-underline hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-sand-300 no-underline hover:underline">politique de confidentialité</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sand-300 text-night-900 border-none rounded-xl font-['JetBrains_Mono'] text-[13px] font-bold tracking-[2.5px] uppercase cursor-pointer shadow-[0_0_30px_rgba(212,168,83,0.25),0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-sand-400 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,168,83,0.35),0_6px_20px_rgba(0,0,0,0.5)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-night-900 border-t-transparent rounded-full animate-spin" />
                  CRÉATION...
                </>
              ) : (
                'CRÉER MON COMPTE'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] text-center">
            <p className="text-[#6b6455] text-sm">
              Déjà un compte ?<Link to="/login" className="text-sand-300 font-bold no-underline ml-1 hover:text-sand-200 transition-colors">Se connecter</Link>
            </p>
          </div>
        </div>

        {/* Page Footer */}
        <div className="mt-7 text-center">
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#3d3830] uppercase tracking-[2.5px]">© 2026 ROHWINBGHIT — START YOUR JOURNEY</p>
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
