
import React from "react";
import { Course } from "@/services/types";
import { ScheduleTable } from "./schedule/ScheduleTable";
import { CalendarLinks } from "./schedule/CalendarLinks";
import { isOldScheduleFormat } from "./schedule/ScheduleUtils";

interface CourseScheduleTabProps {
  courseData: Course;
}

export const CourseScheduleTab: React.FC<CourseScheduleTabProps> = ({ courseData }) => {
  if (!courseData.schedule || !Array.isArray(courseData.schedule) || courseData.schedule.length === 0) {
    return <p className="text-muted-foreground">No schedule information available.</p>;
  }

  // Check if we're using the old schedule format
  const isOldFormat = courseData.schedule.length > 0 && isOldScheduleFormat(courseData.schedule[0]);

  return (
    <div className="space-y-4">
      <ScheduleTable 
        scheduleItems={courseData.schedule} 
        calendarLinks={courseData.calendar_links}
        isOldFormat={isOldFormat}
      />
      <CalendarLinks 
        calendarLinks={courseData.calendar_links || []} 
        scheduleLength={courseData.schedule.length}
      />
    </div>
  );
};
