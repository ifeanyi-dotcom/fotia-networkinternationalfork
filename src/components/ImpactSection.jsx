import React from 'react';
import LazyImage from './LazyImage';
import Burn2 from '../assets/Burn2.png';
import Burn3 from '../assets/Burn3.png';
import Burn1 from '../assets/Burn1.png';

const ImpactSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left Column: Text Content */}
                    <div className="md:w-1/2">
                        <h3 className="text-sm font-semibold text-gold uppercase mb-2">Your Impact</h3>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">How Your Gifts Fuel the Mission</h2>
                        <p className="text-gray-600 mb-6">Every gift, no matter the size, directly contributes to spreading the gospel and creating spaces for life-changing encounters with God.</p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-gold font-bold mr-3">✓</span>
                                <p className="text-gray-700"><strong>Nation-wide gospel crusades</strong> that gather thousands to hear the good news.</p>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gold font-bold mr-3">✓</span>
                                <p className="text-gray-700"><strong>Prayer Meetings</strong> that unite believers and usher in the presence of God.</p>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gold font-bold mr-3">✓</span>
                                <p className="text-gray-700"><strong>Campus & street outreaches</strong> that bring hope to the next generation.</p>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column: Image Thumbnails with Lazy Loading */}
                    <div className="md:w-1/2 grid grid-cols-2 grid-rows-2 gap-4">
                        <LazyImage
                            src={Burn2}
                            alt="Altar moments"
                            className="rounded-lg shadow-lg object-cover w-full h-full col-span-1 row-span-1"
                        />
                        <LazyImage
                            src={Burn3}
                            alt="Interactions"
                            className="rounded-lg shadow-lg object-cover w-full h-full col-span-1 row-span-2"
                        />
                        <LazyImage
                            src={Burn1}
                            alt="Worship nights"
                            className="rounded-lg shadow-lg object-cover w-full h-full col-span-1 row-span-1"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImpactSection;