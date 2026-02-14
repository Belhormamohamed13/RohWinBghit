import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    bordered?: boolean;
    glass?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hover = false,
    bordered = false,
    glass = false,
    padding = 'md',
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={cn(
                'rounded-xl bg-white',
                hover && 'transition-all duration-300 hover:shadow-elevated hover:-translate-y-1',
                bordered && 'border border-border',
                glass && 'bg-white/80 backdrop-blur-md border border-white/20',
                paddingClasses[padding],
                !hover && !bordered && !glass && 'shadow-card',
                className
            )}
        >
            {children}
        </div>
    );
};

// Card Header
interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    action,
    className,
}) => {
    return (
        <div className={cn('flex items-start justify-between mb-4', className)}>
            <div>
                <h3 className="text-lg font-semibold text-dark-900">{title}</h3>
                {subtitle && <p className="text-sm text-dark-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};

// Card Content
interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return <div className={cn('', className)}>{children}</div>;
};

// Card Footer
interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    return (
        <div className={cn('flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border', className)}>
            {children}
        </div>
    );
};

export default Card;
