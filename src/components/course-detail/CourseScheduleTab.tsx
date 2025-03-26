
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/services/types";

interface CourseScheduleTabProps {
  courseData: Course;
}

export const CourseScheduleTab: React.FC<CourseScheduleTabProps> = ({ courseData }) => {
  if (!courseData.schedule || !Array.isArray(courseData.schedule) || courseData.schedule.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No schedule information available.
      </p>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseData.schedule.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.day || "—"}</TableCell>
              <TableCell>
                {item.time_start}{" "}
                {item.time_end ? `- ${item.time_end}` : ""}{" "}
                {item.rhythm}
              </TableCell>
              <TableCell>{item.room || "—"}</TableCell>
              <TableCell>
                {courseData.calendar_links && courseData.calendar_links[index]?.url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-tree-accent"
                    asChild
                  >
                    <a 
                      href={courseData.calendar_links[index].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Calendar size={14} className="mr-1.5" />
                      iCal
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    disabled
                  >
                    <Calendar size={14} className="mr-1.5" />
                    No iCal
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 text-sm text-muted-foreground">
        {courseData.schedule[0].first_date && (
          <p>First Date: {courseData.schedule[0].first_date}</p>
        )}
        {courseData.schedule[0].last_date && (
          <p>Last Date: {courseData.schedule[0].last_date}</p>
        )}
      </div>
    </div>
  );
};
