
import React, { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Calendar, Heart, Download, List, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseTree, fetchFavorites, Schedule, CourseTreeItem } from '@/services/courseService';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

type CalendarMode = 'week' | 'month';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('week');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  
  // Fetch course data
  const { data: courseTreeItems = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courseTree'],
    queryFn: fetchCourseTree
  });
  
  // Fetch favorites
  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites
  });

  // Extract all available faculties from courses
  const allFaculties = useMemo(() => {
    const facultiesSet = new Set<string>();
    courseTreeItems.forEach(item => {
      item.course.faculties?.forEach(faculty => {
        facultiesSet.add(faculty);
      });
    });
    return Array.from(facultiesSet);
  }, [courseTreeItems]);

  // Filter courses based on favorites and selected faculties
  const filteredCourses = useMemo(() => {
    return courseTreeItems.filter(item => {
      // Filter by favorites if enabled
      if (showFavoritesOnly && !favorites.includes(item.course.id!)) {
        return false;
      }
      
      // Filter by selected faculties if any are selected
      if (selectedFaculties.length > 0 && 
          (!item.course.faculties || 
           !item.course.faculties.some(faculty => selectedFaculties.includes(faculty)))) {
        return false;
      }
      
      // If course has no schedule, filter it out
      if (!item.course.schedule || item.course.schedule.length === 0) {
        return false;
      }
      
      return true;
    });
  }, [courseTreeItems, favorites, showFavoritesOnly, selectedFaculties]);

  // Generate calendar grid for the week view
  const weekDates = useMemo(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    return DAYS_OF_WEEK.map((_, index) => addDays(startDate, index));
  }, [currentDate]);

  // Toggle faculties in the filter
  const toggleFaculty = (faculty: string) => {
    setSelectedFaculties(prev => 
      prev.includes(faculty)
        ? prev.filter(f => f !== faculty)
        : [...prev, faculty]
    );
  };

  // Handle navigation
  const navigatePrevious = () => {
    if (calendarMode === 'week') {
      setCurrentDate(prev => addDays(prev, -7));
    } else {
      // For month view (will implement later)
      setCurrentDate(prev => addDays(prev, -30));
    }
  };

  const navigateNext = () => {
    if (calendarMode === 'week') {
      setCurrentDate(prev => addDays(prev, 7));
    } else {
      // For month view (will implement later)
      setCurrentDate(prev => addDays(prev, 30));
    }
  };

  // Export course schedule as iCal
  const exportCourseSchedule = (courseId?: string) => {
    try {
      let coursesToExport = courseTreeItems;
      
      // If a specific course ID is provided, export only that course
      if (courseId) {
        coursesToExport = courseTreeItems.filter(item => item.course.id === courseId);
      } 
      // If no ID is provided, but favorites only is enabled, export only favorites
      else if (showFavoritesOnly) {
        coursesToExport = courseTreeItems.filter(item => 
          favorites.includes(item.course.id!)
        );
      }
      
      if (coursesToExport.length === 0) {
        toast({
          title: "No courses to export",
          description: "There are no courses matching your criteria to export.",
          variant: "destructive",
        });
        return;
      }
      
      // Create iCal content (simplified version)
      let iCalContent = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//CourseCalendar//EN\r\n';
      
      coursesToExport.forEach(item => {
        const course = item.course;
        
        if (course.schedule && course.schedule.length > 0) {
          course.schedule.forEach(schedule => {
            if (schedule.first_date && schedule.day && schedule.time_start && schedule.time_end) {
              iCalContent += 'BEGIN:VEVENT\r\n';
              iCalContent += `SUMMARY:${course.name}\r\n`;
              iCalContent += `DESCRIPTION:${course.type || ''} - ${course.professor || ''}\r\n`;
              iCalContent += `LOCATION:${schedule.room || 'N/A'}\r\n`;
              // In a real implementation, we would need to calculate recurring dates based on rhythm
              // This is a simplified version
              iCalContent += `DTSTART:${schedule.first_date.replace(/-/g, '')}T${schedule.time_start.replace(/:/g, '')}00\r\n`;
              iCalContent += `DTEND:${schedule.first_date.replace(/-/g, '')}T${schedule.time_end.replace(/:/g, '')}00\r\n`;
              iCalContent += 'END:VEVENT\r\n';
            }
          });
        }
      });
      
      iCalContent += 'END:VCALENDAR';
      
      // Create a download link
      const blob = new Blob([iCalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = courseId ? `course_${courseId}.ics` : 'course_schedule.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Schedule exported",
        description: "Your course schedule has been exported as an iCal file.",
      });
    } catch (error) {
      console.error('Error exporting course schedule:', error);
      toast({
        title: "Export failed",
        description: "Failed to export course schedule.",
        variant: "destructive",
      });
    }
  };

  // Helper to check if a course is scheduled for a specific day and time
  const getCourseAtTimeSlot = (day: Date, hour: number) => {
    const courses: { item: CourseTreeItem; schedule: Schedule }[] = [];
    
    filteredCourses.forEach(item => {
      if (item.course.schedule) {
        item.course.schedule.forEach(schedule => {
          // Check if the course runs on this day of the week
          const scheduleDay = schedule.day?.toLowerCase();
          const currentDay = format(day, 'EEEE').toLowerCase();
          
          if (scheduleDay === currentDay) {
            // Parse the start and end times
            const startHour = parseInt(schedule.time_start?.split(':')[0] || '0', 10);
            const endHour = parseInt(schedule.time_end?.split(':')[0] || '0', 10);
            
            // Check if the current hour is within the course's time range
            if (hour >= startHour && hour < endHour) {
              courses.push({ item, schedule });
            }
          }
        });
      }
    });
    
    return courses;
  };

  return (
    <div className="h-screen flex flex-col bg-white p-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-medium">Course Calendar</h1>
          <Tabs value={calendarMode} onValueChange={(value) => setCalendarMode(value as CalendarMode)} className="ml-4">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month" disabled>Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuCheckboxItem
                checked={showFavoritesOnly}
                onCheckedChange={setShowFavoritesOnly}
              >
                Favorites only
              </DropdownMenuCheckboxItem>
              
              {allFaculties.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold">Faculties</div>
                  {allFaculties.map((faculty) => (
                    <DropdownMenuCheckboxItem
                      key={faculty}
                      checked={selectedFaculties.includes(faculty)}
                      onCheckedChange={() => toggleFaculty(faculty)}
                    >
                      {faculty}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={() => exportCourseSchedule()}>
            <Download className="h-4 w-4 mr-2" />
            Export iCal
          </Button>
          
          {/* View Toggle Button */}
          <Button variant="outline" size="sm" asChild>
            <a href="/">
              <List className="h-4 w-4 mr-2" />
              Course Browser
            </a>
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" onClick={navigatePrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <h2 className="text-lg font-medium">
          {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
        </h2>
        
        <Button variant="ghost" size="sm" onClick={navigateNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Calendar Grid - Week View */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 h-full border rounded-lg">
          {/* Time labels column */}
          <div className="border-r">
            <div className="h-12 border-b"></div> {/* Empty header cell */}
            {TIME_SLOTS.map(hour => (
              <div key={hour} className="h-20 border-b flex items-start justify-end p-2">
                <span className="text-xs text-muted-foreground">{hour}:00</span>
              </div>
            ))}
          </div>
          
          {/* Days columns */}
          {weekDates.map((date, dateIndex) => (
            <div key={dateIndex} className="border-r last:border-r-0">
              {/* Day header */}
              <div className="h-12 border-b flex flex-col items-center justify-center">
                <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
              </div>
              
              {/* Time slots */}
              {TIME_SLOTS.map(hour => {
                const coursesAtTimeSlot = getCourseAtTimeSlot(date, hour);
                return (
                  <div key={hour} className="h-20 border-b relative">
                    {coursesAtTimeSlot.map((courseData, idx) => (
                      <div 
                        key={`${courseData.item.course.id}-${idx}`}
                        className={cn(
                          "absolute inset-0 m-1 p-1 rounded-md flex flex-col overflow-hidden",
                          "bg-accent/10 text-accent-foreground border border-accent/20 hover:bg-accent/20 cursor-pointer"
                        )}
                        onClick={() => {
                          toast({
                            title: courseData.item.course.name,
                            description: `${courseData.schedule.day} ${courseData.schedule.time_start}-${courseData.schedule.time_end}, ${courseData.schedule.room || 'No room info'}`,
                          });
                        }}
                      >
                        <div className="text-xs font-medium truncate">{courseData.item.course.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {courseData.schedule.room || 'No room'} • {courseData.schedule.time_start}-{courseData.schedule.time_end}
                        </div>
                        <div className="flex mt-auto">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 ml-auto" 
                            onClick={(e) => {
                              e.stopPropagation();
                              exportCourseSchedule(courseData.item.course.id);
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading state */}
      {(isLoadingCourses || isLoadingFavorites) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-lg">Loading calendar data...</div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
