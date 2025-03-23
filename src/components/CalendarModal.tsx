
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CalendarView from '@/components/CalendarView';

interface CalendarModalProps {
  showButton?: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ showButton = true }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {showButton && (
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Course Calendar</DialogTitle>
          <DialogDescription>
            View your course schedule in a calendar format
          </DialogDescription>
        </DialogHeader>
        <div className="h-full pt-4">
          <CalendarView />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
