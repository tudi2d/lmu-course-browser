
import React from 'react';
import CalendarModal from '@/components/CalendarModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <CalendarModal showButton={false} />
        <script dangerouslySetInnerHTML={{ __html: 'document.querySelector("[role=\'dialog\']")?.click()' }} />
      </div>
      <Footer />
    </div>
  );
};

export default Calendar;
