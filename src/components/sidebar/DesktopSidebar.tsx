
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseSidebar from "../CourseSidebar";
import { CourseNode } from "@/services/courseService";

interface DesktopSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  filteredTreeData: CourseNode | null;
  expandedNodes: Set<string>;
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  favorites: string[];
  courseNames: Record<string, string>;
  handleNodeToggle: (nodePath: string) => void;
  handleOpenCourse: (courseId: string, courseName: string) => void;
  user: any;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  loading,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  clearSearch,
  filteredTreeData,
  expandedNodes,
  openTabs,
  favorites,
  courseNames,
  handleNodeToggle,
  handleOpenCourse,
  user,
}) => {
  return (
    <>
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? "w-0"
            : "w-full md:w-1/2 lg:w-1/3"
        } flex`}
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
          courseNames={courseNames}
          handleNodeToggle={handleNodeToggle}
          handleOpenCourse={handleOpenCourse}
          user={user}
        />
      </div>

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
    </>
  );
};

export default DesktopSidebar;
