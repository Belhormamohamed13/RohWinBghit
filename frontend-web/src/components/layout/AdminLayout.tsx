import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex min-h-screen bg-[#08110b] selection:bg-primary/30 selection:text-slate-900 font-sans">
            {/* Premium Admin Sidebar */}
            <aside className="w-80 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 fixed h-full z-30 flex flex-col pt-10 pb-10 px-8">
                <div className="flex items-center gap-4 mb-14 px-4 group cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                    <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                        <span className="material-symbols-outlined text-slate-900 font-black text-2xl">shield_person</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-white">RohWin<span className="text-primary italic">Admin</span></span>
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em] leading-none">CORE CONTROL</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 ml-4">ADMINISTRATION</p>
                    {menuItems.map((item) => {
                        const isActive = activeItem === item.id;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${isActive
                                    ? 'bg-primary text-slate-900 shadow-xl shadow-primary/10'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={`material-symbols-outlined font-bold ${isActive ? 'fill-1' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
                                <span>{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse"></div>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 bg-primary/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest relative z-10">SYSTEM STATUS</p>
                        <div className="flex items-center gap-2 mt-3 relative z-10">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-xs text-slate-300 font-bold">Node: Online</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-500/5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all group"
                    >
                        <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">logout</span>
                        <span>Quitter le Hub</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-80 min-h-screen relative">
                {/* Header Section */}
                <header className="h-24 bg-[#08110b]/60 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-20 px-12 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Panel de <span className="text-primary italic">Contrôle</span></h2>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/10 transition-all group">
                                <span className="material-symbols-outlined font-black group-hover:scale-110">notifications</span>
                            </button>
                            <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/10 transition-all group">
                                <span className="material-symbols-outlined font-black group-hover:scale-110">terminal</span>
                            </button>
                        </div>

                        <div className="h-10 w-[1px] bg-white/5 mx-2"></div>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-4 py-2 px-3 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-white italic tracking-tight">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mt-1">SUPER ADMIN</p>
                                </div>
                                <img
                                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=2bee6c&color=08110b&bold=true`}
                                    alt="Admin"
                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 shadow-lg group-hover:scale-105 transition-transform"
                                />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-60 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl p-4 z-50 overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-12 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10 space-y-2">
                                            <button onClick={() => navigate('/admin/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-lg">settings</span> Configuration
                                            </button>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-lg">logout</span> Se déconnecter
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="p-12 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
