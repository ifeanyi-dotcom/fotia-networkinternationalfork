import React from 'react';

// A simple icon component for placeholder
const SocialIcon = () => <div className="w-6 h-6 bg-gray-600 rounded-full"></div>;

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row text-center md:text-left justify-between gap-12">

                    {/* Left Column: Logo and Description */}
                    <div className="md:w-1/3">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <div className="w-8 h-8 bg-orange-500 mr-3"></div>
                            <div>
                                <div className="font-bold text-lg">FOTIA NETWORK</div>
                                <div className="font-bold text-lg">INTERNATIONAL</div>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                            A ministry committed to fueling prayer, revival, and the gospel to the ends of the earth.
                        </p>
                        <p className="text-gray-400 italic">
                            “Until every nation burns with the fire of His presence.”
                        </p>
                    </div>

                    {/* Center Column: Contact */}
                    <div className="md:w-1/3">
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="mailto:info@fotianetwork.org" className="hover:text-white">info@fotianetwork.org</a></li>
                            <li>+234 (0) 800 000 0000</li>
                            <li>Lagos, Nigeria + Global</li>
                        </ul>
                    </div>

                    {/* Right Column: Quick Links & Follow */}
                    <div className="md:w-1/3">
                        {/*<h3 className="font-bold text-lg mb-4">Quick Links</h3>*/}
                        {/*<ul className="space-y-2 text-gray-300 mb-6">*/}
                        {/*    <li><a href="#" className="hover:text-white">Partner</a></li>*/}
                        {/*    <li><a href="#" className="hover:text-white">Give a one-time gift</a></li>*/}
                        {/*    <li><a href="#" className="hover:text-white">About the ministry</a></li>*/}
                        {/*    <li><a href="#" className="hover:text-white">Privacy & terms</a></li>*/}
                        {/*</ul>*/}
                        <h3 className="font-bold text-lg mb-4">Follow</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <SocialIcon />
                            <SocialIcon />
                            <SocialIcon />
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Fotia Network International. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

