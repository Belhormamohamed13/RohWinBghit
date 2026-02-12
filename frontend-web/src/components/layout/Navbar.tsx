import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? [
      { to: '/passenger/search', label: 'Trouver', icon: 'search' },
      { to: '/passenger/bookings', label: 'Réservations', icon: 'confirmation_number' },
      ...(user?.role === 'admin'
        ? [{ to: '/admin/dashboard', label: 'Espace Admin', icon: 'shield_person' }]
        : []),
      ...(user?.role === 'driver'
        ? [{ to: '/driver/dashboard', label: 'Espace Pilote', icon: 'drive_eta' }]
        : [{ to: '/register', label: 'Devenir Conducteur', icon: 'person_add' }]),
      { to: '/chat', label: 'Messages', icon: 'forum' },
    ]
    : [
      { to: '/trips/results', label: 'Trouver un trajet', icon: 'search' },
      { to: '/safety', label: 'Sécurité', icon: 'shield_check' },
      { to: '/about', label: 'À propos', icon: 'info' },
    ];

  return (
    <nav className="h-20 bg-white/80 dark:bg-[#08110b]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/50 sticky top-0 z-[60] px-6 lg:px-12 transition-all">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
            <span className="material-symbols-outlined text-slate-900 font-black text-2xl italic">directions_car</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase">RohWin<span className="text-primary italic">Bghit</span></span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2 italic"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-200 dark:border-slate-800/50">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary/90 text-slate-900 text-[10px] font-black py-3 px-6 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest italic"
                >
                  <span className="material-symbols-outlined text-sm font-black">add_circle</span>
                  Publier un trajet
                </Link>
                <Link
                  to="/login"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-black py-3 px-6 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest italic border border-slate-200 dark:border-slate-700"
                >
                  Connexion / Inscription
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=2bee6c&color=102216&bold=true`}
                    alt="User"
                    className="w-10 h-10 rounded-xl object-cover ring-4 ring-primary/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">{user?.firstName}</p>
                    <p className="text-[8px] font-black text-primary mt-1 uppercase tracking-widest leading-none italic">MEMBRE CONNECTÉ</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-elevated p-3 animate-slide-up ">
                    <div className="px-4 py-4 mb-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate italic">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-1">{user?.email}</p>
                    </div>
                    <Link to={user?.role === 'driver' ? '/driver/dashboard' : '/passenger/dashboard'} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all italic">
                      <span className="material-symbols-outlined text-lg">grid_view</span>
                      Tableau de Bord
                    </Link>
                    <Link to="/passenger/profile" className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all italic">
                      <span className="material-symbols-outlined text-lg">person</span>
                      Mon Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all italic"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-primary transition-all active:scale-95"
        >
          <span className="material-symbols-outlined font-black">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 animate-slide-down shadow-xl z-50">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 italic"
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
