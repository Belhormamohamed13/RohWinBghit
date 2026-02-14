import React from 'react';
import { Link } from 'react-router-dom';
import { SearchForm } from '@/components/common/SearchForm';
import { TrustIndicators, SecurityFeatures } from '@/components/common/TrustBadges';
import Button from '@/components/common/Button';

// Icons
const CarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zM16 17a2 2 0 104 0 2 2 0 00-4 0zM3 9h13a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v3m-2 4h.01" />
    </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const WalletIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

interface HeroProps {
    onSearch?: (data: { origin: string; destination: string; date: string; passengers: number }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
    return (
        <section className="relative min-h-[600px] md:min-h-[700px] gradient-hero overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
            </div>

            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
                        رحلتك تبدأ هنا
                        <span className="block">مع راوين بغيت</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        اكتشف طريقة جديدة للتنقل في الجزائر. شارك رحلاتك مع الآخرين ووفّر الوقت والمال.
                        آمن وموثوق.
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex justify-center mb-8 animate-slide-up">
                    <TrustIndicators showVerified showSecure showRating showPayment />
                </div>

                {/* Search Form */}
                <div className="animate-slide-up animation-delay-200">
                    <SearchForm onSearch={onSearch} />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-slide-up animation-delay-300">
                    <StatCard
                        icon={<UsersIcon className="w-6 h-6" />}
                        value="50,000+"
                        label="مستخدم نشط"
                    />
                    <StatCard
                        icon={<CarIcon className="w-6 h-6" />}
                        value="120,000+"
                        label="رحلة مكتملة"
                    />
                    <StatCard
                        icon={<ShieldIcon className="w-6 h-6" />}
                        value="100%"
                        label="آمن وموثوق"
                    />
                    <StatCard
                        icon={<WalletIcon className="w-6 h-6" />}
                        value="40%"
                        label="توفير في التكلفة"
                    />
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc" />
                </svg>
            </div>
        </section>
    );
};

// Stat Card Component
interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors duration-300">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center text-white">
                {icon}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-white/70">{label}</p>
        </div>
    );
};

// Features Section
export const Features = () => {
    const features = [
        {
            icon: <ShieldIcon className="w-8 h-8" />,
            title: 'سائقون موثقون',
            description: 'جميع السائقين يخضعون لعملية تحقق صارمة من الهوية والترخيص',
        },
        {
            icon: <WalletIcon className="w-8 h-8" />,
            title: 'أسعار مناسبة',
            description: 'شارك تكاليف الوقود والمواصلات ووفّر حتى 40% من مصاريف التنقل',
        },
        {
            icon: <UsersIcon className="w-8 h-8" />,
            title: 'مجتمع موثوق',
            description: 'آلاف المستخدمين الموثوقين يشاركون رحلاتهم يومياً بأمان',
        },
    ];

    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-dark-900 mb-4">لماذا تختار راوين بغيت؟</h2>
                    <p className="text-dark-600 max-w-2xl mx-auto">
                        نوفر لك تجربة تنقل آمنة ومريحة مع مجموعة من المميزات الحصرية
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card-hover text-center p-8"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-dark-900 mb-2">{feature.title}</h3>
                            <p className="text-dark-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link to="/register">
                        <Button size="lg" rightIcon={<ArrowRightIcon className="w-5 h-5" />}>
                            ابدأ رحلتك الآن
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
