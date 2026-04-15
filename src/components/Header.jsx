import React from 'react';
import logo from '../assets/headerLOGO.png';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout }) => {
    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/"> {/* Added Link for logo to navigate home */}
                            <img
                                src={logo}
                                alt="FOTIA NETWORK INTERNATIONAL"
                                className="h-12 w-auto mr-3"
                            />
                        </Link>
                    </div>

                    {/* Logout Button (conditional) */}
                    {isAuthenticated && (
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                            Logout
                        </button>
                    )}

                    {/* Mobile Menu Button (commented out) */}
                    {/*<div className="md:hidden">*/}
                    {/*    <button className="text-gray-800">*/}
                    {/*        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                    {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                    {/*                  d="M4 6h16M4 12h16m-7 6h7"></path>*/}
                    {/*        </svg>*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                </div>
            </div>
        </header>
    );
};

export default Header;
