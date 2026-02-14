import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

// Icons
const FilterIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    children,
    defaultOpen = true,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left"
            >
                <h3 className="font-medium text-dark-900">{title}</h3>
                <ChevronDownIcon
                    className={cn(
                        'w-4 h-4 text-dark-400 transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
};

interface FiltersSidebarProps {
    filters: FiltersState;
    onChange: (filters: FiltersState) => void;
    onClear?: () => void;
    className?: string;
}

export interface FiltersState {
    departureTime: string[];
    priceRange: [number, number];
    seatsAvailable: number;
    vehicleType: string[];
    rating: number;
    verifiedDriver: boolean;
    smokingAllowed: boolean;
    airConditioned: boolean;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
    filters,
    onChange,
    onClear,
    className,
}) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: keyof FiltersState, value: unknown) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onChange(newFilters);
    };

    const handleClear = () => {
        const defaultFilters: FiltersState = {
            departureTime: [],
            priceRange: [0, 5000],
            seatsAvailable: 1,
            vehicleType: [],
            rating: 0,
            verifiedDriver: false,
            smokingAllowed: false,
            airConditioned: false,
        };
        setLocalFilters(defaultFilters);
        onClear?.();
    };

    // Departure time options
    const timeOptions = [
        { value: 'morning', label: 'صباحاً (6-12)', range: '06:00 - 12:00' },
        { value: 'afternoon', label: 'ظهراً (12-18)', range: '12:00 - 18:00' },
        { value: 'evening', label: 'مساءً (18-24)', range: '18:00 - 24:00' },
        { value: 'night', label: 'ليلاً (0-6)', range: '00:00 - 06:00' },
    ];

    // Vehicle type options
    const vehicleTypes = [
        { value: 'sedan', label: 'سيدان' },
        { value: 'suv', label: 'دفع رباعي' },
        { value: 'van', label: 'فان' },
        { value: 'compact', label: 'compact' },
    ];

    return (
        <div className={cn('bg-white rounded-xl shadow-card p-5', className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FilterIcon className="w-5 h-5 text-primary-600" />
                    <h2 className="font-semibold text-dark-900">الفلاتر</h2>
                </div>
                <button
                    onClick={handleClear}
                    className="text-sm text-primary-600 hover:text-primary-700"
                >
                    إعادة تعيين
                </button>
            </div>

            {/* Departure Time */}
            <div className="mb-4">
                <FilterSection title="وقت المغادرة">
                    <div className="space-y-2">
                        {timeOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={localFilters.departureTime.includes(option.value)}
                                    onChange={(e) => {
                                        const newTimes = e.target.checked
                                            ? [...localFilters.departureTime, option.value]
                                            : localFilters.departureTime.filter((t) => t !== option.value);
                                        handleFilterChange('departureTime', newTimes);
                                    }}
                                    className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                                />
                                <div className="flex-1">
                                    <span className="text-sm text-dark-700 group-hover:text-dark-900">
                                        {option.label}
                                    </span>
                                    <span className="block text-xs text-dark-400">{option.range}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>

            {/* Price Range */}
            <div className="mb-4">
                <FilterSection title="السعر">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={localFilters.priceRange[0]}
                                onChange={(e) =>
                                    handleFilterChange('priceRange', [Number(e.target.value), localFilters.priceRange[1]])
                                }
                                className="input input-sm"
                                placeholder="من"
                            />
                            <span className="text-dark-400">-</span>
                            <input
                                type="number"
                                value={localFilters.priceRange[1]}
                                onChange={(e) =>
                                    handleFilterChange('priceRange', [localFilters.priceRange[0], Number(e.target.value)])
                                }
                                className="input input-sm"
                                placeholder="إلى"
                            />
                        </div>
                        <p className="text-xs text-dark-500 text-center">
                            {localFilters.priceRange[0]} - {localFilters.priceRange[1]} د.ج
                        </p>
                    </div>
                </FilterSection>
            </div>

            {/* Available Seats */}
            <div className="mb-4">
                <FilterSection title="المقاعد المتاحة">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleFilterChange('seatsAvailable', num)}
                                className={cn(
                                    'flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                                    localFilters.seatsAvailable === num
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                                )}
                            >
                                {num}+
                            </button>
                        ))}
                    </div>
                </FilterSection>
            </div>

            {/* Vehicle Type */}
            <div className="mb-4">
                <FilterSection title="نوع السيارة">
                    <div className="space-y-2">
                        {vehicleTypes.map((type) => (
                            <label
                                key={type.value}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={localFilters.vehicleType.includes(type.value)}
                                    onChange={(e) => {
                                        const newTypes = e.target.checked
                                            ? [...localFilters.vehicleType, type.value]
                                            : localFilters.vehicleType.filter((t) => t !== type.value);
                                        handleFilterChange('vehicleType', newTypes);
                                    }}
                                    className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-dark-700 group-hover:text-dark-900">
                                    {type.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>

            {/* Rating */}
            <div className="mb-4">
                <FilterSection title="التقييم">
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleFilterChange('rating', rating)}
                                className={cn(
                                    'flex items-center gap-2 w-full p-2 rounded-lg transition-colors duration-200',
                                    localFilters.rating === rating
                                        ? 'bg-primary-50'
                                        : 'hover:bg-dark-50'
                                )}
                            >
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                            key={i}
                                            className={cn(
                                                'w-4 h-4',
                                                i < rating ? 'text-warning-500' : 'text-dark-300'
                                            )}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-dark-500">وأكثر</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>
            </div>

            {/* Additional Options */}
            <div className="mb-4">
                <FilterSection title="خيارات إضافية">
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.verifiedDriver}
                                onChange={(e) => handleFilterChange('verifiedDriver', e.target.checked)}
                                className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-dark-700">سائق موثق</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.airConditioned}
                                onChange={(e) => handleFilterChange('airConditioned', e.target.checked)}
                                className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-dark-700">مكيّف</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.smokingAllowed}
                                onChange={(e) => handleFilterChange('smokingAllowed', e.target.checked)}
                                className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-dark-700">التدخين مسموح</span>
                        </label>
                    </div>
                </FilterSection>
            </div>

            {/* Active Filters Display */}
            {(localFilters.departureTime.length > 0 ||
                localFilters.vehicleType.length > 0 ||
                localFilters.rating > 0 ||
                localFilters.verifiedDriver ||
                localFilters.airConditioned ||
                localFilters.smokingAllowed) && (
                    <div className="pt-4 border-t border-border">
                        <p className="text-xs text-dark-500 mb-2">الفلاتر النشطة:</p>
                        <div className="flex flex-wrap gap-1">
                            {localFilters.departureTime.map((time) => (
                                <Badge key={time} variant="primary" size="sm">
                                    {timeOptions.find((t) => t.value === time)?.label}
                                </Badge>
                            ))}
                            {localFilters.rating > 0 && (
                                <Badge variant="warning" size="sm">
                                    {localFilters.rating}+ نجمة
                                </Badge>
                            )}
                            {localFilters.verifiedDriver && (
                                <Badge variant="success" size="sm">موثق</Badge>
                            )}
                            {localFilters.airConditioned && (
                                <Badge variant="info" size="sm">مكيّف</Badge>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
};

// Mobile Filters Modal
interface MobileFiltersProps {
    filters: FiltersState;
    onChange: (filters: FiltersState) => void;
    onClose: () => void;
    onApply: () => void;
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
    filters,
    onChange,
    onClose,
    onApply,
}) => {
    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
                    <h2 className="font-semibold text-dark-900">الفلاتر</h2>
                    <button onClick={onClose} className="p-2">
                        <CloseIcon className="w-5 h-5 text-dark-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 pb-24">
                    <FiltersSidebar
                        filters={filters}
                        onChange={onChange}
                    />
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button className="flex-1" onClick={onApply}>
                        تطبيق
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FiltersSidebar;
