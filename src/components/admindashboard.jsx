import { useState, useEffect } from 'react';

export default function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, [filter]);

    const fetchDonations = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = filter === 'all'
                ? '/api/get-donations'
                : `/api/get-donations?donationType=${filter}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Basic ' + btoa('admin:fotia2024')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch donations');
            }

            const data = await response.json();
            setDonations(data.donations);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading donations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-800 font-semibold mb-2">Error loading donations</p>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Donation Submissions
                            </h1>
                            <p className="text-gray-600">
                                Total: <span className="font-semibold text-blue-600">{donations.length}</span> submissions
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('one-time')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === 'one-time'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                One-Time
                            </button>
                            <button
                                onClick={() => setFilter('monthly')}
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
                </div>

                {donations.length === 0 ? (
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
                    </div>
                )}
            </div>
        </div>
    );
}