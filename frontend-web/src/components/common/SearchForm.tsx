import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { Select } from '@/components/common/Input';

// Icons
const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LocationMarkerIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const SwapIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

// Sample wilayas for the dropdown
const wilayas = [
    { value: 'algiers', label: 'الجزائر' },
    { value: 'oran', label: 'وهران' },
    { value: 'constantine', label: 'قسنطينة' },
    { value: 'annaba', label: 'عنابة' },
    { value: 'blida', label: 'البليدة' },
    { value: 'batna', label: 'باتنة' },
    { value: 'tlemcen', label: 'تلمسان' },
    { value: 'bejaia', label: ' بجاية' },
    { value: 'tizi', label: 'تيزي وزو' },
    { value: 'sidi', label: 'سيدي بلعباس' },
    { value: 'mostaganem', label: 'مستغانم' },
    { value: 'biskra', label: 'بسكرة' },
    { value: 'setif', label: 'سطيف' },
    { value: 'el', label: 'عين الدفلى' },
    { value: 'medea', label: 'المدية' },
    { value: 'jijel', label: 'جيجل' },
    { value: 'souk', label: ' سوق أهراس' },
    { value: 'tipaza', label: 'تيبازة' },
    { value: 'bouira', label: 'البويرة' },
    { value: 'tamanrasset', label: 'تمنراست' },
    { value: 'bechar', label: 'بشار' },
    { value: 'laghouat', label: 'الأغواط' },
    { value: 'ouargla', label: 'ورقلة' },
    { value: 'khenchela', label: 'خنشلة' },
    { value: 'illizi', label: 'إليزي' },
    { value: 'bordj', label: 'برج بوعريريج' },
    { value: 'boumerdes', label: 'بومرداس' },
    { value: 'tarf', label: ' الطارف' },
    { value: 'ain', label: 'عين تموشنت' },
    { value: 'ghardaia', label: 'غرداية' },
    { value: 'mascara', label: 'معسكرة' },
    { value: 'oued', label: 'وادي ريال' },
    { value: 'elbayadh', label: 'البيض' },
    { value: 'naama', label: 'النعامة' },
    { value: 'timimoun', label: 'تيميمون' },
    { value: 'adrar', label: 'أدرار' },
    { value: 'kasar', label: 'قصر高原' },
    { value: 'ino', label: 'إن أمن' },
    { value: 'djelfa', label: 'جلفة' },
    { value: 'mila', label: 'ميلة' },
    { value: 'tissemsilt', label: 'تيسمسيلت' },
    { value: 'eloued', label: 'الوادي' },
    { value: 'koul', label: 'قالمة' },
    { value: 'tiaret', label: 'تيارت' },
    { value: 'reggaa', label: 'الرقعة' },
    { value: 'bba', label: 'بسكرة' },
    { value: 'bmer', label: 'برج بوعريريج' },
    { value: 'chlef', label: 'الشلف' },
    { value: 'aintem', label: 'عين تميم' },
];

interface SearchFormProps {
    onSearch?: (data: SearchFormData) => void;
    className?: string;
}

export interface SearchFormData {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
}

export const SearchForm: React.FC<SearchFormProps> = ({
    onSearch,
    className,
}) => {
    const [formData, setFormData] = useState<SearchFormData>({
        origin: '',
        destination: '',
        date: '',
        passengers: 1,
    });

    const [isSwapped, setIsSwapped] = useState(false);

    const handleSwap = () => {
        setFormData((prev) => ({
            ...prev,
            origin: prev.destination,
            destination: prev.origin,
        }));
        setIsSwapped(!isSwapped);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(formData);
    };

    const passengerOptions = [
        { value: '1', label: '1 راكب' },
        { value: '2', label: '2 ركاب' },
        { value: '3', label: '3 ركاب' },
        { value: '4', label: '4 ركاب' },
    ];

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'bg-white rounded-2xl shadow-elevated p-4 md:p-6',
                className
            )}
        >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Origin */}
                <div className="md:col-span-1">
                    <label className="label">من</label>
                    <div className="relative">
                        <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                        <Select
                            options={wilayas}
                            placeholder="اختر المدينة"
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Swap Button */}
                <div className="hidden md:flex md:col-span-1 items-end justify-center pb-2">
                    <button
                        type="button"
                        onClick={handleSwap}
                        className="p-2 rounded-full bg-dark-100 hover:bg-dark-200 transition-colors duration-200"
                    >
                        <SwapIcon className="w-5 h-5 text-dark-600" />
                    </button>
                </div>

                {/* Destination */}
                <div className="md:col-span-1">
                    <label className="label">إلى</label>
                    <div className="relative">
                        <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-danger-500" />
                        <Select
                            options={wilayas}
                            placeholder="اختر المدينة"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Date */}
                <div className="md:col-span-1">
                    <label className="label">التاريخ</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="input pl-10"
                        />
                    </div>
                </div>

                {/* Passengers */}
                <div className="md:col-span-1">
                    <label className="label">الركاب</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <Select
                            options={passengerOptions}
                            value={formData.passengers.toString()}
                            onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <div className="mt-4">
                <Button type="submit" className="w-full md:w-auto md:px-8" size="lg">
                    <SearchIcon className="w-5 h-5" />
                    بحث عن رحلة
                </Button>
            </div>
        </form>
    );
};

// Compact Search Form
interface SearchFormCompactProps {
    onSearch?: (data: SearchFormData) => void;
    className?: string;
}

export const SearchFormCompact: React.FC<SearchFormCompactProps> = ({
    onSearch,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={cn('', className)}>
            {!isExpanded ? (
                <div
                    className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card cursor-pointer hover:shadow-elevated transition-all duration-200"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <SearchIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-dark-900">البحث عن رحلة</p>
                        <p className="text-sm text-dark-500">من أين إلى أين؟</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-elevated p-4">
                    <SearchForm onSearch={onSearch} />
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="mt-2 text-sm text-dark-500 hover:text-dark-700"
                    >
                        إلغاء
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchForm;
