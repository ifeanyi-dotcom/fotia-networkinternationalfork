import React, { useState } from 'react';

// A simple icon component for placeholder
const Icon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"></path></svg>;


const DonationSection = () => {
    const [donationType, setDonationType] = useState('one-time');

    const amountButtons = ['₦10,000', '₦25,000', '₦50,000', 'Custom'];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Column: Give a Gift */}
                    <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-2">Give a gift to Fotia Network International</h2>
                        <p className="text-gray-600 mb-6">Choose an amount, select one-time or monthly, and complete your secure card or bank transfer gift in seconds.</p>

                        <div className="flex border border-gray-200 rounded-lg mb-6">
                            <button onClick={() => setDonationType('one-time')} className={`w-1/2 py-3 font-semibold rounded-l-lg transition-colors ${donationType === 'one-time' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>One-Time</button>
                            <button onClick={() => setDonationType('monthly')} className={`w-1/2 py-3 font-semibold rounded-r-lg transition-colors ${donationType === 'monthly' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>Monthly Pledge</button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {amountButtons.map(amount => (
                                <button key={amount} className="border border-gray-300 rounded-lg py-3 hover:bg-gray-100">{amount}</button>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="amount">Amount</label>
                            <input type="text" id="amount" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="₦" />
                        </div>
                        
                        {donationType === 'monthly' && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="debit-day">Preferred debit day</label>
                                <select id="debit-day" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                                    <option>1st of the month</option>
                                    <option>15th of the month</option>
                                </select>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="country">Country</label>
                            <select id="country" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                                <option>Nigeria</option>
                                <option>United States</option>
                                <option>United Kingdom</option>
                            </select>
                        </div>
                        
                        <div className="space-y-4">
                            <input type="text" placeholder="Name on card" className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                            <input type="text" placeholder="Card number" className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                            <div className="flex gap-4">
                                <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"/>
                                <input type="text" placeholder="CVV" className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"/>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                                <Icon className="w-8 h-8 text-blue-600" /> {/* Visa */}
                                <Icon className="w-8 h-8 text-red-600" /> {/* Mastercard */}
                                <Icon className="w-8 h-8 text-yellow-500" /> {/* Verve */}
                            </div>
                        </div>

                        <button className="w-full bg-gold text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-opacity-90">
                            Give Now
                        </button>
                        
                        <div className="text-center my-4 text-gray-500">OR</div>

                        <div className="space-y-4">
                             <p className="font-semibold text-center">For bank transfers</p>
                             <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                 <div>
                                     <p className="font-bold">GTBank</p>
                                     <p className="text-gray-600">0123456789</p>
                                 </div>
                                 <button className="text-sm font-semibold text-gold">Copy</button>
                             </div>
                             <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                 <div>
                                     <p className="font-bold">Access Bank</p>
                                     <p className="text-gray-600">9876543210</p>
                                 </div>
                                 <button className="text-sm font-semibold text-gold">Copy</button>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Share your details */}
                    <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                         <h2 className="text-2xl font-bold mb-6">Share your details with us</h2>
                         <div className="space-y-4">
                            <input type="text" placeholder="Full name" className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                            <input type="email" placeholder="Email address" className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                            <input type="tel" placeholder="Phone / WhatsApp" className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                             <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-500">
                                 <option>Best way to reach you</option>
                                 <option>Phone</option>
                                 <option>Email</option>
                             </select>
                             <textarea placeholder="Prayer request (optional)" rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
                             <div className="flex items-start">
                                <input type="checkbox" id="bank-transfer-check" className="mt-1 h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold"/>
                                <label htmlFor="bank-transfer-check" className="ml-2 text-sm text-gray-600">I have given or will give by bank transfer and want my details recorded.</label>
                             </div>
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DonationSection;

