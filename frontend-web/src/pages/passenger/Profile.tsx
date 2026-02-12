import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { userApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const PassengerProfile: React.FC = () => {
    const { user, setUser } = useAuthStore();
    const [activeSection, setActiveSection] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await userApi.updateProfile(formData);
            setUser(response.data.data);
            setIsEditing(false);
            toast.success('Profil mis à jour avec succès');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : "Amine Dahmani";

    const menuItems = [
        { id: 'personal', icon: 'person', label: 'Infos Personnelles' },
        { id: 'security', icon: 'shield', label: 'Sécurité & Accès' },
        { id: 'preferences', icon: 'tune', label: 'Préférences' },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-in">
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white dark:border-slate-800 shadow-elevated overflow-hidden mb-20 transition-all">
                {/* Premium Profile Header */}
                <div className="h-64 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-40 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 p-32 bg-secondary/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

                    <div className="absolute -bottom-20 left-12 flex items-end gap-8 z-10 transition-transform hover:scale-[1.02] duration-500">
                        <div className="relative group">
                            <img
                                src={user?.avatarUrl || "https://ui-avatars.com/api/?name=Amine+Dahmani&background=2bee6c&color=fff&bold=true"}
                                alt="Avatar"
                                className="w-48 h-48 rounded-[2.5rem] object-cover border-8 border-white dark:border-slate-900 shadow-2xl transition-all"
                            />
                            <button className="absolute bottom-4 right-4 p-3 bg-primary text-slate-900 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                <span className="material-symbols-outlined font-black">photo_camera</span>
                            </button>
                        </div>
                        <div className="mb-24">
                            <h2 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
                                {displayName}
                                <span className="material-symbols-outlined text-primary text-3xl fill-1">verified</span>
                            </h2>
                            <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Membre Élite • Depuis 2023</p>
                        </div>
                    </div>
                </div>

                <div className="pt-32 px-12 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Interactive Sidebar */}
                        <aside className="lg:col-span-3">
                            <nav className="flex flex-col gap-3">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-6 mb-4">SETTINGS</p>
                                {menuItems.map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full flex items-center gap-4 px-8 py-5 rounded-[1.5rem] font-black text-sm transition-all group ${isActive
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined font-black ${isActive ? 'fill-1' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <div className="lg:col-span-9 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">
                                    {menuItems.find(i => i.id === activeSection)?.label}
                                </h3>
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            setFormData({
                                                firstName: user?.firstName || '',
                                                lastName: user?.lastName || '',
                                                email: user?.email || '',
                                                phone: user?.phone || '',
                                                bio: user?.bio || ''
                                            });
                                        }
                                        setIsEditing(!isEditing);
                                    }}
                                    className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${isEditing ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:scale-105' : 'bg-primary/20 text-primary hover:bg-primary shadow-sm hover:text-slate-900 hover:scale-105'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-base font-black">{isEditing ? 'close' : 'edit'}</span>
                                    {isEditing ? 'ANNULER' : 'MODIFIER'}
                                </button>
                            </div>

                            {activeSection === 'personal' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">PRÉNOM</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none transition-all disabled:opacity-50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">NOM</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">badge</span>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none transition-all disabled:opacity-50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">EMAIL</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">alternate_email</span>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none transition-all disabled:opacity-50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">TÉLÉPHONE</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">phone_iphone</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none transition-all disabled:opacity-50 dark:text-white"
                                            />
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#13ec6d] text-base font-black fill-1">check_circle</span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-3 group text-left">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">BIO & PRÉSENTATION</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-6 text-slate-400 group-focus-within:text-primary transition-colors">history_edu</span>
                                            <textarea
                                                rows={4}
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Parlez de vous, vos préférences de voyage..."
                                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none transition-all disabled:opacity-50 dark:text-white resize-none"
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="md:col-span-2 pt-8 flex justify-end">
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="bg-primary text-slate-900 font-black py-4 px-12 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {loading ? <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span> : <span className="material-symbols-outlined font-black">save</span>}
                                                SAUVEGARDER
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeSection === 'security' && (
                                <div className="space-y-10 max-w-xl">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">MOT DE PASSE ACTUEL</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            className="w-full px-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">NOUVEAU MOT DE PASSE</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            className="w-full px-6 py-4 bg-white dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary/30 outline-none dark:text-white"
                                        />
                                    </div>
                                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 px-10 rounded-2xl transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
                                        Mettre à jour la sécurité
                                    </button>
                                </div>
                            )}

                            {activeSection === 'preferences' && (
                                <div className="space-y-6">
                                    {[
                                        { title: 'Notifications Push', desc: 'Alertes en temps réel pour vos messages et trajets.', icon: 'notifications_active' },
                                        { title: 'Email de Campagne', desc: 'Offres exclusives et nouveautés de la plateforme.', icon: 'mail' },
                                        { title: 'Mode Sombre', desc: "Adapter l'interface pour une lecture nocturne.", icon: 'dark_mode', isToggle: true },
                                    ].map((pref, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-slate-800/40 rounded-3xl border border-transparent hover:border-primary/20 transition-all shadow-sm group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                                                    <span className="material-symbols-outlined font-black">{pref.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-900 dark:text-white leading-none">{pref.title}</p>
                                                    <p className="text-xs text-slate-500 font-medium mt-2">{pref.desc}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary rounded-full"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerProfile;
