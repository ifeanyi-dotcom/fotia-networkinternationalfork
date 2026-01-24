import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Download, Table, LayoutGrid, Search, ChevronDown, ChevronUp, Lock, ArrowUp } from 'lucide-react';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCount, setDisplayCount] = useState(20);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [expandedCards, setExpandedCards] = useState(new Set());

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

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const parseAmount = (amount) => {
        if (!amount) return 0;
        return parseInt(amount.toString().replace(/,/g, '')) || 0;
    };

    // Stats calculations
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum, d) => sum + parseAmount(d.amount), 0);

    // Filtering logic
    const filteredDonations = donations.filter(donation => {
        if (typeFilter === 'one-time' && donation.donationType !== 'one-time') return false;
        if (typeFilter === 'monthly' && donation.donationType !== 'monthly') return false;

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesName = donation.fullName?.toLowerCase().includes(search);
            const matchesEmail = donation.email?.toLowerCase().includes(search);
            if (!matchesName && !matchesEmail) return false;
        }

        return true;
    });

    const displayedDonations = filteredDonations.slice(0, displayCount);
    const hasMore = displayCount < filteredDonations.length;

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Amount', 'Type', 'Date', 'Prayer Request'];
        const rows = filteredDonations.map(d => [
            d.fullName || '',
            d.email || '',
            d.phone || '',
            d.amount || 0,
            d.donationType || 'one-time',
            new Date(d.createdAt).toLocaleDateString(),
            d.prayerRequest || ''
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleCardExpansion = (id) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

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
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-2xl p-8">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/logo.png"
                                alt="Fotia Network"
                                className="h-12 w-auto"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Partnership Admin Dashboard</h1>
                        <p className="text-center text-gray-500 mb-8">Enter password to access dashboard</p>

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit(e)}
                                    placeholder="Enter admin password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    autoFocus
                                />
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                                )}
                            </div>
                            <button
                                onClick={handlePasswordSubmit}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Unlock Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin mx-auto mb-4 w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <p className="text-gray-600">Loading donations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 py-3 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Fotia Network"
                                className="h-12 w-auto"
                            />
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Admin Portal</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Page Title & Description */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Partner Management Dashboard</h2>
                        <p className="text-xs text-gray-400 mt-3 mb-3">This dashbaord only shows the details of anyone who fills the form.</p>
                        <p className="text-gray-600 mt-1">View and manage all partnership contributions for Fotia Network International.</p>
                    </div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Total Donations</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalDonations}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <DollarSign className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
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

                            {/* Type Filter */}
                            <div className="flex gap-2">
                                {['all', 'one-time', 'monthly'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setTypeFilter(filter)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            typeFilter === filter
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter === 'all' ? 'All' : filter === 'one-time' ? 'One-Time' : 'Monthly'}
                                    </button>
                                ))}
                            </div>

                            {/* View Toggle & Export */}
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('card')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'card' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        <Table size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    <Download size={16} />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-900">{displayedDonations.length}</span> of <span className="font-semibold text-gray-900">{filteredDonations.length}</span> donations
                        </p>
                    </div>

                    {/* Card View */}
                    {viewMode === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayedDonations.map(donation => {
                                const isExpanded = expandedCards.has(donation._id);
                                const hasPrayerRequest = donation.prayerRequest && donation.prayerRequest.trim();

                                return (
                                    <div key={donation._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 min-w-0 mr-2">
                                                <h3 className="font-semibold text-gray-900 truncate">{donation.fullName}</h3>
                                                <p className="text-sm text-gray-500 truncate">{donation.email}</p>
                                                <p className="text-sm text-gray-500">{donation.phone}</p>
                                            </div>
                                            <p className="text-xl font-bold text-green-600 flex-shrink-0">
                                                ₦{parseAmount(donation.amount).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <TypeBadge type={donation.donationType} />
                                            <span className="text-sm text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4">
                                            <button
                                                onClick={() => toggleCardExpansion(donation._id)}
                                                className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
                                            >
                                                <span className="flex items-center gap-2">
                                                    🙏 Prayer Request
                                                    {hasPrayerRequest && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Has request</span>}
                                                </span>
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                            {isExpanded && (
                                                <p className="mt-2 text-sm text-gray-600 italic">
                                                    {hasPrayerRequest ? donation.prayerRequest : 'No prayer request submitted'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Table View */}
                    {viewMode === 'table' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Name</th>
                                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Email</th>
                                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Phone</th>
                                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Amount</th>
                                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Type</th>
                                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {displayedDonations.map(donation => (
                                        <tr key={donation._id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{donation.fullName}</div>
                                                {donation.prayerRequest && (
                                                    <p className="text-xs text-gray-500 mt-1 italic truncate max-w-xs">
                                                        🙏 {donation.prayerRequest}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-600 text-sm">{donation.email}</td>
                                            <td className="p-4 text-gray-600 text-sm">{donation.phone}</td>
                                            <td className="p-4 font-semibold text-green-600 text-sm">
                                                ₦{parseAmount(donation.amount).toLocaleString()}
                                            </td>
                                            <td className="p-4"><TypeBadge type={donation.donationType} /></td>
                                            <td className="p-4 text-gray-500 text-sm">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setDisplayCount(prev => prev + 20)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Load More ({filteredDonations.length - displayCount} remaining)
                            </button>
                        </div>
                    )}

                    {/* No Results */}
                    {filteredDonations.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <p className="text-gray-500">No donations match your filters</p>
                            <button
                                onClick={() => {
                                    setTypeFilter('all');
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

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </button>
            )}

            <footer className="bg-gray-900 text-gray-400 py-6 mt-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">© 2026 Fotiá Network International. All rights reserved.</p>
                    <p className="text-sm mt-6 mb-1">
                        Built by
                        <a href="https://successdanesy.vercel.app" className="text-blue-500 hover:underline">
                            {" "}&lt; Success Danesy /&gt;
                        </a>
                    </p>

                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;