import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    History,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Star,
    Heart,
    Map,
    Wallet
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface PassengerLayoutProps {
    children: React.ReactNode;
    fullContent?: boolean;
}

const PassengerLayout: React.FC<PassengerLayoutProps> = ({ children, fullContent = false }) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Use name from auth store if available, otherwise fallback to Houcine Matallah for demo
    const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : "Houcine Matallah";

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/passenger/dashboard' },
        { icon: <Search size={20} />, label: 'Trouver un trajet', path: '/trips/search' },
        { icon: <History size={20} />, label: 'Mes Réservations', path: '/passenger/bookings' },
        { icon: <Heart size={20} />, label: 'Mes Favoris', path: '/passenger/favorites' },
        { icon: <Star size={20} />, label: 'Avis & Reputation', path: '/passenger/reviews' },
        { icon: <Wallet size={20} />, label: 'Dépenses', path: '/passenger/spending' },
        { icon: <MessageSquare size={20} />, label: 'Messages', path: '/chat' },
        { icon: <Settings size={20} />, label: 'Paramètres', path: '/passenger/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a]">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-20">
                <div className="p-8">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Map className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            RohWin<span className="text-blue-600">Bghit</span>
                        </span>
                    </div>

                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all group ${isActive
                                        ? 'text-white bg-blue-600 shadow-xl shadow-blue-600/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-600/10'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 w-full text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-2xl font-bold text-sm transition-all group text-left"
                    >
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            Bonjour, {user?.firstName || "Houcine"} 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Où souhaitez-vous aller aujourd'hui ?</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate('/trips/search')}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            <Search size={18} />
                            Rechercher un trajet
                        </button>

                        <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 relative hover:bg-white dark:hover:bg-slate-700 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                                    {displayName}
                                </p>
                                <div className="flex items-center gap-1 justify-end mt-1">
                                    <div className="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Star size={10} className="text-amber-500 fill-amber-500" />
                                        <p className="text-[10px] uppercase tracking-tighter font-black text-amber-600 dark:text-amber-400">Passager Vérifié</p>
                                    </div>
                                </div>
                            </div>
                            <img
                                src={user?.avatarUrl || "https://ui-avatars.com/api/?name=Houcine+Matallah&background=2563eb&color=fff"}
                                alt="Profil"
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-600/20"
                            />
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className={`flex-1 ${fullContent ? '' : 'p-10 pt-6'}`}>
                    {children}
                </div>

                {/* Footer - Only show if not fullContent */}
                {!fullContent && (
                    <footer className="px-10 py-10 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                    <Map className="text-white" size={14} />
                                </div>
                                <p className="text-slate-400 text-xs font-bold">© 2024 RohWinBghit. Algérie 🇩🇿</p>
                            </div>
                            <div className="flex gap-8">
                                <Link to="/support" className="text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors">Aide</Link>
                                <Link to="/terms" className="text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors">Conditions</Link>
                                <Link to="/privacy" className="text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors">Sécurité</Link>
                            </div>
                        </div>
                    </footer>
                )}
            </main>
        </div>
    );
};

export default PassengerLayout;
