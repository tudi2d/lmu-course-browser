
import React from "react";
import CourseTabsView from "../CourseTabsView";

interface ContentAreaProps {
  sidebarCollapsed: boolean;
  isMobile: boolean;
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  handleCloseTab: (index: number, e: React.MouseEvent) => void;
  favorites: string[];
  onToggleFavorite: (courseId: string, isFavorited: boolean) => void;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  sidebarCollapsed,
  isMobile,
  openTabs,
  activeTabIndex,
  setActiveTabIndex,
  handleCloseTab,
  favorites,
  onToggleFavorite,
}) => {
  return (
    <div
      className={`bg-white transition-all duration-300 ${
        sidebarCollapsed
          ? "w-full"
          : isMobile
          ? "w-full"
          : "w-full md:w-1/2 lg:w-2/3"
      } flex flex-col`}
      style={isMobile ? { minHeight: "100vh" } : {}}
    >
      <CourseTabsView
        openTabs={openTabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        handleCloseTab={handleCloseTab}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ContentArea;
