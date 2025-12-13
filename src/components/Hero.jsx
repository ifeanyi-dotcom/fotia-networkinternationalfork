import React, { useState, useEffect } from 'react';
import Crusade1 from '../assets/Crusade1.png';
import Crusade2 from '../assets/Crusade2.jpg';
import Crusade3 from '../assets/Crusade3.png';
import Crusade4 from '../assets/Crusade4.png';
import Crusade5 from '../assets/Crusade5.png';
import Crusade6 from '../assets/Crusade6.png';
import Crusade7 from '../assets/Crusade7.png';
import Crusade8 from '../assets/Crusade8.png';
import Crusade9 from '../assets/Crusade9.png';
import Crusade10 from '../assets/Crusade10.png';

const images = [
    Crusade1, Crusade2, Crusade3, Crusade4, Crusade5,
    Crusade6, Crusade7, Crusade8, Crusade9, Crusade10
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="relative bg-gray-900 h-[600px] flex items-center justify-center text-center overflow-hidden">
            {/* Carousel Background Images */}
            <div className="absolute inset-0">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={img}
                            alt={`Crusade ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-white p-4 max-w-4xl mx-auto">
                <p className="text-xs md:text-sm font-semibold mb-3 tracking-wider opacity-90 uppercase">
                    Revival Partnership
                </p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    Support the Mission of <br />
                    <span className="text-yellow-400">Fotia Network International</span>
                </h1>
                <p className="text-base md:text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
                    Partner with us monthly or with a one-time gift to fuel prayer, evangelism, and revival gatherings{' '}
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded font-semibold">
                        across the nations
                    </span>
                    .
                </p>

                {/* Carousel Indicators */}
                <div className="flex justify-center space-x-3">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'w-8 h-2 bg-yellow-400'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
			
            {/* Navigation Arrows */}
            <button
                onClick={() => goToSlide((currentSlide - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hidden md:block"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => goToSlide((currentSlide + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hidden md:block"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </section>
    );
};

export default Hero;