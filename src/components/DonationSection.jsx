import React, { useState } from 'react';
import Toast from './Toast';

// =================================================================================
// IMPORTANT: Replace these placeholder URLs with your actual Paystack Payment Links.
// You can create these in your Paystack Dashboard under "Payment Pages".
// =================================================================================
const paystackLinks = {
    oneTime: 'https://paystack.shop/pay/fotiacrusade', // Example for one-time donations
    monthly: {
        10000: 'https://paystack.shop/pay/10fotiamonthly', // Example for ₦10,000/month
        20000: 'https://paystack.shop/pay/20fotiamonthly', // Example for ₦20,000/month
        50000: 'https://paystack.shop/pay/50fotiamonthly', // Example for ₦50,000/month
        100000: 'https://paystack.shop/pay/100fotiamonthly', // Example for ₦100,000/month
        custom: 'https://paystack.shop/pay/fotiamonthly', // A link where users can enter their own amount
    }
};


const DonationSection = () => {
    const [donationType, setDonationType] = useState('one-time');
    const [copiedBank, setCopiedBank] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const bankAccountNumber = import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '1834897295';

    const copyBankDetails = () => {
        navigator.clipboard.writeText(bankAccountNumber);
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
    };

    const monthlyAmountOptions = [
        { value: '10000', label: '₦10,000' },
        { value: '20000', label: '₦20,000' },
        { value: '50000', label: '₦50,000' },
        { value: '100000', label: '₦100,000' },
        { value: 'custom', label: 'Custom Amount' }
    ];

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <section className="py-15 bg-gray-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Give a Gift to Fotia Network International
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Support our mission through a one-time gift or become a monthly partner. Every contribution makes a difference.
                        </p>
                    </div>

                    <div className="bg-white p-4">
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
                                        donationType === 'one-time' ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${donationType === 'one-time' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className={`font-bold text-base mb-1 ${donationType === 'one-time' ? 'text-blue-900' : 'text-gray-700'}`}>
                                        One-Time Gift
                                    </h4>
                                    <p className={`text-xs ${donationType === 'one-time' ? 'text-blue-700' : 'text-gray-500'}`}>
                                        Make an instant impact
                                    </p>
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
                                        donationType === 'monthly' ? 'bg-yellow-500' : 'bg-gray-200'
                                    }`}>
                                        <svg className={`w-6 h-6 ${donationType === 'monthly' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h4 className={`font-bold text-base mb-1 ${donationType === 'monthly' ? 'text-yellow-900' : 'text-gray-700'}`}>
                                        Monthly Partner
                                    </h4>
                                    <p className={`text-xs ${donationType === 'monthly' ? 'text-yellow-700' : 'text-gray-500'}`}>
                                        Sustain the mission
                                    </p>
                                </div>
                            </button>
                        </div>

                        {donationType === 'one-time' ? (
                            // One-Time Gift Options
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Choose Your Giving Method</h3>

                                {/* Paystack Option */}
                                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl text-center">
                                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Online via Card</h4>
                                    <p className="text-sm text-blue-800 mb-4">
                                        Use our secure Paystack page for an instant one-time gift.
                                    </p>
                                    <a
                                        href={paystackLinks.oneTime}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
                                    >
                                        Give Securely via Paystack →
                                    </a>
                                </div>

                                {/* Bank Transfer Option */}
                                <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
                                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Direct Bank Transfer</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Transfer directly to our ministry account below.
                                    </p>
                                    <div className="space-y-3 text-left max-w-sm mx-auto">
                                        <div className="bg-white p-3 rounded-lg border border-gray-300">
                                            <p className="text-xs text-gray-600">Bank:</p>
                                            <p className="font-bold text-gray-900">Access Bank</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-300 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-600">Account Number:</p>
                                                <p className="font-bold text-gray-900 font-mono text-base">{bankAccountNumber}</p>
                                            </div>
                                            <button
                                                onClick={copyBankDetails}
                                                className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-50 transition-colors"
                                            >
                                                {copiedBank ? '✓ Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-300">
                                            <p className="text-xs text-gray-600">Account Name:</p>
                                            <p className="font-bold text-gray-900">Fotia Network Ministries</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 max-w-sm mx-auto">
                                        <p className="text-sm text-blue-900 text-left">
                                            <strong>Important:</strong> After transferring, please <a href="/donation-successful" className="font-bold underline">fill our contact form</a> so we can thank you personally!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Monthly Partner Options
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Become a Monthly Partner</h3>
                                <p className="text-gray-600 mb-6">
                                    Select your monthly partnership level below. You will be redirected to Paystack to complete your secure recurring payment.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {monthlyAmountOptions.map((option) => (
                                        <a
                                            key={option.value}
                                            href={paystackLinks.monthly[option.value]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-6 bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-400 rounded-xl hover:shadow-lg hover:border-yellow-500 transition-all"
                                        >
                                            <h4 className="font-bold text-lg text-yellow-900">{option.label}</h4>
                                            <p className="text-xs text-yellow-800">per month</p>
                                        </a>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-6">
                                    By clicking a link, you'll be taken to Paystack to set up a secure, recurring monthly donation. You can manage or cancel it anytime.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default DonationSection;