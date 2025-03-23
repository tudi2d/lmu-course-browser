
import React from 'react';
import CalendarModal from '@/components/CalendarModal';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <CalendarModal showButton={false} />
      <script dangerouslySetInnerHTML={{ __html: 'document.querySelector("[role=\'dialog\']")?.click()' }} />
    </div>
  );
};

export default Calendar;
