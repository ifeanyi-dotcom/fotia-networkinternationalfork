import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Unsubscribe = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('confirming'); // confirming, processing, success, error
    const [message, setMessage] = useState('');

    const email = searchParams.get('email');
    const list = searchParams.get('list');

    const handleUnsubscribe = useCallback(async () => {
        if (!email || !list) {
            setStatus('error');
            setMessage('Invalid unsubscribe link. Missing information.');
            return;
        }

        setStatus('processing');
        try {
            const response = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}&list=${encodeURIComponent(list)}`, {
                method: 'GET',
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setMessage('You have been successfully unsubscribed from our mailing list.');
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to unsubscribe. Please try again later.');
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
            setStatus('error');
            setMessage('A network error occurred. Please try again later.');
        }
    }, [email, list]);

    return (
        <div className="bg-white min-h-screen flex flex-col font-inter">
            <Header />
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="p-8 md:p-12">
                        {status === 'confirming' && (
                            <div className="space-y-8">
                                <div className="w-20 h-20 bg-orange-50 text-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Wait!</h1>
                                    <p className="text-gray-500 text-lg">We're sad to see you go. Are you sure you want to stop receiving updates from BURN?</p>
                                </div>
                                <div className="flex flex-col space-y-4 pt-4">
                                    <button
                                        onClick={handleUnsubscribe}
                                        className="w-full bg-[#ff6b35] text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-orange-100 transform hover:-translate-y-0.5"
                                    >
                                        Yes, Unsubscribe
                                    </button>
                                    <Link
                                        to="/"
                                        className="w-full text-gray-400 font-medium px-8 py-2 hover:text-gray-600 transition-all duration-300"
                                    >
                                        No, keep me on the list
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="space-y-6">
                                <div className="animate-spin w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                                <h1 className="text-2xl font-bold text-gray-900">Processing...</h1>
                                <p className="text-gray-500">Just a moment while we update your preferences.</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Done</h1>
                                    <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
                                </div>
                                <div className="pt-8 border-t border-gray-100">
                                    <p className="text-gray-500 mb-4">Made a mistake? We would be happy to have you back!</p>
                                    <Link
                                        to="/burn"
                                        className="inline-block bg-[#ff6b35] text-white font-bold px-10 py-4 rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-orange-200"
                                    >
                                        Resubscribe to BURN
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                                        Return to Home
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="space-y-8">
                                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Oops!</h1>
                                    <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
                                </div>
                                <div className="pt-6">
                                    <button
                                        onClick={() => setStatus('confirming')}
                                        className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Unsubscribe;
