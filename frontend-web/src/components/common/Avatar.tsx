import React from 'react';
import { cn } from '@/utils/cn';

// Icons
const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = 'md',
    className,
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
        '2xl': 'w-20 h-20 text-xl',
    };

    // Generate initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className={cn(
                'avatar',
                sizes[size],
                !src && 'bg-primary-100 text-primary-700',
                className
            )}
        >
            {src ? (
                <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
            ) : name ? (
                <span className="font-medium">{getInitials(name)}</span>
            ) : (
                <UserIcon className="w-1/2 h-1/2" />
            )}
        </div>
    );
};

// Avatar Group for multiple avatars
interface AvatarGroupProps {
    avatars: Array<{ src?: string; name?: string }>;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    avatars,
    max = 4,
    size = 'md',
}) => {
    const displayedAvatars = avatars.slice(0, max);
    const remaining = avatars.length - max;

    const sizeClasses = {
        sm: 'w-6 h-6 text-xs -ml-2',
        md: 'w-8 h-8 text-xs -ml-2',
        lg: 'w-10 h-10 text-sm -ml-3',
    };

    return (
        <div className="flex items-center">
            {displayedAvatars.map((avatar, index) => (
                <div
                    key={index}
                    className={cn(
                        'ring-2 ring-white rounded-full',
                        sizeClasses[size],
                        index > 0 && 'border-2 border-white'
                    )}
                    style={{ marginLeft: index > 0 ? (size === 'lg' ? '-12px' : '-8px') : 0 }}
                >
                    <Avatar src={avatar.src} name={avatar.name} size={size} />
                </div>
            ))}
            {remaining > 0 && (
                <div
                    className={cn(
                        'flex items-center justify-center bg-dark-200 text-dark-600 font-medium rounded-full ring-2 ring-white',
                        sizeClasses[size]
                    )}
                    style={{ marginLeft: size === 'lg' ? '-12px' : '-8px' }}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
};

// Rating Stars Component
interface RatingProps {
    value: number;
    max?: number;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Rating: React.FC<RatingProps> = ({
    value,
    max = 5,
    showValue = false,
    size = 'md',
    className,
}) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    const StarIcon = ({ filled }: { filled: boolean }) => (
        <svg
            className={cn(sizeClasses[size], filled ? 'text-warning-500' : 'text-dark-300')}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div className="flex items-center">
                {Array.from({ length: max }).map((_, i) => (
                    <StarIcon key={i} filled={i < Math.floor(value)} />
                ))}
            </div>
            {showValue && (
                <span className="text-sm font-medium text-dark-700 ml-1">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default Avatar;
