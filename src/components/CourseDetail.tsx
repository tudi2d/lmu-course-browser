
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Schedule {
  day: string;
  time_start: string;
  time_end: string;
  rhythm: string;
  first_date: string;
  last_date: string;
  room: string;
  room_link: string;
}

interface Course {
  number: string;
  name: string;
  type: string;
  url?: string;
  detail_url?: string;
  professor?: string | null;
  semester?: string;
  sws?: number;
  max_participants?: number;
  language?: string;
  schedule?: Schedule[];
  instructors?: string[];
  description?: string;
  literature?: string;
  requirements?: string;
  target_group?: string;
  registration_info?: string;
  evaluation_method?: string;
  faculties?: string[];
  departments?: string[];
  degree_programs?: string[];
  modules?: string[];
  registration_periods?: string[];
  has_content?: boolean;
  processing_date?: string;
  scrape_success?: boolean;
  error_message?: string;
}

interface CourseDetailProps {
  course: Course | null;
  path?: string[];
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, path }) => {
  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">Select a course to view details</p>
      </div>
    );
  }

  // Format breadcrumb from path
  const breadcrumb = path ? path.join(' / ') : '';

  return (
    <div className="p-8 animate-fade-in overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="text-xs tracking-wide text-muted-foreground mb-6">
            {breadcrumb}
          </div>
        )}
        
        {/* Course number badge */}
        {course.number && (
          <div className="inline-block bg-muted text-xs px-2 py-1 mb-3">
            {course.number}
          </div>
        )}
        
        {/* Course name */}
        <h1 className="text-2xl font-medium text-tree-gray mb-6">{course.name}</h1>
        
        {/* Meta information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          {course.professor && (
            <div className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Professor</h3>
              <p className="text-sm">{course.professor}</p>
            </div>
          )}
          
          {course.type && (
            <div className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Type</h3>
              <p className="text-sm">{course.type}</p>
            </div>
          )}
          
          {course.semester && (
            <div className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Semester</h3>
              <p className="text-sm">{course.semester}</p>
            </div>
          )}
          
          {course.language && (
            <div className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Language</h3>
              <p className="text-sm">{course.language}</p>
            </div>
          )}
        </div>
        
        {/* Schedule information */}
        {course.schedule && course.schedule.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Schedule</h2>
            {course.schedule.map((item, index) => (
              <div key={index} className="mb-4 bg-muted/20 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {item.day && (
                    <div>
                      <span className="text-xs text-muted-foreground">Day: </span>
                      <span className="text-sm">{item.day}</span>
                    </div>
                  )}
                  {item.time_start && (
                    <div>
                      <span className="text-xs text-muted-foreground">Time: </span>
                      <span className="text-sm">{item.time_start} {item.rhythm}</span>
                    </div>
                  )}
                  {item.room && (
                    <div>
                      <span className="text-xs text-muted-foreground">Room: </span>
                      <span className="text-sm">{item.room}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Description */}
        {course.description && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-3">Description</h2>
            <p className="text-sm leading-relaxed">{course.description}</p>
          </div>
        )}
        
        {/* Links */}
        {(course.url || course.detail_url) && (
          <div className="mt-8 pt-6 border-t border-muted">
            <h2 className="text-lg font-medium mb-3">Links</h2>
            <div className="flex flex-col gap-2">
              {course.url && (
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-tree-accent hover:underline"
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  Course Page
                </a>
              )}
              {course.detail_url && (
                <a 
                  href={course.detail_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-tree-accent hover:underline"
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  Course Details
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
