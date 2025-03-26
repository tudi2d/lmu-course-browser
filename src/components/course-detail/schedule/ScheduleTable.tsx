
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleItem, Schedule, CalendarLink } from "@/services/types";

interface ScheduleTableProps {
  scheduleItems: any[];
  calendarLinks?: CalendarLink[];
  isOldFormat: boolean;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  scheduleItems, 
  calendarLinks, 
  isOldFormat 
}) => {
  return isOldFormat 
    ? renderOldScheduleFormat(scheduleItems as Schedule[]) 
    : renderNewScheduleFormat(scheduleItems as ScheduleItem[], calendarLinks);
};

const renderNewScheduleFormat = (scheduleItems: ScheduleItem[], calendarLinks?: CalendarLink[]) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Rhythm</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduleItems.map((item, index) => {
          // Find corresponding calendar link if available
          const calendarLink = calendarLinks && 
                            calendarLinks[index] ? 
                            calendarLinks[index] : null;
          
          return (
            <TableRow key={index}>
              <TableCell>{item.day}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>
                {item.rhythm === "woch" ? "Weekly" : item.rhythm || "N/A"}
              </TableCell>
              <TableCell>
                {item.duration?.start ? (
                  <>
                    {item.duration.start}
                    {item.duration.end && <> to {item.duration.end}</>}
                  </>
                ) : "N/A"}
              </TableCell>
              <TableCell>
                {item.rooms && item.rooms.length > 0 ? (
                  <div className="space-y-1">
                    {item.rooms.map((room, roomIdx) => (
                      <div key={roomIdx} className="flex items-center">
                        <span>{room.name}</span>
                        {room.details_url && (
                          <a
                            href={room.details_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-600 hover:underline"
                            aria-label="Room details"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : "N/A"}
              </TableCell>
              <TableCell>
                {item.notes || "N/A"}
              </TableCell>
              <TableCell>
                {calendarLink && calendarLink.url && (
                  <a
                    href={calendarLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download iCal"
                  >
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const renderOldScheduleFormat = (scheduleItems: Schedule[]) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Rhythm</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Room</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduleItems.map((item, index) => {
          // Format dates for readability
          const formattedFirstDate = item.first_date ? new Date(item.first_date).toLocaleDateString() : item.first_date;
          const formattedLastDate = item.last_date ? new Date(item.last_date).toLocaleDateString() : item.last_date;
          
          return (
            <TableRow key={index}>
              <TableCell>{item.day}</TableCell>
              <TableCell>
                {item.time_start} - {item.time_end}
              </TableCell>
              <TableCell>{item.rhythm || "N/A"}</TableCell>
              <TableCell>
                {formattedFirstDate && formattedLastDate
                  ? `${formattedFirstDate} to ${formattedLastDate}`
                  : formattedFirstDate || formattedLastDate || "N/A"}
              </TableCell>
              <TableCell>
                {item.room}
                {item.room_link && (
                  <a
                    href={item.room_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell>
                {item.calendar_link && (
                  <a
                    href={item.calendar_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download iCal"
                  >
                    <Button variant="ghost" size="sm" className="gap-2 h-8 w-8 p-0">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
