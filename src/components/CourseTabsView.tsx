
import React from "react";
import { X } from "lucide-react";
import CourseDetail from "./course-detail";
import { Button } from "@/components/ui/button";

interface CourseTabsViewProps {
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  handleCloseTab: (index: number, e: React.MouseEvent) => void;
  favorites: string[];
  onToggleFavorite?: (courseId: string, isFavorited: boolean) => void;
  isMobile?: boolean;
}

const CourseTabsView: React.FC<CourseTabsViewProps> = ({
  openTabs,
  activeTabIndex,
  setActiveTabIndex,
  handleCloseTab,
  favorites,
  onToggleFavorite,
  isMobile = false,
}) => {
  if (openTabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">
          Select a course from the left panel to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className={`border-b flex overflow-x-auto ${isMobile ? 'pb-1' : ''}`}>
        {openTabs.map((tab, index) => (
          <div
            key={tab.course_id}
            className={`border-r flex items-center cursor-pointer px-4 py-2 text-sm whitespace-nowrap ${
              activeTabIndex === index
                ? "bg-white font-medium"
                : "bg-gray-50 text-muted-foreground hover:bg-gray-100"
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            <span className="truncate max-w-[150px]">{tab.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 ml-2 h-auto w-auto"
              onClick={(e) => handleCloseTab(index, e)}
              aria-label={`Close ${tab.name} tab`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex-grow h-full overflow-hidden relative">
        {openTabs.map((tab, index) => (
          <div
            key={tab.course_id}
            className={`absolute inset-0 ${
              activeTabIndex === index ? "block" : "hidden"
            }`}
          >
            <CourseDetail 
              course={tab.details} 
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseTabsView;
