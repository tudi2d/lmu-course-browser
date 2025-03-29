
import React, { useState } from 'react';
import TreeBrowser from '../components/TreeBrowser';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Index = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(true); // Set to true by default

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onMenuClick={() => setMobileDrawerOpen(true)} />
      <div className="flex-1 overflow-hidden">
        <TreeBrowser mobileDrawerOpen={mobileDrawerOpen} setMobileDrawerOpen={setMobileDrawerOpen} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
