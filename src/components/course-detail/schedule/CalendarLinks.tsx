
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarLink } from "@/services/types";

interface CalendarLinksProps {
  calendarLinks: CalendarLink[];
  scheduleLength: number;
}

export const CalendarLinks: React.FC<CalendarLinksProps> = ({ 
  calendarLinks, 
  scheduleLength 
}) => {
  // Only show if there are calendar links but they're not mapped 1:1 with schedule items
  if (!calendarLinks || 
      calendarLinks.length === 0 ||
      (scheduleLength > 0 && calendarLinks.length === scheduleLength)) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Calendar Links</h3>
      <div className="flex flex-wrap gap-2">
        {calendarLinks.map((link, index) => (
          link.url && (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>iCal</span>
              </Button>
            </a>
          )
        ))}
      </div>
    </div>
  );
};
