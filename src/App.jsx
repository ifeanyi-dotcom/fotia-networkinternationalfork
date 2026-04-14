import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import DonationSection from './components/DonationSection';
import ImpactSection from './components/ImpactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/admindashboard.jsx';
import DonationSuccess from './components/DonationSuccess.jsx';
import BurnRegister from './components/BurnRegister.jsx';

const MainLayout = () => (
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

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/donation-successful" element={<DonationSuccess />} />
            <Route path="/burn-register" element={<BurnRegister />} />
        </Routes>
    );
}