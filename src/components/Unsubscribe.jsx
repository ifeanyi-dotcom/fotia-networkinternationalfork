import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Unsubscribe = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    const email = searchParams.get('email');
    const list = searchParams.get('list');

    useEffect(() => {
        const performUnsubscribe = async () => {
            if (!email || !list) {
                setStatus('error');
                setMessage('Invalid unsubscribe link. Missing information.');
                return;
            }

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
        };

        performUnsubscribe();
    }, [email, list]);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white p-8 md:p-12 border-2 border-gray-100 rounded-3xl shadow-sm">
                        {status === 'loading' && (
                            <div className="space-y-4">
                                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                                <h1 className="text-2xl font-bold text-gray-900">Unsubscribing...</h1>
                                <p className="text-gray-500">Please wait while we process your request.</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">Unsubscribed</h1>
                                <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
                                <div className="pt-6">
                                    <Link 
                                        to="/" 
                                        className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Return Home
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="space-y-6">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">Oops!</h1>
                                <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
                                <div className="pt-6">
                                    <Link 
                                        to="/" 
                                        className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Go Back
                                    </Link>
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
