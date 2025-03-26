
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course, Schedule, ScheduleItem, CalendarLink } from "@/services/types";

interface CourseScheduleTabProps {
  courseData: Course;
}

// Type guard to check if schedule item is the old format (Schedule)
const isOldScheduleFormat = (item: ScheduleItem | Schedule): item is Schedule => {
  return 'first_date' in item && 'last_date' in item;
};

export const CourseScheduleTab: React.FC<CourseScheduleTabProps> = ({ courseData }) => {
  if (!courseData.schedule || !Array.isArray(courseData.schedule) || courseData.schedule.length === 0) {
    return <p className="text-muted-foreground">No schedule information available.</p>;
  }

  // Check if we're using the old schedule format
  const isOldFormat = courseData.schedule.length > 0 && isOldScheduleFormat(courseData.schedule[0]);

  // Render for new schedule format
  const renderNewScheduleFormat = () => {
    // Safely cast to ScheduleItem array
    const scheduleItems = courseData.schedule as ScheduleItem[];
    
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
            const calendarLink = courseData.calendar_links && 
                               courseData.calendar_links[index] ? 
                               courseData.calendar_links[index] : null;
            
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

  // Render for old schedule format 
  const renderOldScheduleFormat = () => {
    // Safely cast to Schedule array
    const scheduleItems = courseData.schedule as Schedule[];
    
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

  // Render stand-alone calendar links section if they exist but aren't mapped directly to schedule items
  const renderStandaloneCalendarLinks = () => {
    // Only show if there are calendar links but they're not mapped 1:1 with schedule items
    if (!courseData.calendar_links || 
        courseData.calendar_links.length === 0 ||
        (courseData.schedule && courseData.calendar_links.length === courseData.schedule.length)) {
      return null;
    }

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Calendar Links</h3>
        <div className="flex flex-wrap gap-2">
          {courseData.calendar_links.map((link, index) => (
            link.url && (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  iCal
                </Button>
              </a>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {isOldFormat ? renderOldScheduleFormat() : renderNewScheduleFormat()}
      {renderStandaloneCalendarLinks()}
    </div>
  );
};
