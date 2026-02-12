import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Eye,
    Smartphone,
    ChevronRight,
    Save,
    Trash2,
    Camera,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import DriverLayout from '../../components/layout/DriverLayout';
import { useAuthStore } from '../../store/authStore';
import { userApi, authApi } from '../../services/api';

const Settings = () => {
    const { user, setUser } = useAuthStore();
    const [activeSection, setActiveSection] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        bio: (user as any)?.bio || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const sections = [
        { id: 'profile', title: 'Profil Public', icon: <User size={20} />, description: 'Gérez vos infos visibles' },
        { id: 'account', title: 'Compte & Sécurité', icon: <Lock size={20} />, description: 'Mot de passe et accès' },
        { id: 'notifications', title: 'Notifications', icon: <Bell size={20} />, description: 'Alertes et messages' },
        { id: 'display', title: 'Affichage', icon: <Eye size={20} />, description: 'Thème et langue' }
    ];

    const handleProfileUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await userApi.updateProfile(profileData);
            setUser(response.data.data.user);
            toast.success('Profil mis à jour !');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            await userApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Mot de passe modifié !');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Ancien mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setIsLoading(true);
        try {
            // Note: uploadAvatar in api.ts uses simple 'avatar' as key
            await userApi.uploadAvatar(file);
            const userResponse = await authApi.me(); // Use authApi instead of userApi
            setUser(userResponse.data.data.user);
            toast.success('Photo de profil mise à jour');
        } catch (error) {
            toast.error('Erreur lors de l\'upload de l\'image');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <DriverLayout>
            <div className="max-w-6xl mx-auto">
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Paramètres</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Personnalisez votre compte et vos préférences conducteur.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-4 space-y-2">
                                {sections.map((section) => {
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${isActive
                                                ? 'bg-[#13ec6d] text-white shadow-lg shadow-[#13ec6d]/20'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#13ec6d]'}`}>
                                                {section.icon}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold tracking-tight">{section.title}</p>
                                                <p className={`text-[10px] font-medium opacity-70 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                                    {section.description}
                                                </p>
                                            </div>
                                            {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm">
                                    <Trash2 size={20} />
                                    Supprimer le compte
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm min-h-[600px]"
                        >
                            {activeSection === 'profile' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Profil Conducteur</h3>
                                        <div className="flex items-center gap-8 mb-10">
                                            <div className="relative">
                                                <img
                                                    src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5001${user.avatarUrl}`) : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                                    alt="Avatar"
                                                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                                                />
                                                <button
                                                    onClick={() => avatarInputRef.current?.click()}
                                                    className="absolute -right-2 -bottom-2 bg-[#13ec6d] text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <Camera size={16} />
                                                </button>
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">{user?.fullName}</h4>
                                                <p className="text-sm text-slate-400 font-medium">{user?.email}</p>
                                                <div className="flex gap-2 mt-3">
                                                    <span className="text-[10px] bg-[#13ec6d]/10 text-[#13ec6d] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-[#13ec6d]/20">Pro Driver</span>
                                                    {user?.isVerified && (
                                                        <span className="text-[10px] bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded font-black uppercase tracking-wider border border-sky-500/20 flex items-center gap-1">
                                                            <CheckCircle2 size={10} /> Vérifié
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                                                <input
                                                    type="text"
                                                    value={profileData.firstName}
                                                    onChange={e => setProfileData(p => ({ ...p, firstName: e.target.value }))}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                                                <input
                                                    type="text"
                                                    value={profileData.lastName}
                                                    onChange={e => setProfileData(p => ({ ...p, lastName: e.target.value }))}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Téléphone</label>
                                                <div className="relative">
                                                    <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                                                        placeholder="0550 00 00 00"
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-12 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Biographie</label>
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={e => setProfileData(p => ({ ...p, bio: e.target.value }))}
                                                    placeholder="Parlez-nous de vous..."
                                                    className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'account' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 text-center md:text-left">Sécurité & Accès</h3>
                                    <div className="space-y-6 max-w-md mx-auto md:mx-0">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none dark:text-white font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Additional sections (Notifications, Display) kept as visual placeholder for now as requested integration focus is functional backend connection */}
                            {activeSection === 'notifications' && <div className="py-20 text-center font-bold text-slate-400">Paramètres de notifications bientôt disponibles.</div>}
                            {activeSection === 'display' && <div className="py-20 text-center font-bold text-slate-400">Préférences d'affichage bientôt disponibles.</div>}

                            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button
                                    disabled={isLoading}
                                    onClick={activeSection === 'profile' ? handleProfileUpdate : handlePasswordChange}
                                    className="bg-[#13ec6d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-[#13ec6d]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Sauvegarder
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default Settings;
