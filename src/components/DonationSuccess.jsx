import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Toast from './Toast';
import Header from './Header';
import Footer from './Footer';

const DonationSuccess = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        amount: '',
        prayerRequest: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Extract payment details from URL
    const paymentReference = searchParams.get('reference') || searchParams.get('trxref');
    const urlAmount = searchParams.get('amount'); // This will be in the smallest unit (kobo)
    const donationType = searchParams.get('type') || (window.location.pathname.includes('monthly') ? 'monthly' : 'one-time');

    // Helper function to sanitize amount (remove all non-numeric characters)
    const sanitizeAmount = (value) => {
        return value.replace(/[^\d]/g, '');
    };

    // Helper function to format amount with commas
    const formatAmount = (value) => {
        const cleaned = sanitizeAmount(value);
        if (!cleaned) return '';
        return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    useEffect(() => {
        // Pre-fill amount if it came from URL (convert from kobo to naira)
        if (urlAmount) {
            const amountInNaira = (parseInt(urlAmount, 10) / 100).toString();
            setFormData(prev => ({ ...prev, amount: formatAmount(amountInNaira) }));
        }

        if (!paymentReference) {
            showToast('info', 'Welcome! Please fill in your details to complete your registration.');
        } else {
            showToast('success', 'Payment successful! Please complete your registration below.');
        }
    }, [paymentReference, urlAmount]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'amount') {
            // Sanitize and format the amount as they type
            const formatted = formatAmount(value);
            setFormData(prev => ({ ...prev, amount: formatted }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const showToast = (type, message) => {
        setToast({ show: true, message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                donationType,
                paymentReference: paymentReference || null,
                status: donationType === 'monthly' ? 'active' : 'completed'
            };

            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                showToast('success', 'Thank you! Your details have been saved.');
                // Clear form
                setFormData({ fullName: '', email: '', phone: '', amount: '', prayerRequest: '' });
            } else {
                showToast('error', data.message || 'Submission failed. Please try again.');
            }
        } catch (error) {
            showToast('error', error.message || 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <div className="bg-white min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center py-12 px-4">
                    <div className="max-w-xl w-full mx-auto">
                        <div className="p-4 md:p-4">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {paymentReference ? 'Thank You for Your Gift!' : 'Register Your Details'}
                                </h2>
                                <p className="text-gray-600">
                                    {paymentReference
                                        ? "Your payment was successful. Please fill out the form below so we can personally thank you and keep you updated."
                                        : "If you gave via Bank Transfer or another method, please fill out the form below so we can personally thank you and keep you updated."
                                    }
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="name@example.com"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone / WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+234..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Amount Field - Required for All */}
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {donationType === 'monthly' ? 'Monthly commitment amount *' : 'Amount given *'}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9,]*"
                                            id="amount"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            placeholder={donationType === 'monthly' ? 'e.g., 10,000' : 'e.g., 50,000'}
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Helps us track and acknowledge your gift
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="prayerRequest" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Prayer request (optional)
                                    </label>
                                    <textarea
                                        id="prayerRequest"
                                        name="prayerRequest"
                                        value={formData.prayerRequest}
                                        onChange={handleInputChange}
                                        placeholder="Share how we can pray for you"
                                        rows="4"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    {donationType === 'one-time'
                                        ? "We'll send you a receipt and thank you message within 24 hours."
                                        : "Our team will contact you within 24 hours to finalize your partnership."
                                    }
                                </p>
                            </form>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default DonationSuccess;