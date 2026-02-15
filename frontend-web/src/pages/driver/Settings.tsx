import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Eye,
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
        { id: 'profile', title: 'Public Profile', icon: <User size={18} />, description: 'Manage visible info' },
        { id: 'account', title: 'Security', icon: <Lock size={18} />, description: 'Password & access' },
        { id: 'notifications', title: 'Notifications', icon: <Bell size={18} />, description: 'Alerts & messages' },
        { id: 'display', title: 'Display', icon: <Eye size={18} />, description: 'Theme & language' }
    ];

    const handleProfileUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await userApi.updateProfile(profileData);
            setUser(response.data.data.user);
            toast.success('Profile updated!');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await userApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Incorrect current password');
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
            await userApi.uploadAvatar(file);
            const userResponse = await authApi.me();
            setUser(userResponse.data.data.user);
            toast.success('Profile picture updated');
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DriverLayout>
            <div className="min-h-screen text-white p-6 md:p-10 font-body">
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />

                {/* Header */}
                <div className="mb-10 max-w-6xl mx-auto">
                    <h1 className="text-4xl font-display text-accent-teal tracking-wide mb-2">SETTINGS</h1>
                    <p className="text-white/60 text-lg font-body">Customize your driver account and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                            <div className="p-4 space-y-2">
                                {sections.map((section) => {
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${isActive
                                                ? 'bg-accent-teal text-night-900 shadow-glow'
                                                : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            <div className={`${isActive ? 'text-night-900' : 'text-white/40 group-hover:text-accent-teal'}`}>
                                                {section.icon}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold tracking-tight font-display uppercase">{section.title}</p>
                                                <p className={`text-[10px] font-mono opacity-60 ${isActive ? 'text-night-900' : 'text-white/40'}`}>
                                                    {section.description}
                                                </p>
                                            </div>
                                            {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-white/5">
                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest font-mono">
                                    <Trash2 size={16} />
                                    Delete Account
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
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-card min-h-[600px] backdrop-blur-xl relative overflow-hidden"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-teal/5 rounded-full blur-[100px] -mt-20 -mr-20 pointer-events-none"></div>

                            {activeSection === 'profile' && (
                                <div className="space-y-10 relative z-10">
                                    <div>
                                        <h3 className="text-3xl font-display text-accent-teal mb-8 tracking-wide">DRIVER PROFILE</h3>
                                        <div className="flex items-center gap-8 mb-10">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-accent-teal rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <img
                                                    src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5001${user.avatarUrl}`) : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                                    alt="Avatar"
                                                    className="relative w-28 h-28 rounded-3xl object-cover border-2 border-white/20 shadow-2xl"
                                                />
                                                <button
                                                    onClick={() => avatarInputRef.current?.click()}
                                                    className="absolute -right-3 -bottom-3 bg-accent-teal text-night-900 p-3 rounded-xl shadow-lg hover:scale-110 hover:shadow-glow transition-all"
                                                >
                                                    <Camera size={18} />
                                                </button>
                                            </div>
                                            <div>
                                                <h4 className="font-display text-2xl text-white tracking-wide">{user?.fullName}</h4>
                                                <p className="text-sm text-white/40 font-mono mb-3">{user?.email}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] bg-accent-teal/10 text-accent-teal px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-accent-teal/20 font-mono">Pro Driver</span>
                                                    {user?.isVerified && (
                                                        <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-green-500/20 flex items-center gap-1 font-mono">
                                                            <CheckCircle2 size={12} /> Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">First Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.firstName}
                                                    onChange={e => setProfileData(p => ({ ...p, firstName: e.target.value }))}
                                                    className="w-full bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold transition-all focus:border-accent-teal/50"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.lastName}
                                                    onChange={e => setProfileData(p => ({ ...p, lastName: e.target.value }))}
                                                    className="w-full bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold transition-all focus:border-accent-teal/50"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                                                    className="w-full bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold transition-all focus:border-accent-teal/50"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">Bio</label>
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={e => setProfileData(p => ({ ...p, bio: e.target.value }))}
                                                    placeholder="Tell passengers about yourself..."
                                                    className="w-full h-32 bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold resize-none transition-all focus:border-accent-teal/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'account' && (
                                <div className="space-y-10 relative z-10">
                                    <h3 className="text-3xl font-display text-accent-teal mb-8 tracking-wide">SECURITY & ACCESS</h3>
                                    <div className="space-y-6 max-w-md">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                                                className="w-full bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold transition-all focus:border-accent-teal/50"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                                                className="w-full bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold transition-all focus:border-accent-teal/50"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 font-mono">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                                                className="w-full bg-night-800 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent-teal outline-none text-white font-bold transition-all focus:border-accent-teal/50"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20 border border-white/10">
                                        <Bell size={32} />
                                    </div>
                                    <h3 className="text-xl font-display text-white mb-2 tracking-wide">NOTIFICATIONS COMING SOON</h3>
                                    <p className="text-white/40 font-mono text-sm">You'll be able to manage your alerts here.</p>
                                </div>
                            )}

                            {activeSection === 'display' && (
                                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20 border border-white/10">
                                        <Eye size={32} />
                                    </div>
                                    <h3 className="text-xl font-display text-white mb-2 tracking-wide">THEME SETTINGS LOCKED</h3>
                                    <p className="text-white/40 font-mono text-sm">System is currently locked to Dark Mode.</p>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t border-white/10 flex justify-end relative z-10">
                                <button
                                    disabled={isLoading}
                                    onClick={activeSection === 'profile' ? handleProfileUpdate : handlePasswordChange}
                                    className="bg-accent-teal text-night-900 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
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
