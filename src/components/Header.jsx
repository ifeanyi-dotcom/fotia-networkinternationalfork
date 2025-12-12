import React from 'react';
import logo from '../assets/logo.PNG';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 mr-3"></div>
            <div>
              <div className="font-bold text-lg text-gray-800">FOTIA NETWORK</div>
              <div className="font-bold text-lg text-gray-800">INTERNATIONAL</div>
            </div>
          </div>

          {/* Navigation */}
          {/*<nav className="hidden md:flex items-center space-x-6">*/}
          {/*  <a href="#" className="text-gray-600 hover:text-gray-800">Give</a>*/}
          {/*  <a href="#" className="text-gray-600 hover:text-gray-800">About</a>*/}
          {/*  <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>*/}
          {/*  <button className="bg-gold text-white font-bold py-2 px-4 rounded hover:bg-opacity-90">*/}
          {/*    Give Now*/}
          {/*  </button>*/}
          {/*</nav>*/}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

