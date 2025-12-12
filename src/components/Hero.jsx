import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-cover bg-center h-screen flex items-center justify-center text-center"
      style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Blurred+Worship+Background')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for blurring effect */}
      <div className="relative z-10 text-white p-4 max-w-4xl mx-auto">
        <p className="text-sm md:text-base font-semibold mb-2">PILGRIMAGE GIVING • FOTIA NETWORK INTERNATIONAL</p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">Support the Mission of Fotia Network International</h1>
        <p className="text-base md:text-lg mb-8">
          Partner with us monthly or with a one-time gift to fuel prayer, evangelism, and revival gatherings across the nations.
        </p>
        
        {/* Thumbnail Previews */}
        <div className="flex justify-center space-x-4 mt-8">
          <img src="https://via.placeholder.com/100x70?text=Thumb1" alt="Thumbnail 1" className="w-24 h-16 object-cover rounded-lg shadow-lg" />
          <img src="https://via.placeholder.com/100x70?text=Thumb2" alt="Thumbnail 2" className="w-24 h-16 object-cover rounded-lg shadow-lg" />
          <img src="https://via.placeholder.com/100x70?text=Thumb3" alt="Thumbnail 3" className="w-24 h-16 object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

