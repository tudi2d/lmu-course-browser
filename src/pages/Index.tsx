
import React from 'react';
import TreeBrowser from '../components/TreeBrowser';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-primary/5 py-8 px-6 text-center border-b">
        <h1 className="text-4xl font-serif text-primary font-bold mb-2">LMU Course Browser</h1>
        <p className="text-muted-foreground">Find, compare and organize your university courses</p>
      </div>
      <div className="flex-1">
        <TreeBrowser />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
