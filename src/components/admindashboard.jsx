import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import {Users, DollarSign, TrendingUp, Calendar, Mail, RefreshCw, Check, X, Clock, Download, Table, LayoutGrid, Filter, ChevronDown} from 'lucide-react';

const AdminDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'one-time', 'monthly'
    const [emailFilter, setEmailFilter] = useState('all'); // 'all', 'sent', 'failed'
    const [resendingId, setResendingId] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch('/api/donations');
            const data = await response.json();
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stats calculations
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const monthlyDonors = donations.filter(d => d.donationType === 'monthly').length;
    const emailsSent = donations.filter(d => d.emailSent === true).length;
    const emailSuccessRate = totalDonations > 0
        ? Math.round((emailsSent / totalDonations) * 100)
        : 0;

    // Filtering logic
    const filteredDonations = donations.filter(donation => {
        // Type filter
        if (typeFilter === 'one-time' && donation.donationType !== 'one-time') return false;
        if (typeFilter === 'monthly' && donation.donationType !== 'monthly') return false;

        // Email filter
        if (emailFilter === 'sent' && donation.emailSent !== true) return false;
        if (emailFilter === 'failed' && donation.emailSent === true) return false;

        return true;
    });

    // Resend email handler
    const handleResendEmail = async (donationId) => {
        setResendingId(donationId);
        try {
            const response = await fetch('/api/resend-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ donationId }),
            });

            const result = await response.json();

            if (result.success) {
                // Update local state
                setDonations(prev => prev.map(d =>
                    d._id === donationId
                        ? { ...d, emailSent: true, emailSentAt: new Date().toISOString() }
                        : d
                ));
                alert('Email sent successfully!');
            } else {
                alert('Failed to send email: ' + result.error);
            }
        } catch (error) {
            console.error('Error resending email:', error);
            alert('Error resending email');
        } finally {
            setResendingId(null);
        }
    };

    // CSV Export
    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Amount', 'Type', 'Date', 'Email Status', 'Email Sent Date'];
        const rows = filteredDonations.map(d => [
            d.name || '',
            d.email || '',
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
            const date = emailSentAt ? new Date(emailSentAt).toLocaleDateString() : 'N/A';
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check size={12} />
          Sent {date}
        </span>
            );
        }
        if (emailSent === false) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X size={12} />
          Failed
        </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <Clock size={12} />
        Pending
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
      {type === 'monthly' ? 'Monthly Partner' : 'One-Time'}
    </span>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Header />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage donations and email communications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {/* Total Donations */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Donations</p>
                                <p className="text-2xl font-bold text-gray-900">{totalDonations}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Monthly Donors */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Monthly Partners</p>
                                <p className="text-2xl font-bold text-gray-900">{monthlyDonors}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Calendar className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* This Month */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {donations.filter(d => {
                                        const donationDate = new Date(d.createdAt);
                                        const now = new Date();
                                        return donationDate.getMonth() === now.getMonth() &&
                                            donationDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <TrendingUp className="text-indigo-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Emails Sent - NEW */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Emails Sent</p>
                                <p className="text-2xl font-bold text-gray-900">{emailsSent}</p>
                                <p className="text-xs text-gray-400 mt-1">{emailSuccessRate}% success rate</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Mail className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Controls */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Type Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-500">Type:</span>
                            <div className="flex gap-1">
                                {['all', 'one-time', 'monthly'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setTypeFilter(filter)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
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
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-500">Email:</span>
                            <div className="flex gap-1">
                                {['all', 'sent', 'failed'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setEmailFilter(filter)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
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
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'card' ? 'bg-gray-200' : 'hover:bg-gray-100'
                                }`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'table' ? 'bg-gray-200' : 'hover:bg-gray-100'
                                }`}
                            >
                                <Table size={18} />
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download size={16} />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-gray-500 mb-4">
                    Showing {filteredDonations.length} of {totalDonations} donations
                </p>

                {/* Card View */}
                {viewMode === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDonations.map(donation => (
                            <div key={donation._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{donation.name}</h3>
                                        <p className="text-sm text-gray-500">{donation.email}</p>
                                    </div>
                                    <p className="text-xl font-bold text-green-600">${donation.amount}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <TypeBadge type={donation.donationType} />
                                    <EmailStatusBadge emailSent={donation.emailSent} emailSentAt={donation.emailSentAt} />
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{new Date(donation.createdAt).toLocaleDateString()}</span>

                                    {donation.emailSent !== true && (
                                        <button
                                            onClick={() => handleResendEmail(donation._id)}
                                            disabled={resendingId === donation._id}
                                            className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw size={14} className={resendingId === donation._id ? 'animate-spin' : ''} />
                                            Resend
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-600">Name</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Email</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Type</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Date</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Email Status</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredDonations.map(donation => (
                                    <tr key={donation._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{donation.name}</td>
                                        <td className="p-4 text-gray-600">{donation.email}</td>
                                        <td className="p-4 font-semibold text-green-600">${donation.amount}</td>
                                        <td className="p-4"><TypeBadge type={donation.donationType} /></td>
                                        <td className="p-4 text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <EmailStatusBadge emailSent={donation.emailSent} emailSentAt={donation.emailSentAt} />
                                        </td>
                                        <td className="p-4">
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
                    <div className="text-center py-12 text-gray-500">
                        No donations match your filters
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
