import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard', path: '/admin/dashboard', icon: 'grid_view', label: 'Tableau de bord' },
        { id: 'users', path: '/admin/users', icon: 'group', label: 'Utilisateurs' },
        { id: 'vehicles', path: '/admin/vehicles', icon: 'minor_crash', label: 'Vérifications' },
        { id: 'trips', path: '/admin/trips', icon: 'map', label: 'Surveillance Trajets' },
        { id: 'settings', path: '/admin/settings', icon: 'settings', label: 'Configuration' },
    ];

    const activeItem = menuItems.find(item => location.pathname === item.path)?.id || 'dashboard';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen font-body text-text-primary">
            {/* Premium Admin Sidebar */}
            <aside className="w-72 bg-night-900/90 backdrop-blur-xl border-r border-border fixed h-full z-30 flex flex-col hidden lg:flex">
                <div className="p-8 h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => navigate('/admin/dashboard')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-night-600 rounded-lg flex items-center justify-center shadow-glow group-hover:rotate-12 transition-all">
                            <span className="text-xl">🛡️</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-2xl tracking-wide bg-gradient-to-r from-accent-blue to-sand-100 bg-clip-text text-transparent">ROHWIN</span>
                            <span className="font-mono text-[10px] text-accent-blue uppercase tracking-[2px]">ADMIN</span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="font-mono text-[10px] text-accent-blue uppercase tracking-widest mb-4 ml-4 opacity-70">// SYSTÈME</p>
                        {menuItems.map((item) => {
                            const isActive = activeItem === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-accent-blue/10 to-transparent text-accent-blue border-l-2 border-accent-blue'
                                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-accent-blue' : 'text-text-muted group-hover:text-accent-blue transition-colors'}`}>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {isActive && <div className="absolute inset-0 bg-accent-blue/5 pointer-events-none"></div>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-border">
                        <div className="bg-night-800 p-4 rounded-xl border border-border/50 relative overflow-hidden group mb-4">
                            <div className="flex items-center gap-3 relative z-10">
                                <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
                                <p className="font-mono text-[10px] text-text-muted font-bold uppercase tracking-wider">Système Opérationnel</p>
                            </div>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-accent-blue/10 blur-xl rounded-full"></div>
                        </div>

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
            <main className="flex-1 lg:ml-72 min-h-screen relative flex flex-col">
                {/* Header Section */}
                <header className="h-20 bg-night-900/60 backdrop-blur-md border-b border-border sticky top-0 z-20 px-6 lg:px-10 flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-xl text-text-primary tracking-wide hidden sm:block">PANNEAU DE CONTRÔLE</h2>
                        <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest hidden sm:block">
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 sm:hidden">
                            <span className="text-2xl">🛡️</span>
                            <span className="font-display text-xl tracking-wide text-accent-blue">ADMIN</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-text-muted hover:text-accent-blue hover:bg-white/5 rounded-lg transition-all relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-night-900"></span>
                            </button>
                            <button className="p-2 text-text-muted hover:text-accent-blue hover:bg-white/5 rounded-lg transition-all">
                                <span className="material-symbols-outlined">terminal</span>
                            </button>
                        </div>

                        <div className="h-8 w-[1px] bg-border hidden md:block"></div>

                        <div className="relative group">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-text-primary leading-none">{user?.firstName}</p>
                                    <p className="text-[10px] text-accent-blue uppercase tracking-widest mt-1 font-mono">Super Admin</p>
                                </div>
                                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-accent-blue to-night-600 shadow-glow">
                                    <img
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=4a9eff&color=0a0b0e&bold=true`}
                                        alt="Admin"
                                        className="w-full h-full rounded-full object-cover border-2 border-night-900"
                                    />
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-3 w-56 bg-night-800 border border-border rounded-lg shadow-card p-2 animate-fade-up origin-top-right z-50">
                                    <div className="px-3 py-2 border-b border-border/50 mb-2">
                                        <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Administration</p>
                                    </div>
                                    <button onClick={() => navigate('/admin/settings')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-white/5 rounded-md transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">settings</span> Configuration
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-accent-red hover:bg-white/5 rounded-md transition-colors mt-1">
                                        <span className="material-symbols-outlined text-[18px]">logout</span> Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 flex-1 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
