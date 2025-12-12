import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DonationSection from './components/DonationSection';
import ImpactSection from './components/ImpactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <DonationSection />
        <ImpactSection />
      </main>
      <Footer />
    </div>
  );
}