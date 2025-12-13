import { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function AdminDonations() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [donationsPerPage] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [totalDonationsCount, setTotalDonationsCount] = useState(0);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    // Sort state
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

    // View mode state
    const [viewMode, setViewMode] = useState('card'); // card or table

    // Authentication Check
    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'authenticated') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'fotia2024') {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'authenticated');
            setAuthError('');
        } else {
            setAuthError('Incorrect password. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
        setPassword('');
        setDonations([]);
        setCurrentPage(1);
        setHasMore(true);
        setTotalDonationsCount(0);
        setError(null);
    };

    const fetchDonations = useCallback(async (append = false) => {
        setLoading(true);
        setError(null);

        try {
            const url = new URL(`${window.location.origin}/api/get-donations`);
            if (filter !== 'all') {
                url.searchParams.append('donationType', filter);
            }
            if (searchTerm) {
                url.searchParams.append('search', searchTerm);
            }
            url.searchParams.append('page', currentPage);
            url.searchParams.append('limit', donationsPerPage);

            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': 'Basic ' + btoa('admin:fotia2024')
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    throw new Error('Authentication expired or invalid. Please log in again.');
                }
                throw new Error('Failed to fetch donations');
            }

            const data = await response.json();

            if (append) {
                setDonations((prevDonations) => [...prevDonations, ...data.donations]);
            } else {
                setDonations(data.donations);
            }
            setTotalDonationsCount(data.totalDonations);
            setHasMore(data.donations.length === donationsPerPage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filter, currentPage, donationsPerPage, searchTerm]);

    useEffect(() => {
        if (isAuthenticated) {
            setCurrentPage(1);
            setDonations([]);
            setHasMore(true);
            fetchDonations(false);
        }
    }, [filter, isAuthenticated, searchTerm, fetchDonations]);

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Sort donations
    const sortedDonations = [...donations].sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'date-asc':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'amount-desc':
                return (parseFloat(b.amount?.replace(/,/g, '') || 0)) - (parseFloat(a.amount?.replace(/,/g, '') || 0));
            case 'amount-asc':
                return (parseFloat(a.amount?.replace(/,/g, '') || 0)) - (parseFloat(b.amount?.replace(/,/g, '') || 0));
            default:
                return 0;
        }
    });

    // Calculate statistics
    const stats = {
        total: totalDonationsCount,
        oneTime: filter === 'one-time' ? totalDonationsCount : donations.filter(d => d.donationType === 'one-time').length,
        monthly: filter === 'monthly' ? totalDonationsCount : donations.filter(d => d.donationType === 'monthly').length,
        totalAmount: donations.reduce((sum, d) => sum + (parseFloat(d.amount?.replace(/,/g, '') || 0)), 0)
    };

    // Download as CSV
    const downloadCSV = () => {
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Type', 'Amount', 'Prayer Request'];
        const csvContent = [
            headers.join(','),
            ...sortedDonations.map(d => {
                const date = new Date(d.createdAt);
                const formattedDate = `"${date.toLocaleDateString()} ${date.toLocaleTimeString()}"`;
                return [
                    formattedDate,
                    `"${d.fullName}"`,
                    d.email,
                    d.phone,
                    d.donationType,
                    `"${d.amount || ''}"`,
                    `"${(d.prayerRequest || '').replace(/"/g, '""')}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fotia-donations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Login Screen with reduced spacing
    if (!isAuthenticated) {
        return (
            <>
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center py-8 px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-6">
                                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h2>
                                <p className="text-gray-600">Enter password to view donations</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setAuthError('');
                                        }}
                                        placeholder="Enter admin password"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                        required
                                    />
                                    {authError && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {authError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                                >
                                    Access Dashboard
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Main Dashboard
    return (
        <>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-gray-500 mb-1">Total Submissions</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg shadow p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-blue-600 mb-1">One-Time Gifts</p>
                            <p className="text-xl lg:text-2xl font-bold text-blue-900">{stats.oneTime}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-yellow-600 mb-1">Monthly Partners</p>
                            <p className="text-xl lg:text-2xl font-bold text-yellow-900">{stats.monthly}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-green-600 mb-1 truncate">Total Amount</p>
                            <p className="text-lg lg:text-2xl font-bold text-green-900 truncate">₦{stats.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Donation Submissions
                            </h1>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={downloadCSV}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export CSV
                                </button>

                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('card')}
                                        className={`px-3 py-1 rounded transition-colors ${
                                            viewMode === 'card'
                                                ? 'bg-white text-blue-600 shadow'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-3 py-1 rounded transition-colors ${
                                            viewMode === 'table'
                                                ? 'bg-white text-blue-600 shadow'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Highest Amount</option>
                                <option value="amount-asc">Lowest Amount</option>
                            </select>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 flex-wrap mt-4">
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setCurrentPage(1);
                                    setDonations([]);
                                    setHasMore(true);
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All ({stats.total})
                            </button>
                            <button
                                onClick={() => {
                                    setFilter('one-time');
                                    setCurrentPage(1);
                                    setDonations([]);
                                    setHasMore(true);
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === 'one-time'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                One-Time ({stats.oneTime})
                            </button>
                            <button
                                onClick={() => {
                                    setFilter('monthly');
                                    setCurrentPage(1);
                                    setDonations([]);
                                    setHasMore(true);
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === 'monthly'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Monthly ({stats.monthly})
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mb-4">
                            <p className="text-red-800 font-semibold mb-2">Error loading donations</p>
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {(loading && donations.length === 0) ? (
                        <div className="min-h-48 bg-white flex items-center justify-center rounded-lg shadow-lg">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading donations...</p>
                            </div>
                        </div>
                    ) : donations.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-500 text-lg">No donations found</p>
                        </div>
                    ) : viewMode === 'card' ? (
                        // Card View
                        <div className="grid gap-4">
                            {sortedDonations.map((donation) => (
                                <div
                                    key={donation._id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        donation.donationType === 'monthly'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}
                                                >
                                                    {donation.donationType === 'monthly' ? 'Monthly Partner' : 'One-Time Gift'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(donation.createdAt)}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {donation.fullName}
                                            </h3>

                                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="text-gray-900">{donation.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="text-gray-900">{donation.phone}</p>
                                                </div>
                                            </div>

                                            {donation.amount && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500">Amount</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        ₦{donation.amount}
                                                    </p>
                                                </div>
                                            )}

                                            {donation.prayerRequest && (
                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                                    <p className="text-sm font-semibold text-blue-900 mb-1">
                                                        Prayer Request:
                                                    </p>
                                                    <p className="text-blue-800">{donation.prayerRequest}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Table View
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prayer</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {sortedDonations.map((donation) => (
                                        <tr key={donation._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{donation.fullName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{donation.email}</div>
                                                <div className="text-sm text-gray-500">{donation.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        donation.donationType === 'monthly'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {donation.donationType === 'monthly' ? 'Monthly' : 'One-Time'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                {donation.amount ? `₦${donation.amount}` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {donation.prayerRequest ? (
                                                    <div className="text-sm text-gray-600 max-w-xs truncate" title={donation.prayerRequest}>
                                                        {donation.prayerRequest}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {hasMore && donations.length > 0 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Load More
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}