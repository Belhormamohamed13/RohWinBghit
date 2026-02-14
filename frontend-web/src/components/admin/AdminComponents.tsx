import React from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { Badge, StatusBadge } from '@/components/common/Badge';
import { Avatar, Rating } from '@/components/common/Avatar';

// Icons
const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const TripIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
);

const CurrencyIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);

const DotsVerticalIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        isPositive: boolean;
    };
    icon: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    color = 'primary',
}) => {
    const colorClasses = {
        primary: 'bg-primary-100 text-primary-600',
        success: 'bg-success-light text-success-dark',
        warning: 'bg-warning-light text-warning-dark',
        danger: 'bg-danger-light text-danger-dark',
        info: 'bg-info-light text-info-dark',
    };

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-dark-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-dark-900">{value}</p>
                    {change && (
                        <p className={cn(
                            'text-sm mt-1',
                            change.isPositive ? 'text-success-600' : 'text-danger-600'
                        )}>
                            {change.isPositive ? '+' : ''}{change.value}% من الأسبوع الماضي
                        </p>
                    )}
                </div>
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Data Table Component
interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    isLoading,
    emptyMessage = 'لا توجد بيانات',
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-dark-100 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-dark-50 border-b border-border">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-dark-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        'hover:bg-dark-50 transition-colors duration-150',
                                        onRowClick && 'cursor-pointer'
                                    )}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                            {column.render
                                                ? column.render(item)
                                                : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Search and Filter Bar
interface SearchFilterBarProps {
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    filterOptions?: React.ReactNode;
    actions?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    searchPlaceholder = 'بحث...',
    onSearch,
    filterOptions,
    actions,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="input pr-10"
                />
            </div>

            {/* Filters */}
            {filterOptions && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <FilterIcon className="w-4 h-4" />
                        فلتر
                    </Button>
                </div>
            )}

            {/* Actions */}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
};

// Admin Dashboard Stats
export const AdminDashboardStats = () => {
    const stats = [
        {
            title: 'إجمالي المستخدمين',
            value: '12,450',
            change: { value: 12, isPositive: true },
            icon: <UsersIcon className="w-6 h-6" />,
            color: 'primary' as const,
        },
        {
            title: 'الرحلات النشطة',
            value: '892',
            change: { value: 8, isPositive: true },
            icon: <TripIcon className="w-6 h-6" />,
            color: 'success' as const,
        },
        {
            title: 'الإيرادات الشهرية',
            value: '2.4M د.ج',
            change: { value: 15, isPositive: true },
            icon: <CurrencyIcon className="w-6 h-6" />,
            color: 'info' as const,
        },
        {
            title: 'بلاغات معلقة',
            value: '23',
            change: { value: 5, isPositive: false },
            icon: <WarningIcon className="w-6 h-6" />,
            color: 'danger' as const,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

// User Management Table Row
interface UserTableData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'passenger' | 'driver' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    verified: boolean;
    joinedAt: string;
    rating?: number;
}

export const userColumns: Column<UserTableData>[] = [
    {
        key: 'name',
        header: 'المستخدم',
        render: (user) => (
            <div className="flex items-center gap-3">
                <Avatar name={user.name} size="sm" />
                <div>
                    <p className="font-medium text-dark-900">{user.name}</p>
                    <p className="text-xs text-dark-500">{user.email}</p>
                </div>
            </div>
        ),
    },
    {
        key: 'role',
        header: 'الدور',
        render: (user) => (
            <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'driver' ? 'info' : 'gray'}>
                {user.role === 'admin' ? 'مدير' : user.role === 'driver' ? 'سائق' : 'راكب'}
            </Badge>
        ),
    },
    {
        key: 'status',
        header: 'الحالة',
        render: (user) => (
            <StatusBadge status={user.status === 'active' ? 'active' : 'inactive'} />
        ),
    },
    {
        key: 'verified',
        header: 'موثق',
        render: (user) => (
            user.verified ? (
                <span className="text-success-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    نعم
                </span>
            ) : (
                <span className="text-dark-400">لا</span>
            )
        ),
    },
    {
        key: 'rating',
        header: 'التقييم',
        render: (user) => user.rating ? <Rating value={user.rating} size="sm" showValue /> : '-',
    },
    {
        key: 'actions',
        header: '',
        render: () => (
            <button className="p-2 hover:bg-dark-100 rounded-lg">
                <DotsVerticalIcon className="w-5 h-5 text-dark-400" />
            </button>
        ),
    },
];

// Trips Monitoring Table Row
interface TripTableData {
    id: string;
    origin: string;
    destination: string;
    driver: string;
    date: string;
    price: number;
    status: 'active' | 'pending' | 'completed' | 'cancelled';
    seats: number;
}

export const tripColumns: Column<TripTableData>[] = [
    {
        key: 'route',
        header: 'الرحلة',
        render: (trip) => (
            <div>
                <p className="font-medium text-dark-900">{trip.origin} ← {trip.destination}</p>
                <p className="text-xs text-dark-500">{trip.date}</p>
            </div>
        ),
    },
    {
        key: 'driver',
        header: 'السائق',
        render: (trip) => <span className="text-dark-700">{trip.driver}</span>,
    },
    {
        key: 'price',
        header: 'السعر',
        render: (trip) => <span className="font-medium">{trip.price} د.ج</span>,
    },
    {
        key: 'seats',
        header: 'المقاعد',
        render: (trip) => <span>{trip.seats}</span>,
    },
    {
        key: 'status',
        header: 'الحالة',
        render: (trip) => <StatusBadge status={trip.status} />,
    },
    {
        key: 'actions',
        header: '',
        render: () => (
            <button className="p-2 hover:bg-dark-100 rounded-lg">
                <DotsVerticalIcon className="w-5 h-5 text-dark-400" />
            </button>
        ),
    },
];

export default AdminDashboardStats;
