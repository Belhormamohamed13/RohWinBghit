import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

// Icons
const HomeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zM16 17a2 2 0 104 0 2 2 0 00-4 0zM3 9h13a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v3m-2 4h.01" />
    </svg>
);

const ChatIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

interface MobileNavProps {
    userRole?: 'passenger' | 'driver' | 'admin';
}

export const MobileNav: React.FC<MobileNavProps> = ({ userRole = 'passenger' }) => {
    const location = useLocation();

    const passengerNav: NavItem[] = [
        { path: '/', label: 'الرئيسية', icon: <HomeIcon className="w-6 h-6" /> },
        { path: '/search', label: 'بحث', icon: <SearchIcon className="w-6 h-6" /> },
        { path: '/trips', label: 'رحلاتي', icon: <CarIcon className="w-6 h-6" /> },
        { path: '/messages', label: 'الرسائل', icon: <ChatIcon className="w-6 h-6" />, badge: 2 },
        { path: '/profile', label: 'حسابي', icon: <UserIcon className="w-6 h-6" /> },
    ];

    const driverNav: NavItem[] = [
        { path: '/driver', label: 'لوحة التحكم', icon: <HomeIcon className="w-6 h-6" /> },
        { path: '/driver/trips', label: 'رحلاتي', icon: <CarIcon className="w-6 h-6" /> },
        { path: '/driver/publish', label: 'نشر رحلة', icon: <PlusIcon className="w-6 h-6" /> },
        { path: '/driver/messages', label: 'الرسائل', icon: <ChatIcon className="w-6 h-6" />, badge: 3 },
        { path: '/driver/profile', label: 'حسابي', icon: <UserIcon className="w-6 h-6" /> },
    ];

    const navItems = userRole === 'driver' ? driverNav : passengerNav;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex flex-col items-center justify-center py-2 px-3 relative transition-colors duration-200',
                                isActive ? 'text-primary-600' : 'text-dark-400 hover:text-dark-600'
                            )}
                        >
                            <div className="relative">
                                {item.icon}
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-danger-500 text-white text-[10px] font-bold rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs mt-1 font-medium">{item.label}</span>
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

// Mobile Header
interface MobileHeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
    title,
    showBack = false,
    onBack,
    rightAction,
}) => {
    return (
        <header className="sticky top-0 bg-white border-b border-border z-30 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBack && onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-dark-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <h1 className="text-lg font-semibold text-dark-900">{title}</h1>
                </div>
                {rightAction && <div>{rightAction}</div>}
            </div>
        </header>
    );
};

// Mobile Full Screen Modal
interface MobileModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const MobileModal: React.FC<MobileModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden animate-slide-up">
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h2 className="font-semibold text-dark-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-dark-100 rounded-lg"
                        >
                            <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
