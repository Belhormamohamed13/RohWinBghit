import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PassengerSpaceLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const PassengerSpaceLayout: React.FC<PassengerSpaceLayoutProps> = ({ children, activeTab, onTabChange }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);


    const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : "Amine Dahmani";

    const menuItems = [
        { id: 'dashboard', icon: 'grid_view', label: 'Dashboard' },
        { id: 'search', icon: 'search', label: 'Trouver un trajet' },
        { id: 'bookings', icon: 'confirmation_number', label: 'Mes Réservations' },
        { id: 'favorites', icon: 'favorite', label: 'Mes Favoris' },
        { id: 'spending', icon: 'account_balance_wallet', label: 'Historique & Portefeuille' },
        { id: 'messages', icon: 'forum', label: 'Messages' },
        { id: 'profile', icon: 'person_outline', label: 'Mon Profil' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-[#08110b] transition-colors duration-500 font-sans">
            {/* Premium Sidebar */}
            <aside className="w-80 bg-white/70 dark:bg-background-dark/40 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/50 fixed h-full z-30 transition-all duration-300">
                <div className="p-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/passenger/dashboard')}>
                        <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-all">
                            <span className="material-symbols-outlined text-slate-900 font-black text-2xl">rocket</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">RohWin<span className="text-primary italic">Bghit</span></span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] leading-none">Covoiturage DZ</span>
                        </div>
                    </div>

                    <nav className="space-y-2.5 flex-1">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 ml-4">MAIN MENU</p>
                        {menuItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onTabChange(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${isActive
                                        ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined font-bold ${isActive ? 'fill-1' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse-slow"></div>}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="bg-slate-900 dark:bg-slate-800/50 p-6 rounded-3xl mb-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <p className="text-white text-xs font-black relative z-10">BESOIN D'AIDE ?</p>
                            <p className="text-slate-400 text-[10px] mt-2 relative z-10 font-medium">Accédez à notre guide complet</p>
                            <button className="mt-4 w-full bg-white text-slate-900 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-primary transition-colors relative z-10">Support</button>
                        </div>
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
            <main className="flex-1 ml-80 transition-all duration-300">
                {/* Premium Header */}
                <header className="h-24 bg-white/60 dark:bg-[#08110b]/60 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/50 sticky top-0 z-20 px-12 flex items-center justify-between">
                    <div className="relative group max-w-lg w-full">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full pl-12 pr-6 py-3.5 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-sm outline-none placeholder:text-slate-400"
                            placeholder="Rechercher une destination, un conducteur..."
                            type="text"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md">CMD</span>
                            <span className="text-[10px] font-black text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md">K</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                            <button className="relative p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                                <span className="material-symbols-outlined font-bold group-hover:scale-110">notifications</span>
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#08110b] rounded-full"></span>
                            </button>
                            <button className="relative p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                                <span className="material-symbols-outlined font-bold group-hover:scale-110">mail</span>
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary border-2 border-white dark:border-[#08110b] rounded-full"></span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="relative p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group"
                                title="Déconnexion"
                            >
                                <span className="material-symbols-outlined font-bold group-hover:scale-110">logout</span>
                            </button>
                        </div>


                        <div
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="relative flex items-center gap-4 bg-slate-100/50 dark:bg-slate-900/40 p-2 pr-6 rounded-[1.5rem] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
                        >
                            <div className="relative">
                                <img
                                    alt="Profile"
                                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20 shadow-lg group-hover:scale-105 transition-transform"
                                    src={user?.avatarUrl || "https://ui-avatars.com/api/?name=Amine+Dahmani&background=2bee6c&color=fff&bold=true"}
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white dark:border-[#08110b] rounded-full"></div>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tight">{displayName}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5">PASSAGER GOLD</p>
                            </div>
                            <span className={`material-symbols-outlined text-slate-400 text-lg ml-2 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-4 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-elevated border border-slate-100 dark:border-slate-800 py-4 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                                    <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{displayName}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={() => navigate('/passenger/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all">
                                            <span className="material-symbols-outlined text-lg">person</span> Mon Profil
                                        </button>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-bold text-red-500 transition-all">
                                            <span className="material-symbols-outlined text-lg">logout</span> Déconnexion
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>


                <div className="p-12 min-h-[calc(100vh-6rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PassengerSpaceLayout;
