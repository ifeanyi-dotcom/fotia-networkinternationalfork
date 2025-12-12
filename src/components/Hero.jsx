import React from 'react';
import Crusade6 from '../assets/Crusade6.png';
import Crusade2 from '../assets/Crusade2.jpg';
import Crusade5 from '../assets/Crusade5.png';

const Hero = () => {
    return (
        <section className="relative bg-gray-900 h-[500px] flex items-center justify-center text-center overflow-hidden">
            {/* Background Image Placeholder - will be replaced with actual image */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue/60 to-blue/40">

            </div>

            {/* Content */}
            <div className="relative z-10 text-white p-4 max-w-4xl mx-auto">
                <p className="text-xs md:text-sm font-semibold mb-3 tracking-wider opacity-90">
                    REVIVAL PARTNERSHIP
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    Support the Mission of Fotia Network International
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
                    Partner With us Monthly or With a One-time Gift to Fuel Prayer, Evangelism, and Revival Gatherings <mark className="text-Yellow-300">Across the Nations</mark>.
                </p>

                {/* Thumbnail Previews - placeholders for actual images */}
                <div className="flex justify-center space-x-3 mt-8">
                    <div className="w-28 h-20 bg-gray-700 rounded-lg shadow-xl overflow-hidden">
                        <img
                            src={Crusade6}
                            alt="Event thumbnail 1"
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <div className="w-28 h-20 bg-gray-700 rounded-lg shadow-xl overflow-hidden">
                        <img
                            src={Crusade2}
                            alt="Event thumbnail 2"
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <div className="w-28 h-20 bg-gray-700 rounded-lg shadow-xl overflow-hidden">
                        <img
                            src={Crusade5}
                            alt="Event thumbnail 3"
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;