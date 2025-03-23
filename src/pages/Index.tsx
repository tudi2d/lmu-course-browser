
import React from 'react';
import TreeBrowser from '../components/TreeBrowser';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1">
        <TreeBrowser />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
