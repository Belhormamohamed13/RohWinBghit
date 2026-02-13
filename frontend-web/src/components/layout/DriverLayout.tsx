import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface DriverLayoutProps {
    children: React.ReactNode;
    fullContent?: boolean;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children, fullContent = false }) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: 'grid_view', label: 'Tableau de bord', path: '/driver/dashboard' },
        { icon: 'add_circle', label: 'Proposer un trajet', path: '/driver/publish' },
        { icon: 'directions_car', label: 'Mon Véhicule', path: '/driver/vehicles' },
        { icon: 'history', label: 'Mes Trajets', path: '/driver/my-trips' },
        { icon: 'account_balance_wallet', label: 'Portefeuille', path: '/driver/wallet' },
        { icon: 'forum', label: 'Messages', path: '/driver/messages' },
        { icon: 'verified_user', label: 'Vérification', path: '/driver/verification' },
        { icon: 'settings', label: 'Paramètres', path: '/driver/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-[#08110b] transition-colors duration-500 font-sans">
            {/* Premium Sidebar */}
            <aside className="w-80 bg-white/70 dark:bg-background-dark/40 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/50 fixed h-full z-40">
                <div className="p-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/driver/dashboard')}>
                        <div className="w-12 h-12 bg-[#13ec6d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#13ec6d]/30 group-hover:rotate-12 transition-all">
                            <span className="material-symbols-outlined text-slate-900 font-black text-2xl">drive_eta</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Driver <span className="text-[#13ec6d] italic font-black">Pro</span></span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1 leading-none">RohWinBghit</span>
                        </div>
                    </div>

                    <nav className="space-y-2.5 flex-1">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 ml-4">PILOT PANEL</p>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${isActive
                                        ? 'bg-[#13ec6d] text-slate-900 shadow-lg shadow-[#13ec6d]/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined font-bold ${isActive ? 'fill-1' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold text-sm transition-all group"
                        >
                            <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">logout</span>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-80 flex flex-col min-h-screen">
                {/* Premium Header */}
                <header className="h-24 bg-white/60 dark:bg-[#08110b]/60 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/50 sticky top-0 z-30 px-12 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Bonjour, {user?.firstName} 🎉</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">VOTRE TRAJET COMMENCE ICI</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/driver/publish')}
                            className="hidden md:flex items-center gap-3 bg-[#13ec6d] text-slate-900 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec6d]/20 hover:scale-[1.03] active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg font-black">add_location</span>
                            Publier un trajet
                        </button>

                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800/50 pl-6 ml-2">
                            <button className="relative p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                                <span className="material-symbols-outlined font-black">notifications</span>
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#08110b] rounded-full"></span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="relative p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group"
                                title="Déconnexion"
                            >
                                <span className="material-symbols-outlined font-bold group-hover:scale-110">logout</span>
                            </button>

                            <div className="flex items-center gap-4 ml-4 group cursor-pointer" onClick={() => navigate('/driver/settings')}>
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tight">{user?.firstName} {user?.lastName?.charAt(0)}.</p>
                                    <p className="text-[9px] font-black text-[#13ec6d] uppercase mt-1.5 tracking-widest">CONDUCTEUR PRO</p>
                                </div>
                                <img
                                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=13ec6d&color=fff&bold=true`}
                                    alt="Profil"
                                    className="w-12 h-12 rounded-[1.25rem] object-cover ring-4 ring-[#13ec6d]/10 group-hover:scale-105 transition-transform shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className={`p-12 flex-1 ${fullContent ? '' : 'pt-12'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DriverLayout;
