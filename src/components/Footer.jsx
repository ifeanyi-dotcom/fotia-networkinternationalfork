import React from 'react';
import logo from '../assets/logo.PNG';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid md:grid-cols-3 gap-12 mb-12">

                    {/* Left Column: Logo and Description */}
                    <div>
                        <div className="flex items-center mb-4">
                            <img src={logo} alt="FOTIA NETWORK International" className="w-auto h-15 rounded-lg mr-3" />
                            
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            A Ministry Committed to Setting Men on Fire for Jesus with Signs and Wonders Following
                        </p>
                        <p className="text-gray-400 italic text-sm">
                            "Until every nation burns with the fire of His presence."
                        </p>
                    </div>

                    {/* Center Column: Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:fotianetwork@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    fotianetwork@gmail.com
                                </a>
                            </li>
                            <li className="text-gray-300 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                +234 (0) 813 004 0140 <br /> +234 (0) 810 566 7092
                            </li>
                            <li className="text-gray-300 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Abuja, Nigeria • Global
                            </li>
                        </ul>
                    </div>

                    {/* Right Column: Quick Links & Social */}
                    <div>
                        {/*<h3 className="font-bold text-lg mb-4">Quick links</h3>*/}
                        {/*<ul className="space-y-3 mb-8">*/}
                        {/*    <li>*/}
                        {/*        <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Partner</a>*/}
                        {/*    </li>*/}
                        {/*    <li>*/}
                        {/*        <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Give a one-time gift</a>*/}
                        {/*    </li>*/}
                        {/*    <li>*/}
                        {/*        <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">About the ministry</a>*/}
                        {/*    </li>*/}
                        {/*    <li>*/}
                        {/*        <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Privacy & terms</a>*/}
                        {/*    </li>*/}
                        {/*</ul>*/}

                        <h3 className="font-bold text-lg mb-4">Follow</h3>
                        <div className="flex space-x-3">
                            <a href="https://www.instagram.com/emekaezera_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-yellow-600 rounded-lg flex items-center justify-center transition-colors">
                                <i className="fa-brands fa-instagram text-white text-lg"></i>
                            </a>
                            <a href="https://www.youtube.com/@EmekaEzera" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-yellow-600 rounded-lg flex items-center justify-center transition-colors">
                                <i className="fa-brands fa-youtube text-white text-lg"></i>
                            </a>
                            <a href="https://www.facebook.com/chukwuemeka.ezera" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-yellow-600 rounded-lg flex items-center justify-center transition-colors">
                                <i className="fa-brands fa-facebook-f text-white text-lg"></i>
                            </a>
                            <a href="https://www.tiktok.com/@Emekaezera_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-yellow-600 rounded-lg flex items-center justify-center transition-colors">
                                <i className="fa-brands fa-tiktok text-white text-lg"></i>
                            </a>
                        </div>
                        <p className="text-sm mt-8 text-gray-300">
                            Built by
                            <a href="https://successdanesy.vercel.app" className="text-blue-500 hover:underline">
                                {" "}&lt; Success Danesy /&gt;
                            </a>
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Fotia Network International. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;