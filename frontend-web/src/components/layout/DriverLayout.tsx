import React, { useState } from 'react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { icon: 'grid_view', label: 'Tableau de bord', path: '/driver/dashboard' },
        { icon: 'add_circle', label: 'Publier un trajet', path: '/driver/publish' },
        { icon: 'directions_car', label: 'Mes véhicules', path: '/driver/vehicles' },
        { icon: 'history', label: 'Mes trajets', path: '/driver/my-trips' },
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
        <div className="flex min-h-screen font-body text-text-primary relative">
            <div className="page-bg" />

            {/* Premium Sidebar */}
            <aside className="w-72 bg-night-800/80 backdrop-blur-xl border-r border-border fixed h-full z-30 transition-all duration-300 hidden lg:flex flex-col">
                <div className="p-8 h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => navigate('/driver/dashboard')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-teal to-night-500 rounded-lg flex items-center justify-center shadow-glow group-hover:rotate-12 transition-all">
                            <span className="text-xl">⚡</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-2xl tracking-wide bg-gradient-to-r from-accent-teal to-sand-100 bg-clip-text text-transparent">ROHWIN</span>
                            <span className="font-mono text-[10px] text-sand-300 uppercase tracking-[2px]">DRIVER</span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="font-mono text-[10px] text-accent-teal uppercase tracking-widest mb-4 ml-4 opacity-70">// ESPACE PILOTE</p>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-accent-teal/10 to-transparent text-accent-teal border-l-2 border-accent-teal'
                                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-accent-teal' : 'text-text-muted group-hover:text-accent-teal transition-colors'}`}>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {isActive && <div className="absolute inset-0 bg-accent-teal/5 pointer-events-none"></div>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 text-accent-red hover:bg-accent-red/10 rounded-lg text-sm font-bold transition-all group"
                        >
                            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 transition-all duration-300 relative z-10 flex flex-col min-h-screen">
                {/* Premium Header */}
                <header className="h-20 bg-night-900/60 backdrop-blur-md border-b border-border sticky top-0 z-20 px-6 lg:px-10 flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl text-text-primary tracking-wide hidden sm:block">BONJOUR, <span className="text-sand-300">{user?.firstName}</span></h2>
                        <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest hidden sm:block">Prêt à conduire ?</p>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 sm:hidden">
                            <span className="text-2xl">⚡</span>
                            <span className="font-display text-xl tracking-wide text-accent-teal">DRIVER</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/driver/publish')}
                            className="hidden md:flex btn btn-primary btn-sm rounded-full px-6 shadow-glow"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Publier un trajet
                        </button>

                        <div className="h-8 w-px bg-border hidden md:block"></div>

                        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/driver/settings')}>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-text-primary leading-none">{user?.firstName}</p>
                                <p className="text-[10px] text-accent-teal uppercase tracking-widest mt-1 font-mono">Conducteur Pro</p>
                            </div>
                            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-accent-teal to-night-600 shadow-glow">
                                <img
                                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=1adfb8&color=0a0b0e&bold=true`}
                                    alt="Profil"
                                    className="w-full h-full rounded-full object-cover border-2 border-night-900"
                                />
                            </div>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-text-primary"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-night-900/95 backdrop-blur-xl p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-display text-2xl text-accent-teal">MENU</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <nav className="flex flex-col gap-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 text-lg font-bold text-text-primary p-4 bg-night-800 rounded-xl"
                                >
                                    <span className="material-symbols-outlined text-accent-teal">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="flex items-center gap-4 text-lg font-bold text-accent-red p-4 mt-4">
                                <span className="material-symbols-outlined">logout</span> Déconnexion
                            </button>
                        </nav>
                    </div>
                )}

                <div className={`p-6 lg:p-10 flex-1 ${fullContent ? 'p-0' : ''}`}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DriverLayout;
