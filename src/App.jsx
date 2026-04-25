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
import Unsubscribe from './components/Unsubscribe.jsx';

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
    const hostname = window.location.hostname;
    // Check if the current hostname is the BURN subdomain
    const isBurnSite = hostname.includes('burn.');

    if (isBurnSite) {
        return (
            <Routes>
                {/* For the BURN subdomain, the form is the root homepage */}
                <Route path="/" element={<BurnRegister />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                {/* Catch-all for the subdomain to prevent 404s on non-existent paths */}
                <Route path="*" element={<BurnRegister />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/donation-successful" element={<DonationSuccess />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
        </Routes>
    );
}