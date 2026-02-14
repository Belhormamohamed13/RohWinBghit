import React from 'react';
import { cn } from '@/utils/cn';
import { Avatar, Rating } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/common/Badge';
import { Badge } from '@/components/common/Badge';
import Button from '@/components/common/Button';

// Icons
const LocationMarkerIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const CarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zM16 17a2 2 0 104 0 2 2 0 00-4 0zM3 9h13a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v3m-2 4h.01" />
    </svg>
);

// Types
interface TripCardProps {
    trip: {
        id: string;
        origin: string;
        destination: string;
        departureTime: string;
        arrivalTime?: string;
        date: string;
        price: number;
        availableSeats: number;
        totalSeats: number;
        driver: {
            id: string;
            name: string;
            avatar?: string;
            rating: number;
            tripsCount: number;
            isVerified: boolean;
        };
        vehicle?: {
            model: string;
            color: string;
            licensePlate: string;
        };
        status?: 'active' | 'pending' | 'completed' | 'cancelled' | 'full';
        isBookmarked?: boolean;
    };
    onBook?: () => void;
    onViewDetails?: () => void;
    onBookmark?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
    trip,
    onBook,
    onViewDetails,
    onBookmark,
}) => {
    const {
        origin,
        destination,
        departureTime,
        arrivalTime,
        date,
        price,
        availableSeats,
        totalSeats,
        driver,
        vehicle,
        status = 'active',
        isBookmarked = false,
    } = trip;

    // Format date
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ar-DZ', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Calculate seats progress
    const seatsProgress = ((totalSeats - availableSeats) / totalSeats) * 100;

    return (
        <div className="trip-card bg-white border border-border/50 rounded-xl overflow-hidden">
            <div className="p-5">
                {/* Header - Date and Status */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-dark-600">
                        {formatDate(date)}
                    </span>
                    <div className="flex items-center gap-2">
                        {status === 'active' && (
                            <Badge variant="success" size="sm">متاح</Badge>
                        )}
                        {status === 'full' && (
                            <Badge variant="warning" size="sm">ممتلئ</Badge>
                        )}
                        {status === 'completed' && (
                            <Badge variant="gray" size="sm">مكتمل</Badge>
                        )}
                    </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Time line */}
                    <div className="flex flex-col items-center pt-1">
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                        <div className="w-0.5 h-12 bg-primary-200" />
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                    </div>

                    {/* Locations */}
                    <div className="flex-1">
                        <div className="flex items-start gap-2">
                            <LocationMarkerIcon className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-dark-900">{origin}</p>
                                <p className="text-sm text-dark-500">{departureTime}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 mt-4">
                            <LocationMarkerIcon className="w-5 h-5 text-danger-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-dark-900">{destination}</p>
                                {arrivalTime && (
                                    <p className="text-sm text-dark-500">{arrivalTime}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Driver Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar src={driver.avatar} name={driver.name} size="md" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="font-medium text-dark-900">{driver.name}</p>
                                {driver.isVerified && (
                                    <svg className="w-4 h-4 text-info-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Rating value={driver.rating} size="sm" showValue />
                                <span className="text-xs text-dark-400">|</span>
                                <span className="text-xs text-dark-500">{driver.tripsCount} رحلة</span>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    {vehicle && (
                        <div className="hidden sm:flex items-center gap-2 text-sm text-dark-500">
                            <CarIcon className="w-4 h-4" />
                            <span>{vehicle.model} • {vehicle.color}</span>
                        </div>
                    )}
                </div>

                {/* Seats and Price */}
                <div className="flex items-center justify-between">
                    {/* Seats */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-dark-400" />
                            <div>
                                <p className="text-sm font-medium text-dark-700">
                                    {availableSeats}/{totalSeats} مقاعد
                                </p>
                                {/* Progress bar */}
                                <div className="w-20 h-1.5 bg-dark-100 rounded-full mt-1">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all duration-300',
                                            seatsProgress >= 80 ? 'bg-warning-500' : 'bg-primary-500'
                                        )}
                                        style={{ width: `${seatsProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <div className="text-left">
                            <p className="text-xs text-dark-500">السعر</p>
                            <p className="text-xl font-bold text-primary-600">
                                {price} <span className="text-sm font-medium">د.ج</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-4 bg-dark-50 border-t border-border">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={onViewDetails}
                >
                    التفاصيل
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={onBook}
                    disabled={status === 'full' || availableSeats === 0}
                >
                    حجز الآن
                </Button>
            </div>
        </div>
    );
};

// Compact Trip Card for lists
interface TripCardCompactProps {
    trip: TripCardProps['trip'];
    onClick?: () => void;
}

export const TripCardCompact: React.FC<TripCardCompactProps> = ({ trip, onClick }) => {
    return (
        <div
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-card transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            <Avatar src={trip.driver.avatar} name={trip.driver.name} size="lg" />

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-dark-900 truncate">
                        {trip.origin} ← {trip.destination}
                    </p>
                    <p className="font-bold text-primary-600">
                        {trip.price} د.ج
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-dark-500">
                    <span>{trip.departureTime}</span>
                    <span>•</span>
                    <span>{trip.availableSeats}/{trip.totalSeats} مقاعد</span>
                    <span>•</span>
                    <span className="truncate">{trip.driver.name}</span>
                </div>
            </div>
        </div>
    );
};

export default TripCard;
