/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { WhatIsOorcaSection } from './components/WhatIsOorcaSection';
import { CoreCapabilitiesSection } from './components/CoreCapabilitiesSection';
import { HowItWorksPipeline } from './components/HowItWorksPipeline';
import { EnvironmentalImpactSection } from './components/EnvironmentalImpactSection';
import { TechnologyBehindSection } from './components/TechnologyBehindSection';
import { WhyOorcaIsDifferentSection } from './components/WhyOorcaIsDifferentSection';
import { FooterSection } from './components/FooterSection';
import FloatingNavigationBubble from './components/FloatingNavigationBubble';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { SimulationPage } from './pages/SimulationPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function HomePage() {
  const scrollToCapabilities = () => {
    const el = document.getElementById('core-capabilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPipeline = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#020712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 1. Hero Section */}
      <HeroSection 
        onExploreClick={scrollToCapabilities}
        onPipelineClick={scrollToPipeline}
      />

      {/* 2. What is OORCA? */}
      <WhatIsOorcaSection />

      {/* 3. Core Intelligence Capabilities */}
      <CoreCapabilitiesSection />

      {/* 4. How OORCA Works (Forensic Pipeline) */}
      <HowItWorksPipeline />

      {/* 5. Environmental Impact */}
      <EnvironmentalImpactSection />

      {/* 6. Technology Behind OORCA (Interconnected Node Network) */}
      <TechnologyBehindSection />

      {/* 7. Why OORCA Is Different */}
      <WhyOorcaIsDifferentSection />

      {/* 8. Deep-Ocean Minimal Footer */}
      <FooterSection />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Draggable futuristic command-center floating navigation bubble */}
      <FloatingNavigationBubble />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/data" element={<ComingSoonPage pageType="data" />} />
        <Route path="/alerts" element={<AlertCenterPage />} />
        <Route path="/dev" element={<ComingSoonPage pageType="dev" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
