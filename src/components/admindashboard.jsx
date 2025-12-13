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
    const [donationsPerPage] = useState(10); // Number of donations to load per request
    const [hasMore, setHasMore] = useState(true); // True if there are more donations to load
    const [totalDonationsCount, setTotalDonationsCount] = useState(0); // Total count from API

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    // Authentication Check
    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'authenticated') {
            setIsAuthenticated(true);
            // Don't fetch here, let the second useEffect handle it after initial auth
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'fotia2024') {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'authenticated');
            setAuthError('');
            // No need to call fetchDonations here, useEffect will handle it
        } else {
            setAuthError('Incorrect password. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
        setPassword('');
        setDonations([]); // Clear donations on logout
        setCurrentPage(1); // Reset pagination
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
                    // If unauthorized, clear auth and force re-login
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
            setHasMore(data.donations.length === donationsPerPage); // Check if more records are available
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filter, currentPage, donationsPerPage, searchTerm]); // Dependencies for useCallback

    // Effect for initial fetch and when filter/auth/search changes
    useEffect(() => {
        if (isAuthenticated) {
            setCurrentPage(1); // Reset page to 1 when filter/search changes or re-authenticating
            setDonations([]); // Clear previous donations
            setHasMore(true); // Assume there's more data for a fresh fetch
            fetchDonations(false); // Fetch first page, not appending
        }
    }, [filter, isAuthenticated, searchTerm, fetchDonations]); // Added searchTerm as dependency

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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

    // Login Screen
    if (!isAuthenticated) {
        return (
            <>
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

    // Main Dashboard (Loading, Error, and Content)
    return (
        <>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Donation Submissions
                                </h1>
                                <p className="text-gray-600">
                                    Total: <span className="font-semibold text-blue-600">{totalDonationsCount}</span> submissions
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-1/3">
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
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 flex-wrap mb-4">
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setCurrentPage(1); // Reset page on filter change
                                    setDonations([]); // Clear existing donations
                                    setHasMore(true); // Assume there's more for a new filter
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
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
                                One-Time
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
                                Monthly
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
                            <p className="text-gray-500 text-lg">No donations found</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {donations.map((donation) => (
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
                            {hasMore && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                        className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Loading More...' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}