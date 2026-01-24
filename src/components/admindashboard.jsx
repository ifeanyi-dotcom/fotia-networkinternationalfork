import { useState, useEffect } from 'react';
import {Users, DollarSign, TrendingUp, Calendar, Mail, RefreshCw, Check, X, Clock, Download, Table, LayoutGrid, Filter, Search, ChevronDown, Lock} from 'lucide-react';
import Toast from './Toast';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card');
    const [typeFilter, setTypeFilter] = useState('all');
    const [emailFilter, setEmailFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [resendingId, setResendingId] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setPasswordError('');
            setPassword('');
            fetchDonations();
        } else {
            setPasswordError('Incorrect password');
            setPassword('');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchDonations();
        }
    }, [isAuthenticated]);

    const fetchDonations = async () => {
        try {
            const username = 'admin';
            const password = import.meta.env.VITE_ADMIN_PASSWORD;
            const credentials = btoa(`${username}:${password}`);

            const response = await fetch('/api/get-donations', {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDonations(data.donations || []);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setDonations([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to parse amount
    const parseAmount = (amount) => {
        if (!amount) return 0;
        return parseInt(amount.toString().replace(/,/g, '')) || 0;
    };

    // Stats calculations
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum, d) => sum + parseAmount(d.amount), 0);
    const monthlyDonors = donations.filter(d => d.donationType === 'monthly').length;
    const emailsSent = donations.filter(d => d.emailSent === true).length;
    const emailSuccessRate = totalDonations > 0
        ? Math.round((emailsSent / totalDonations) * 100)
        : 0;
    const thisMonthDonations = donations.filter(d => {
        const donationDate = new Date(d.createdAt);
        const now = new Date();
        return donationDate.getMonth() === now.getMonth() &&
            donationDate.getFullYear() === now.getFullYear();
    }).length;

    // Filtering logic
    const filteredDonations = donations.filter(donation => {
        if (typeFilter === 'one-time' && donation.donationType !== 'one-time') return false;
        if (typeFilter === 'monthly' && donation.donationType !== 'monthly') return false;

        if (emailFilter === 'sent' && donation.emailSent !== true) return false;
        if (emailFilter === 'failed' && donation.emailSent === true) return false;

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesName = donation.fullName?.toLowerCase().includes(search);
            const matchesEmail = donation.email?.toLowerCase().includes(search);
            if (!matchesName && !matchesEmail) return false;
        }

        return true;
    });

    // Resend email handler
    const handleResendEmail = async (donationId) => {
        setResendingId(donationId);
        try {
            const donation = donations.find(d => d._id === donationId);
            const response = await fetch('/api/resend-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ donationId }),
            });

            const result = await response.json();

            if (result.success) {
                setDonations(prev => prev.map(d =>
                    d._id === donationId
                        ? { ...d, emailSent: true, emailSentAt: new Date().toISOString() }
                        : d
                ));
                setToast({
                    show: true,
                    message: `Email sent to ${donation?.email}`,
                    type: 'success'
                });
            } else {
                setToast({
                    show: true,
                    message: 'Failed to send email',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error resending email:', error);
            setToast({
                show: true,
                message: 'Error resending email',
                type: 'error'
            });
        } finally {
            setResendingId(null);
        }
    };

    // CSV Export
    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Amount', 'Type', 'Date', 'Email Status', 'Email Sent Date'];
        const rows = filteredDonations.map(d => [
            d.fullName || '',
            d.email || '',
            d.phone || '',
            d.amount || 0,
            d.donationType || 'one-time',
            new Date(d.createdAt).toLocaleDateString(),
            d.emailSent ? 'Sent' : 'Pending/Failed',
            d.emailSentAt ? new Date(d.emailSentAt).toLocaleDateString() : ''
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Email status badge component
    const EmailStatusBadge = ({ emailSent, emailSentAt }) => {
        if (emailSent === true) {
            const date = emailSentAt ? new Date(emailSentAt).toLocaleDateString() : '';
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check size={12} />
                    <span className="hidden sm:inline">Sent</span>
                    {date && <span className="hidden md:inline text-green-600">• {date}</span>}
                </span>
            );
        }
        if (emailSent === false) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X size={12} />
                    <span className="hidden sm:inline">Failed</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <Clock size={12} />
                <span className="hidden sm:inline">Pending</span>
            </span>
        );
    };

    // Donation type badge
    const TypeBadge = ({ type }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            type === 'monthly'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
        }`}>
            {type === 'monthly' ? 'Monthly' : 'One-Time'}
        </span>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                />
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-2xl p-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                <Lock className="text-orange-600" size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Access</h1>
                        <p className="text-center text-gray-500 mb-8">Enter password to access dashboard</p>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    placeholder="Enter admin password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    autoFocus
                                />
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Unlock Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={40} />
                    <p className="text-gray-600">Loading donations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/src/assets/logo.png" alt="Fotiá Network" className="h-10 w-auto" />
                        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                </div>
            </header>
            <div className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage donations and email communications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {/* Total Donations */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Total</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalDonations}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg self-start sm:self-auto">
                                <Users className="text-blue-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Amount</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-green-100 rounded-lg self-start sm:self-auto">
                                <DollarSign className="text-green-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Monthly Donors */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Monthly</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{monthlyDonors}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-orange-100 rounded-lg self-start sm:self-auto">
                                <Calendar className="text-orange-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* This Month */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">This Month</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{thisMonthDonations}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg self-start sm:self-auto">
                                <TrendingUp className="text-indigo-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Emails Sent */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 col-span-2 lg:col-span-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Emails</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{emailsSent}</p>
                                <p className="text-xs text-gray-400 mt-1">{emailSuccessRate}% success</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg self-start sm:self-auto">
                                <Mail className="text-purple-600" size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters Section */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 mb-4 sm:mb-6 border border-gray-100">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg mb-4"
                    >
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Filter size={16} />
                            Filters
                        </span>
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filters */}
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:flex flex-col lg:flex-row lg:items-center gap-4`}>
                        {/* Type Filter */}
                        <div className="flex-1">
                            <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Donation Type</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'one-time', 'monthly'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setTypeFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                            typeFilter === filter
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter === 'all' ? 'All' : filter === 'one-time' ? 'One-Time' : 'Monthly'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Email Filter */}
                        <div className="flex-1">
                            <label className="text-xs sm:text-sm text-gray-500 mb-2 block">Email Status</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'sent', 'failed'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setEmailFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                            emailFilter === filter
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter === 'all' ? 'All' : filter === 'sent' ? 'Sent' : 'Pending/Failed'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* View Mode & Export */}
                        <div className="flex items-center gap-2 lg:ml-auto">
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'card' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                    }`}
                                    title="Card view"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                    }`}
                                    title="Table view"
                                >
                                    <Table size={18} />
                                </button>
                            </div>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{filteredDonations.length}</span> of <span className="font-semibold text-gray-900">{totalDonations}</span> donations
                    </p>
                </div>

                {/* Card View */}
                {viewMode === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDonations.map(donation => (
                            <div key={donation._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{donation.fullName}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{donation.email}</p>
                                    </div>
                                    <p className="text-lg sm:text-xl font-bold text-green-600 flex-shrink-0">
                                        ₦{parseAmount(donation.amount).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                                    <TypeBadge type={donation.donationType} />
                                    <EmailStatusBadge emailSent={donation.emailSent} emailSentAt={donation.emailSentAt} />
                                </div>

                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</span>

                                    {donation.emailSent !== true && (
                                        <button
                                            onClick={() => handleResendEmail(donation._id)}
                                            disabled={resendingId === donation._id}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
                                        >
                                            <RefreshCw size={14} className={resendingId === donation._id ? 'animate-spin' : ''} />
                                            <span>Resend</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm">Name</th>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm hidden md:table-cell">Email</th>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm">Amount</th>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm">Type</th>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm hidden lg:table-cell">Date</th>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm">Status</th>
                                    <th className="text-left p-3 sm:p-4 font-medium text-gray-600 text-xs sm:text-sm">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredDonations.map(donation => (
                                    <tr key={donation._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="p-3 sm:p-4">
                                            <div className="font-medium text-gray-900 text-sm">{donation.fullName}</div>
                                            <div className="text-xs text-gray-500 md:hidden">{donation.email}</div>
                                        </td>
                                        <td className="p-3 sm:p-4 text-gray-600 text-sm hidden md:table-cell">{donation.email}</td>
                                        <td className="p-3 sm:p-4 font-semibold text-green-600 text-sm">
                                            ₦{parseAmount(donation.amount).toLocaleString()}
                                        </td>
                                        <td className="p-3 sm:p-4"><TypeBadge type={donation.donationType} /></td>
                                        <td className="p-3 sm:p-4 text-gray-500 text-sm hidden lg:table-cell">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 sm:p-4">
                                            <EmailStatusBadge emailSent={donation.emailSent} emailSentAt={donation.emailSentAt} />
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            {donation.emailSent !== true && (
                                                <button
                                                    onClick={() => handleResendEmail(donation._id)}
                                                    disabled={resendingId === donation._id}
                                                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Resend email"
                                                >
                                                    <RefreshCw size={16} className={resendingId === donation._id ? 'animate-spin' : ''} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {filteredDonations.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm sm:text-base">No donations match your filters</p>
                        <button
                            onClick={() => {
                                setTypeFilter('all');
                                setEmailFilter('all');
                                setSearchTerm('');
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
            </div>
            <footer className="bg-gray-900 text-gray-400 py-6 mt-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">© 2026 Fotiá Network International. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;