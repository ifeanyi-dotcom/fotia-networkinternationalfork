import React from 'react';
import logo from '../assets/Screenshot 2025-12-12 at 19.23.57.png';

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="FOTIA NETWORK INTERNATIONAL"
                            className="h-16 w-auto mr-3"
                        />
                    </div>

                    {/* Mobile Menu Button */}
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
