
import React from "react";
import { ChevronLeft, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CourseDetail from "./CourseDetail";
import { Course } from "@/services/courseService";

interface CourseTab {
  course_id: string;
  name: string;
  details: Course | null;
}

interface CourseTabsViewProps {
  openTabs: CourseTab[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  handleCloseTab: (index: number, e: React.MouseEvent) => void;
  favorites: string[];
  isMobile: boolean;
}

const CourseTabsView: React.FC<CourseTabsViewProps> = ({
  openTabs,
  activeTabIndex,
  setActiveTabIndex,
  handleCloseTab,
  favorites,
  isMobile,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {isMobile && activeTabIndex !== -1 && (
        <div className="p-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center"
            onClick={() => setActiveTabIndex(-1)}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to courses
          </Button>
        </div>
      )}

      {favorites.length > 0 && (
        <Accordion type="single" collapsible className="w-full border-b">
          <AccordionItem value="calendar" className="border-0">
            <AccordionTrigger className="px-6 py-3">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Your Schedule
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <p className="text-sm mb-3">
                  Quick view of your upcoming course sessions:
                </p>
                <div className="flex justify-between mb-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/calendar">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Calendar View
                    </a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {openTabs.length > 0 ? (
        <>
          <div className="flex overflow-x-auto border-b">
            {openTabs.map((tab, index) => (
              <button
                key={`tab-${index}`}
                className={`flex items-center px-4 py-2 text-sm whitespace-nowrap ${
                  index === activeTabIndex
                    ? "bg-background border-b-2 border-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setActiveTabIndex(index)}
              >
                <span className="truncate max-w-[150px]">{tab.name}</span>
                <X
                  size={14}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={(e) => handleCloseTab(index, e)}
                />
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTabIndex >= 0 && openTabs[activeTabIndex] && (
              <CourseDetail
                course={openTabs[activeTabIndex].details}
                path={[]}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">
            Select a course to view details
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseTabsView;
