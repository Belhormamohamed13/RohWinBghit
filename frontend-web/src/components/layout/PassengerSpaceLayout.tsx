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

    const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : "Passager";

    const menuItems = [
        { id: 'search', icon: 'search', label: 'Trouver un trajet' },
        { id: 'bookings', icon: 'confirmation_number', label: 'Mes Réservations' },
        { id: 'favorites', icon: 'favorite', label: 'Favoris' },
        { id: 'history', icon: 'history', label: 'Historique' },
        { id: 'spending', icon: 'account_balance_wallet', label: 'Portefeuille' },
        { id: 'messages', icon: 'forum', label: 'Messages' },
        { id: 'profile', icon: 'person', label: 'Mon Profil' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen font-body text-text-primary relative">
            <div className="page-bg" />

            {/* Premium Sidebar */}
            <aside className="w-72 bg-night-800/80 backdrop-blur-xl border-r border-border fixed h-full z-30 transition-all duration-300 hidden lg:flex flex-col">
                <div className="p-8 h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => navigate('/passenger/search')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-sand-300 to-sand-500 rounded-lg flex items-center justify-center shadow-glow group-hover:rotate-12 transition-all">
                            <span className="text-xl">🚗</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-2xl tracking-wide bg-gradient-to-r from-sand-100 to-sand-300 bg-clip-text text-transparent">ROHWIN</span>
                            <span className="font-mono text-[10px] text-accent-teal uppercase tracking-[2px]">PASSAGER</span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="font-mono text-[10px] text-sand-300 uppercase tracking-widest mb-4 ml-4 opacity-70">// MENU PRINCIPAL</p>
                        {menuItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onTabChange(item.id)}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-sand-300/10 to-transparent text-sand-300 border-l-2 border-sand-300'
                                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-sand-300' : 'text-text-muted group-hover:text-sand-300 transition-colors'}`}>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {isActive && <div className="absolute inset-0 bg-sand-300/5 pointer-events-none"></div>}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-border">
                        <div className="bg-gradient-to-br from-night-700 to-night-800 p-5 rounded-xl mb-4 border border-border relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-teal/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <p className="font-display text-lg tracking-wide text-text-primary relative z-10">BESOIN D'AIDE ?</p>
                            <p className="text-xs text-text-muted mt-1 relative z-10">Support 24/7 disponible</p>
                            <button className="mt-3 w-full btn btn-ghost btn-sm bg-night-600/50 hover:bg-sand-300 hover:text-night-900 border-border z-10 relative">Contacter</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 transition-all duration-300 relative z-10">
                {/* Premium Header */}
                <header className="h-20 bg-night-900/60 backdrop-blur-md border-b border-border sticky top-0 z-20 px-6 lg:px-10 flex items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative group max-w-md w-full hidden md:block">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-sand-300 transition-colors">search</span>
                        <input
                            className="w-full pl-11 pr-4 py-2.5 bg-night-800 border border-border rounded-lg text-sm text-text-primary focus:border-sand-300 focus:ring-1 focus:ring-sand-300/20 transition-all placeholder:text-text-dim outline-none"
                            placeholder="Rechercher..."
                            type="text"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 group-focus-within:opacity-100 opacity-50 transition-opacity">
                            <kbd className="hidden lg:inline-block border border-border rounded px-1.5 py-0.5 text-[10px] text-text-muted font-mono bg-night-700">⌘K</kbd>
                        </div>
                    </div>

                    {/* Mobile Logo (visible only on small screens) */}
                    <div className="lg:hidden flex items-center gap-2">
                        <span className="text-2xl">🚗</span>
                        <span className="font-display text-xl tracking-wide text-sand-300">ROHWIN</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-text-muted hover:text-sand-300 hover:bg-white/5 rounded-lg transition-all relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-night-900"></span>
                            </button>
                            <button className="p-2 text-text-muted hover:text-sand-300 hover:bg-white/5 rounded-lg transition-all">
                                <span className="material-symbols-outlined">mail</span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-border"></div>

                        <div className="relative group">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-text-primary leading-none">{user?.firstName || 'Passager'}</p>
                                    <p className="text-[10px] text-accent-teal uppercase tracking-widest mt-1 font-mono">Gold Member</p>
                                </div>
                                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-sand-300 to-night-600">
                                    <img
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-2 border-night-900"
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=111318&color=d4a855`}
                                    />
                                </div>
                            </button>

                            {/* Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-3 w-56 bg-night-800 border border-border rounded-lg shadow-card p-2 animate-fade-up origin-top-right">
                                    <div className="px-3 py-2 border-b border-border/50 mb-2">
                                        <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Mon Compte</p>
                                    </div>
                                    <button onClick={() => navigate('/passenger/profile')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-white/5 rounded-md transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">person</span> Profil
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-accent-red hover:bg-white/5 rounded-md transition-colors mt-1">
                                        <span className="material-symbols-outlined text-[18px]">logout</span> Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 min-h-[calc(100vh-5rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PassengerSpaceLayout;
