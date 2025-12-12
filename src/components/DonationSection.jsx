import React, { useState } from 'react';

const DonationSection = () => {
    const [donationType, setDonationType] = useState('one-time');
    const [selectedAmount, setSelectedAmount] = useState('');

    const amountButtons = [
        { label: '₦10,000', value: '10000' },
        { label: '₦25,000', value: '25000' },
        { label: '₦50,000', value: '50000' },
        { label: 'Custom', value: 'custom' }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Give a gift to Fotia Network International
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose an amount, select one-time or monthly, and complete your secure card or bank transfer gift in seconds.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                    {/* Left Column: Donation Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        {/* Secure indicators */}
                        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Secure, encrypted processing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>Receipts emailed instantly</span>
                            </div>
                        </div>

                        {/* One-time vs Monthly Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                            <button
                                onClick={() => setDonationType('one-time')}
                                className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                                    donationType === 'one-time'
                                        ? 'bg-white text-gray-900 shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                One-Time
                            </button>
                            <button
                                onClick={() => setDonationType('monthly')}
                                className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                                    donationType === 'monthly'
                                        ? 'bg-white text-gray-900 shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Monthly Pledge
                            </button>
                        </div>

                        {/* Amount Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Amount</label>
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {amountButtons.map(amount => (
                                    <button
                                        key={amount.value}
                                        onClick={() => setSelectedAmount(amount.value)}
                                        className={`py-3 px-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                                            selectedAmount === amount.value
                                                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {amount.label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
                                <input
                                    type="text"
                                    className="w-full pl-8 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                    placeholder="50,000"
                                />
                            </div>
                        </div>

                        {/* Monthly Options */}
                        {donationType === 'monthly' && (
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Preferred debit day <span className="text-gray-400 font-normal">For monthly pledges</span>
                                </label>
                                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none bg-white">
                                    <option>26th of each month</option>
                                    <option>1st of each month</option>
                                    <option>15th of each month</option>
                                </select>
                            </div>
                        )}

                        {/* Country Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none bg-white">
                                <option>Nigeria</option>
                                <option>United States</option>
                                <option>United Kingdom</option>
                                <option>Canada</option>
                            </select>
                        </div>

                        {/* Card Details */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Card details</label>
                                <input
                                    type="text"
                                    placeholder="Full name as shown on card"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Card number"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-medium">We accept:</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                    <div className="w-10 h-7 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                                    <div className="w-10 h-7 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">VRV</div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl">
                            Give Now
                        </button>

                        {/* Note about receipts */}
                        <p className="text-xs text-gray-500 text-center mt-4">
                            You'll receive an email receipt after each successful donation.
                        </p>

                        {/* Bank Transfer Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="text-center mb-4">
                                <span className="text-sm font-semibold text-gray-700">Prefer Bank Transfer?</span>
                                <p className="text-xs text-gray-500 mt-1">Use the details below and tell us once done</p>
                            </div>
                            <div className="space-y-3">

                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div>
                                        <p className="font-bold text-gray-900">Access Bank • NGN</p>
                                        <p className="text-gray-600 font-mono">1834897295</p>
                                        <p className="text-xs text-gray-500">Fotia Network Ministries</p>
                                    </div>
                                    <button className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors">
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Personal Details */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Share your details with us</h3>
                        <p className="text-gray-600 mb-6">
                            Help us track your giving, send receipts, and keep you updated on what your giving is doing.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email address <span className="text-gray-400 font-normal">For receipts and updates</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone / WhatsApp</label>
                                <input
                                    type="tel"
                                    placeholder="Include country code (e.g. +234...)"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Best way to reach you</label>
                                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none bg-white">
                                    <option value="">Select preference</option>
                                    <option>Email</option>
                                    <option>WhatsApp</option>
                                    <option>Phone call</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prayer request (optional)
                                </label>
                                <textarea
                                    placeholder="Share how we can agree with you in prayer"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="bank-transfer-check"
                                    className="mt-1 w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                                />
                                <label htmlFor="bank-transfer-check" className="text-sm text-gray-600 leading-tight">
                                    I have given or will give by bank transfer. Please reconcile my gift and send me a receipt.
                                </label>
                            </div>
                        </div>

                        {/* Info box */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> You can submit this form before or after you complete the pledge. Our team will follow up with you personally.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DonationSection;