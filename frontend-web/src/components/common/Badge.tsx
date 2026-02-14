import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'gray',
    size = 'md',
    children,
    className,
}) => {
    const variants = {
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-success-light text-success-dark',
        warning: 'bg-warning-light text-warning-dark',
        danger: 'bg-danger-light text-danger-dark',
        info: 'bg-info-light text-info-dark',
        gray: 'bg-dark-100 text-dark-600',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
    };

    return (
        <span className={cn('badge', variants[variant], sizes[size], className)}>
            {children}
        </span>
    );
};

// Status Badge with dot indicator
interface StatusBadgeProps {
    status: 'active' | 'pending' | 'inactive' | 'completed' | 'cancelled' | 'full';
    showDot?: boolean;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    showDot = true,
    className,
}) => {
    const config = {
        active: { label: 'نشط', variant: 'success' as const },
        pending: { label: 'معلق', variant: 'warning' as const },
        inactive: { label: 'غير نشط', variant: 'gray' as const },
        completed: { label: 'مكتمل', variant: 'success' as const },
        cancelled: { label: 'ملغى', variant: 'danger' as const },
        full: { label: 'ممتلئ', variant: 'warning' as const },
    };

    const { label, variant } = config[status];

    return (
        <div className={cn('inline-flex items-center gap-1.5', className)}>
            {showDot && (
                <span
                    className={cn('w-2 h-2 rounded-full', {
                        'bg-success-500': variant === 'success',
                        'bg-warning-500': variant === 'warning',
                        'bg-danger-500': variant === 'danger',
                        'bg-dark-400': variant === 'gray',
                    })}
                />
            )}
            <Badge variant={variant}>{label}</Badge>
        </div>
    );
};

export default Badge;
