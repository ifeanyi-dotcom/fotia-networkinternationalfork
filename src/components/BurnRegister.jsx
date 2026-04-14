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
                                    Welcome to BURN
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Stay connected for upcoming prayer, evangelism, and revival gatherings
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                            First name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6b35] transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all duration-300 ${
                                                    errors.first_name ? 'border-red-300 bg-red-50/30' : 'hover:border-gray-300 hover:bg-white'
                                                }`}
                                            />
                                        </div>
                                        {errors.first_name && (
                                            <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                            Last name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6b35] transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all duration-300 ${
                                                    errors.last_name ? 'border-red-300 bg-red-50/30' : 'hover:border-gray-300 hover:bg-white'
                                                }`}
                                            />
                                        </div>
                                        {errors.last_name && (
                                            <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                        Email address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6b35] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="name@example.com"
                                            className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all duration-300 ${
                                                errors.email ? 'border-red-300 bg-red-50/30' : 'hover:border-gray-300 hover:bg-white'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                        Phone / WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6b35] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+234 123 456 7890"
                                            className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all duration-300 ${
                                                errors.phone ? 'border-red-300 bg-red-50/30' : 'hover:border-gray-300 hover:bg-white'
                                            }`}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6b35] transition-colors z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <select
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all duration-300 appearance-none ${
                                                errors.city ? 'border-red-300 bg-red-50/30' : 'hover:border-gray-300 hover:bg-white'
                                            }`}
                                        >
                                            <option value="">Select a city</option>
                                            <option value="Abuja">Abuja</option>
                                            <option value="Lagos">Lagos</option>
                                            <option value="Jos">Jos</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.city}</p>
                                    )}
                                </div>

                                <div className="flex items-start p-4 rounded-2xl hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="first_timer"
                                            name="first_timer"
                                            checked={formData.first_timer}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-[#ff6b35] border-gray-300 rounded-lg focus:ring-[#ff6b35] cursor-pointer transition-all duration-300"
                                        />
                                    </div>
                                    <label htmlFor="first_timer" className="ml-4 cursor-pointer">
                                        <span className="block text-sm font-bold text-gray-700">This is my first time attending BURN</span>
                                        <span className="block text-xs text-gray-400 mt-1 font-medium">We love welcoming first-timers, we'll make sure you feel at home!</span>
                                    </label>
                                </div>
 
                                <div className={`flex items-start p-5 rounded-2xl transition-all duration-300 group cursor-pointer border ${
                                    errors.consent 
                                        ? 'bg-red-50/50 border-red-100' 
                                        : 'bg-orange-50/30 border-orange-100/50 hover:bg-orange-50/50'
                                }`}>
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="consent"
                                            name="consent"
                                            checked={formData.consent}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-[#ff6b35] border-gray-300 rounded-lg focus:ring-[#ff6b35] cursor-pointer transition-all duration-300"
                                        />
                                    </div>
                                    <label htmlFor="consent" className="ml-4 cursor-pointer">
                                        <span className="block text-sm font-bold text-gray-800 leading-tight">I agree to receive emails about BURN <span className="text-red-500">*</span></span>
                                        <span className="block text-xs text-orange-600/60 mt-1 font-medium leading-relaxed">You'll receive event updates and a confirmation email. You can unsubscribe anytime.</span>
                                    </label>
                                </div>
                                {errors.consent && (
                                    <p className="text-red-500 text-sm">{errors.consent}</p>
                                )}
 
                                <button
                                    type="submit"
                                    className="w-full bg-[#ff6b35] text-white font-black text-lg py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-100 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Connecting...' : 'Stay Connected'}
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
