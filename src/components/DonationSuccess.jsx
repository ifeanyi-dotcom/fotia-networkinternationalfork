import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Toast from './Toast';
import Header from './Header'; // Import Header
import Footer from './Footer'; // Import Footer

const DonationSuccess = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        prayerRequest: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Extract payment details from URL
    const paymentReference = searchParams.get('reference') || searchParams.get('trxref');
    const amount = searchParams.get('amount'); // This will be in the smallest unit (kobo)
    const donationType = searchParams.get('type') || (window.location.pathname.includes('monthly') ? 'monthly' : 'one-time'); // Infer type

    useEffect(() => {
        if (!paymentReference) {
            showToast('info', 'Welcome! Please fill in your details to complete your registration.');
        } else {
            showToast('success', 'Payment successful! Please complete your registration below.');
        }
    }, [paymentReference]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showToast = (type, message) => {
        setToast({ show: true, message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Convert amount from kobo to major unit if available
        const amountInMajorUnit = amount ? (parseInt(amount, 10) / 100).toString() : 'N/A';

        try {
            const payload = {
                ...formData,
                amount: amountInMajorUnit,
                donationType,
                paymentReference,
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
                setFormData({ fullName: '', email: '', phone: '', prayerRequest: '' });
                // You could redirect them to a final thank you page or disable the form
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
                        <div className=" p-4 md:p-4 ">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {paymentReference ? 'Thank You for Your Gift!' : 'Register Your Details'}
                                </h2>
                                <p className="text-gray-600">
                                    {paymentReference
                                        ? "Your payment was successful. Please fill out the form below so we can personally thank you and keep you updated."
                                        : "If you gave via Bank Transfer or another method, Please fill out the form below so we can personally thank you and keep you updated."
                                    }
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">Full name *</label>
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
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email address *</label>
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
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone / WhatsApp *</label>
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
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prayer request (optional)</label>
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
                                    By submitting, you agree to receive communications from Fotia Network International.
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