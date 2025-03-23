
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourseTree } from "@/hooks/use-course-tree";
import { useCourseFavorites } from "@/hooks/use-course-favorites";
import { useCourseSearch } from "@/hooks/use-course-search";
import { useCourseTabs } from "@/hooks/use-course-tabs";
import { useFilteredTree } from "@/hooks/use-filtered-tree";
import CourseSidebar from "./CourseSidebar";
import CourseTabsView from "./CourseTabsView";

const TreeBrowser: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Use custom hooks to manage different aspects of state
  const { treeData, loading } = useCourseTree();
  const { favorites, user } = useCourseFavorites();
  const { 
    searchQuery, 
    debouncedSearchQuery, 
    expandedNodes, 
    setSearchQuery, 
    handleNodeToggle, 
    clearSearch 
  } = useCourseSearch(treeData);
  
  const { 
    openTabs, 
    activeTabIndex, 
    activeTab, 
    setActiveTab, 
    handleOpenCourse, 
    handleCloseTab, 
    setActiveTabIndex 
  } = useCourseTabs();
  
  // Get filtered tree data
  const filteredTreeData = useFilteredTree(treeData, searchQuery, activeTab, favorites);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? "w-0"
            : isMobile
            ? "w-full h-1/2"
            : "w-full md:w-1/2 lg:w-1/3"
        } ${isMobile && activeTabIndex !== -1 ? "hidden" : "flex"}`}
      >
        <CourseSidebar
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          filteredTreeData={filteredTreeData}
          expandedNodes={expandedNodes}
          openTabs={openTabs}
          favorites={favorites}
          handleNodeToggle={handleNodeToggle}
          handleOpenCourse={handleOpenCourse}
          user={user}
        />
      </div>

      {!isMobile && (
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-1.5 rounded-r-sm hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} className="text-tree-gray" />
          ) : (
            <ChevronLeft size={16} className="text-tree-gray" />
          )}
        </button>
      )}

      <div
        className={`bg-white transition-all duration-300 ${
          sidebarCollapsed
            ? "w-full"
            : isMobile
            ? "w-full h-1/2"
            : "w-full md:w-1/2 lg:w-2/3"
        } ${isMobile && activeTabIndex === -1 ? "hidden" : "flex flex-col"}`}
      >
        <CourseTabsView
          openTabs={openTabs}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          handleCloseTab={handleCloseTab}
          favorites={favorites}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default TreeBrowser;
