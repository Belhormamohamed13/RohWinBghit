import React from 'react';
import { cn } from '@/utils/cn';

// Icons
const VerifiedIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const LockClosedIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const FaceIdIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

// Trust Badge Component
interface TrustBadgeProps {
    type: 'verified' | 'secure' | 'face_id' | 'payment' | 'rating' | 'trusted';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
    type,
    size = 'md',
    showLabel = true,
    className,
}) => {
    const config = {
        verified: {
            icon: VerifiedIcon,
            label: 'موثق',
            bgColor: 'bg-primary-100',
            textColor: 'text-primary-700',
            iconColor: 'text-primary-600',
        },
        secure: {
            icon: ShieldCheckIcon,
            label: 'آمن',
            bgColor: 'bg-info-light',
            textColor: 'text-info-dark',
            iconColor: 'text-info-600',
        },
        face_id: {
            icon: FaceIdIcon,
            label: 'التحقق بالوجه',
            bgColor: 'bg-primary-100',
            textColor: 'text-primary-700',
            iconColor: 'text-primary-600',
        },
        payment: {
            icon: LockClosedIcon,
            label: 'دفع آمن',
            bgColor: 'bg-success-light',
            textColor: 'text-success-dark',
            iconColor: 'text-success-600',
        },
        rating: {
            icon: StarIcon,
            label: 'تقييم عالي',
            bgColor: 'bg-warning-light',
            textColor: 'text-warning-dark',
            iconColor: 'text-warning-500',
        },
        trusted: {
            icon: CheckCircleIcon,
            label: 'موثوق',
            bgColor: 'bg-primary-100',
            textColor: 'text-primary-700',
            iconColor: 'text-primary-600',
        },
    };

    const { icon: Icon, label, bgColor, textColor, iconColor } = config[type];

    const sizeClasses = {
        sm: {
            container: 'px-2 py-0.5 text-xs gap-1',
            icon: 'w-3 h-3',
        },
        md: {
            container: 'px-2.5 py-1 text-xs gap-1.5',
            icon: 'w-3.5 h-3.5',
        },
        lg: {
            container: 'px-3 py-1.5 text-sm gap-2',
            icon: 'w-4 h-4',
        },
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full font-medium',
                bgColor,
                textColor,
                sizeClasses[size].container,
                className
            )}
        >
            <Icon className={cn(sizeClasses[size].icon, iconColor)} />
            {showLabel && <span>{label}</span>}
        </div>
    );
};

// Verified Driver Badge
interface VerifiedDriverBadgeProps {
    isVerified: boolean;
    verifiedAt?: string;
    size?: 'sm' | 'md';
}

export const VerifiedDriverBadge: React.FC<VerifiedDriverBadgeProps> = ({
    isVerified,
    verifiedAt,
    size = 'md',
}) => {
    if (!isVerified) return null;

    return (
        <div className="flex items-center gap-1.5">
            <TrustBadge type="verified" size={size} showLabel={false} />
            {size === 'md' && (
                <span className="text-xs text-dark-500">
                    سائق موثق منذ {verifiedAt}
                </span>
            )}
        </div>
    );
};

// Secure Payment Badge
interface SecurePaymentBadgeProps {
    method?: string;
}

export const SecurePaymentBadge: React.FC<SecurePaymentBadgeProps> = ({
    method = 'دفع آمن',
}) => {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-success-light rounded-lg">
            <LockClosedIcon className="w-4 h-4 text-success-600" />
            <span className="text-sm font-medium text-success-dark">{method}</span>
        </div>
    );
};

// Trust Indicators Section
interface TrustIndicatorsProps {
    showVerified?: boolean;
    showSecure?: boolean;
    showRating?: boolean;
    showPayment?: boolean;
    className?: string;
}

export const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
    showVerified = true,
    showSecure = true,
    showRating = true,
    showPayment = true,
    className,
}) => {
    return (
        <div className={cn('flex flex-wrap items-center gap-3', className)}>
            {showVerified && <TrustBadge type="verified" size="sm" />}
            {showSecure && <TrustBadge type="secure" size="sm" />}
            {showRating && <TrustBadge type="rating" size="sm" />}
            {showPayment && <TrustBadge type="payment" size="sm" />}
        </div>
    );
};

// Security Features List
export const SecurityFeatures = () => {
    const features = [
        { icon: ShieldCheckIcon, title: 'سائقون موثقون', description: 'التحقق من الهوية والترخيص' },
        { icon: LockClosedIcon, title: 'دفع آمن', description: 'معاملات مالية محمية' },
        { icon: FaceIdIcon, title: 'التحقق من الهوية', description: 'تأكيد هوية المستخدم' },
        { icon: CreditCardIcon, title: 'حماية الدفع', description: 'استرداد في حالة الغش' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center text-center p-4 rounded-xl bg-dark-50 hover:bg-dark-100 transition-colors duration-200"
                >
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                        <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-medium text-dark-900 mb-1">{feature.title}</h4>
                    <p className="text-xs text-dark-500">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default TrustBadge;
