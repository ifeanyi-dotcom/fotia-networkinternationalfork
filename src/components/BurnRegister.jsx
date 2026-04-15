import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import Header from './Header';
import Footer from './Footer';
import LazyImage from './LazyImage';

// Import BURN Event Assets
import Burn1 from '../assets/Burn1.png';
import Burn2 from '../assets/Burn2.png';
import Burn3 from '../assets/Burn3.png';
import Burn4 from '../assets/Burn4.png';
import Burn5 from '../assets/Burn5.png';

import BurnLogo from '../assets/BurnLOGO.png';

const burnImages = [Burn1, Burn2, Burn3, Burn4, Burn5];

const BurnRegister = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city: '',
        first_timer: false,
        consent: true
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [currentSlide, setCurrentSlide] = useState(0);

    // Carousel Auto-play effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % burnImages.length);
        }, 5000); // 5 second rotations to match Hero.jsx
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

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

        // Consent is now implicit on submission

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
                    consent: true
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
            <div className="bg-[#fafafa] min-h-screen flex flex-col font-outfit selection:bg-orange-100 selection:text-orange-900">
                <Header />

                {/* Immersive Hero Section - Synchronized with Hero.jsx */}
                <div className="bg-gray-950 pt-20 pb-64 px-4 relative overflow-hidden flex items-center justify-center text-center">
                    {/* Background Image Carousel Layer */}
                    <div className="absolute inset-0 z-0">
                        {burnImages.map((img, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <LazyImage
                                    src={img}
                                    alt={`BURN Event ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}

                        {/* High-End Fiery Gradient Overlay - Matched to Hero.jsx */}
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/60 to-gray-950/80"></div>
                    </div>

                    {/* Layered Organic Glows - Layered on top of images for brand unity */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none animate-luminous z-1"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                        <div className="reveal-staggered flex flex-col items-center">

                            <div className="mb-10 mt-10 group">
                                <img
                                    src={BurnLogo}
                                    alt="BURN"
                                    className="w-[300px] md:w-[500px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-1000 group-hover:scale-[1.03] select-none"
                                />
                            </div>

                            <p className="text-base md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90 text-white selection:bg-white/20 mb-12">
                                Fueling prayer, evangelism, and revival gatherings{' '}
                                <span className="inline-block bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-semibold">
                                    across the nations
                                </span>
                            </p>

                            {/* Carousel Indicators - Matched to Hero.jsx */}
                            <div className="flex justify-center space-x-3">
                                {burnImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                                            ? 'w-8 h-2 bg-orange-500'
                                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows - Matched to Hero.jsx */}
                    <button
                        onClick={() => goToSlide((currentSlide - 1 + burnImages.length) % burnImages.length)}
                        className="absolute left-6 top-[40%] -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all hidden lg:block border border-white/10"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => goToSlide((currentSlide + 1) % burnImages.length)}
                        className="absolute right-6 top-[40%] -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all hidden lg:block border border-white/10"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Main Registration Content */}
                <main className="flex-grow flex items-start justify-center -mt-32 pb-32 px-4 relative z-20">
                    <div className="max-w-2xl w-full mx-auto">
                        <div className="bg-white p-8 md:p-16 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-gray-100 relative">
                            {/* Form Header */}
                            <div className="mb-12 text-center reveal-staggered">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Connect Card</h3>
                                <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full"></div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10 reveal-staggered">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 focus-within:z-10">
                                    <div className="space-y-2">
                                        <label htmlFor="first_name" className="block text-sm font-bold text-gray-800 ml-1">
                                            First name <span className="text-orange-500">*</span>
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
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
                                                className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400 ${errors.first_name ? 'border-red-300 bg-red-50/20' : 'hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            />
                                        </div>
                                        {errors.first_name && (
                                            <p className="text-red-500 text-[10px] tracking-wide uppercase font-bold mt-1 ml-1 animate-pulse">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="last_name" className="block text-sm font-bold text-gray-800 ml-1">
                                            Last name <span className="text-orange-500">*</span>
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
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
                                                className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400 ${errors.last_name ? 'border-red-300 bg-red-50/20' : 'hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            />
                                        </div>
                                        {errors.last_name && (
                                            <p className="text-red-500 text-[10px] tracking-wide uppercase font-bold mt-1 ml-1 animate-pulse">{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-800 ml-1">
                                        Email address <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
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
                                            className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400 ${errors.email ? 'border-red-300 bg-red-50/20' : 'hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-[10px] tracking-wide uppercase font-bold mt-1 ml-1 animate-pulse">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-bold text-gray-800 ml-1">
                                        Phone / WhatsApp <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
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
                                            placeholder="012 345 6789"
                                            className={`w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400 ${errors.phone ? 'border-red-300 bg-red-50/20' : 'hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-[10px] tracking-wide uppercase font-bold mt-1 ml-1 animate-pulse">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="city" className="block text-sm font-bold text-gray-800 ml-1">
                                        Location / City <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors z-10">
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
                                            className={`w-full pl-11 pr-10 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer ${errors.city ? 'border-red-300 bg-red-50/20' : 'hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <option value="">Select your city</option>
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
                                        <p className="text-red-500 text-[10px] tracking-wide uppercase font-bold mt-1 ml-1 animate-pulse">{errors.city}</p>
                                    )}
                                </div>

                                <div className="space-y-6 pt-4">
                                    <div className="flex items-start p-5 rounded-3xl group cursor-pointer border border-gray-100/50 hover:bg-gray-50/50 transition-all duration-300">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                id="first_timer"
                                                name="first_timer"
                                                checked={formData.first_timer}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 accent-orange-500 border-gray-300 rounded-lg focus:ring-orange-500 cursor-pointer transition-all duration-300"
                                            />
                                        </div>
                                        <label htmlFor="first_timer" className="ml-4 cursor-pointer select-none">
                                            <span className="block text-base font-bold text-gray-800 leading-tight">First time attending BURN?</span>
                                            <span className="block text-sm text-gray-400 mt-1 font-medium">We love first-timers, we'll make sure you feel at home.</span>
                                        </label>
                                    </div>

                                    <div className="px-6 py-4 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                                        <p className="text-xs text-orange-900/60 leading-relaxed text-center font-medium">
                                            By clicking "Stay Connected", you agree to receive event updates and revival gathering details.
                                            You can opt-out at any time.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-[1.5rem] transition-all duration-500 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                        disabled={isSubmitting}
                                    >
                                        <span className="relative z-10">{isSubmitting ? 'Connecting...' : 'Stay Connected'}</span>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>
                                </div>
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
