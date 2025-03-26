
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ExternalLink } from "lucide-react";
import { Course, Schedule, ScheduleItem } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  // Check if we're using the old schedule format with first_date and last_date
  const isOldFormat = courseData.schedule.length > 0 && isOldScheduleFormat(courseData.schedule[0]);

  // Render for new schedule format (with day, time, rooms, etc.)
  const renderNewScheduleFormat = () => {
    // Safely cast to ScheduleItem array since we've verified it's not the old format
    const scheduleItems = courseData.schedule as ScheduleItem[];
    
    return (
      <div className="space-y-4">
        {scheduleItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg border p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-medium">
                  {item.day} {item.time}
                </h3>
                {item.rhythm && (
                  <p className="text-sm text-muted-foreground">
                    {item.rhythm === "woch" ? "Weekly" : item.rhythm}
                  </p>
                )}
              </div>
              {item.duration?.start && (
                <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                  {item.duration.start}
                  {item.duration.end && ` to ${item.duration.end}`}
                </div>
              )}
            </div>

            {/* Rooms */}
            {item.rooms && item.rooms.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Rooms:</h4>
                <div className="space-y-2">
                  {item.rooms.map((room, roomIdx) => (
                    <div key={roomIdx} className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">{room.name}</p>
                        {room.floor_plan && (
                          <a
                            href={room.floor_plan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline inline-flex items-center mt-1"
                          >
                            Floor Plan <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {room.details_url && (
                          <a
                            href={room.details_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            aria-label="Room details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor */}
            {item.instructor && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Instructor:</h4>
                <p className="text-sm">{item.instructor}</p>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Notes:</h4>
                <p className="text-sm text-muted-foreground">{item.notes}</p>
              </div>
            )}

            {/* Cancelled dates */}
            {item.cancelled_dates && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Cancelled:</h4>
                <p className="text-sm text-red-600">{item.cancelled_dates}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render for old schedule format (with first_date, last_date, etc.)
  const renderOldScheduleFormat = () => {
    // Safely cast to Schedule array since we've verified it's the old format
    const scheduleItems = courseData.schedule as Schedule[];
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleItems.map((item, index) => {
            const firstDate = item.first_date ? new Date(item.first_date) : null;
            const formattedFirstDate = firstDate ? firstDate.toLocaleDateString() : item.first_date;
            
            const lastDate = item.last_date ? new Date(item.last_date) : null;
            const formattedLastDate = lastDate ? lastDate.toLocaleDateString() : item.last_date;
            
            return (
              <TableRow key={index}>
                <TableCell>{item.day}</TableCell>
                <TableCell>
                  {item.time_start} - {item.time_end}
                </TableCell>
                <TableCell>
                  {item.room}
                  {item.room_link && (
                    <a
                      href={item.room_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {formattedFirstDate && formattedLastDate
                    ? `${formattedFirstDate} to ${formattedLastDate}`
                    : formattedFirstDate || formattedLastDate || "N/A"}
                </TableCell>
                <TableCell>
                  {item.calendar_link && (
                    <a
                      href={item.calendar_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download iCal"
                    >
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
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

  // Check for iCal links in the course data
  const renderCalendarLinks = () => {
    if (!courseData.calendar_links || courseData.calendar_links.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 flex flex-wrap gap-2">
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
                {link.title || "Download iCal"}
              </Button>
            </a>
          )
        ))}
      </div>
    );
  };

  return (
    <div>
      {isOldFormat ? renderOldScheduleFormat() : renderNewScheduleFormat()}
      {renderCalendarLinks()}
    </div>
  );
};
