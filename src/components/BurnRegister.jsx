import React, { useState } from 'react';
import Toast from './Toast';
import Header from './Header';
import Footer from './Footer';

const BurnRegister = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city: '',
        first_timer: false,
        consent: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.first_name)) {
            newErrors.first_name = 'First name must contain only letters';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.last_name)) {
            newErrors.last_name = 'Last name must contain only letters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^[0-9]{10,}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
            newErrors.phone = 'Phone must contain at least 10 digits';
        }

        if (!formData.city) {
            newErrors.city = 'Please select a city';
        }

        if (!formData.consent) {
            newErrors.consent = 'You must agree to receive emails';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const showToast = (type, message) => {
        setToast({ show: true, message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/subscribe-burn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showToast('success', data.message || 'Check your email to confirm your registration for BURN');
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    city: '',
                    first_timer: false,
                    consent: false
                });
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
                    <div className="max-w-2xl w-full mx-auto">
                        <div className="p-4 md:p-8">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                                    Join BURN
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Register for prayer, evangelism, and revival gatherings
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            First name *
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                                                errors.first_name
                                                    ? 'border-red-500 focus:border-red-600'
                                                    : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                        />
                                        {errors.first_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last name *
                                        </label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                                                errors.last_name
                                                    ? 'border-red-500 focus:border-red-600'
                                                    : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                        />
                                        {errors.last_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                                        )}
                                    </div>
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
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                                            errors.email
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
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
                                        placeholder="+234 123 456 7890"
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                                            errors.phone
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                                            errors.city
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                    >
                                        <option value="">Select a city</option>
                                        <option value="Abuja">Abuja</option>
                                        <option value="Lagos">Lagos</option>
                                        <option value="Jos">Jos</option>
                                    </select>
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                    )}
                                </div>

                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="first_timer"
                                        name="first_timer"
                                        checked={formData.first_timer}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 mt-1 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="first_timer" className="ml-3 text-sm text-gray-700 cursor-pointer">
                                        This is my first time attending BURN
                                    </label>
                                </div>

                                <div className={`flex items-start p-4 rounded-lg ${
                                    errors.consent ? 'bg-red-50 border-2 border-red-200' : 'bg-blue-50'
                                }`}>
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        name="consent"
                                        checked={formData.consent}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="consent" className="ml-3 text-sm text-gray-700 cursor-pointer">
                                        I agree to receive emails about BURN *
                                    </label>
                                </div>
                                {errors.consent && (
                                    <p className="text-red-500 text-sm">{errors.consent}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register for BURN'}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    Check your email to confirm your registration. You'll receive updates about upcoming BURN events.
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

export default BurnRegister;
