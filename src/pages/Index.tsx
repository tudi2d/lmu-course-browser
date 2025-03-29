
import React from 'react';
import TreeBrowser from '../components/TreeBrowser';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <TreeBrowser />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
