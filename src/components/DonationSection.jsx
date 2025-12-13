import React, { useState } from 'react';

const DonationSection = () => {
    const [donationType, setDonationType] = useState('one-time');
    const [copiedBank, setCopiedBank] = useState(false);

    const copyBankDetails = () => {
        navigator.clipboard.writeText('1834897295');
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Give a Gift to Fotia Network International
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Support our mission through a one-time gift or become a monthly partner. Every contribution makes a difference.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                    {/* Left Column: Giving Options */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        {/* One-time vs Monthly Toggle */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setDonationType('one-time')}
                                className={`relative py-6 px-4 rounded-xl border-2 transition-all ${
                                    donationType === 'one-time'
                                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 shadow-lg'
                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                            >
                                {donationType === 'one-time' && (
                                    <div className="absolute top-3 right-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                        donationType === 'one-time'
                                            ? 'bg-blue-500'
                                            : 'bg-gray-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${donationType === 'one-time' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className={`font-bold text-base mb-1 ${
                                        donationType === 'one-time' ? 'text-blue-900' : 'text-gray-700'
                                    }`}>One-Time Gift</h4>
                                    <p className={`text-xs ${
                                        donationType === 'one-time' ? 'text-blue-700' : 'text-gray-500'
                                    }`}>Make an instant impact</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setDonationType('monthly')}
                                className={`relative py-6 px-4 rounded-xl border-2 transition-all ${
                                    donationType === 'monthly'
                                        ? 'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-500 shadow-lg'
                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                            >
                                {donationType === 'monthly' && (
                                    <div className="absolute top-3 right-3">
                                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                        donationType === 'monthly'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${donationType === 'monthly' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h4 className={`font-bold text-base mb-1 ${
                                        donationType === 'monthly' ? 'text-yellow-900' : 'text-gray-700'
                                    }`}>Monthly Partner</h4>
                                    <p className={`text-xs ${
                                        donationType === 'monthly' ? 'text-yellow-700' : 'text-gray-500'
                                    }`}>Sustain the mission</p>
                                </div>
                            </button>
                        </div>

                        {donationType === 'one-time' ? (
                            // One-Time Gift Options
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Your Giving Method</h3>

                                {/* Paystack Option */}
                                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-blue-500 rounded-lg p-3 flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Card Payment (Paystack)</h4>
                                            <p className="text-sm text-blue-700">Instant & Secure</p>
                                        </div>
                                    </div>
                                    <a
                                        href="YOUR_PAYSTACK_LINK_HERE"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all text-center"
                                    >
                                        Give via Paystack →
                                    </a>
                                    <p className="text-xs text-blue-700 mt-2 text-center">
                                        You'll be redirected to our secure Paystack page
                                    </p>
                                </div>

                                {/* Bank Transfer Option */}
                                <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-gray-700 rounded-lg p-3 flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Bank Transfer</h4>
                                            <p className="text-sm text-gray-600">Direct to our account</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-4">
                                        <div className="bg-white p-4 rounded-lg border border-gray-300">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-600">Bank Name</p>
                                                    <p className="font-bold text-gray-900">Access Bank</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-gray-300">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-600">Account Number</p>
                                                    <p className="font-bold text-gray-900 font-mono text-lg">1834897295</p>
                                                </div>
                                                <button
                                                    onClick={copyBankDetails}
                                                    className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors"
                                                >
                                                    {copiedBank ? '✓ Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-gray-300">
                                            <div>
                                                <p className="text-sm text-gray-600">Account Name</p>
                                                <p className="font-bold text-gray-900">Fotia Network Ministries</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-sm text-blue-900">
                                            <strong>After transferring,</strong> please fill the form on the right so we can send you a receipt and thank you personally.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Monthly Partner Information
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Become a Monthly Partner</h3>
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-4 sm:p-6 mb-6">
                                    {/* Header Section */}
                                    <div className="text-center mb-4">
                                        <div className="inline-flex bg-yellow-500 rounded-lg p-3 mb-3">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Join Our Revival Partners</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Your consistent monthly support fuels ongoing crusades, prayer meetings, and outreaches.
                                            Partner with us to see nations transformed!
                                        </p>
                                    </div>

                                    {/* Benefits List */}
                                    <ul className="space-y-2.5">
                                        <li className="flex items-start gap-3 text-gray-700 text-sm">
                                            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Monthly updates on ministry impact</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 text-sm">
                                            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Prayer points and testimonies</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 text-sm">
                                            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Personal connection with our team</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                    <p className="text-gray-700 mb-4">
                                        To set up a monthly partnership, please fill out the form on the right with your preferred giving amount.
                                        Our team will contact you to arrange the details.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Secure & flexible - adjust or cancel anytime</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Let Us Connect With You</h3>
                        <p className="text-gray-600 mb-6">
                            {donationType === 'one-time'
                                ? "Share your details so we can send you a receipt and thank you personally."
                                : "Tell us about your partnership commitment and we'll reach out to set everything up."
                            }
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email address *
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone / WhatsApp *</label>
                                <input
                                    type="tel"
                                    placeholder="+234..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {donationType === 'monthly' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Monthly commitment amount *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
                                        <input
                                            type="text"
                                            placeholder="e.g., 10,000"
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter the amount you'd like to give monthly</p>
                                </div>
                            )}

                            {donationType === 'one-time' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Amount given (optional)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
                                        <input
                                            type="text"
                                            placeholder="e.g., 50,000"
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Helps us track and acknowledge your gift</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prayer request (optional)
                                </label>
                                <textarea
                                    placeholder="Share how we can pray for you"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl">
                                Submit Details
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                {donationType === 'one-time'
                                    ? "We'll send you a receipt and thank you message within 24 hours."
                                    : "Our team will contact you within 24 hours to finalize your partnership."
                                }
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DonationSection;