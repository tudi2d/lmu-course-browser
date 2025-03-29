
import React from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import CourseSidebar from "../CourseSidebar";
import { CourseNode } from "@/services/courseService";

interface MobileSidebarProps {
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
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

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  mobileDrawerOpen,
  setMobileDrawerOpen,
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
    <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
      <DrawerContent className="h-[85vh] px-0 pt-0 bg-white">
        <div className="h-full overflow-hidden">
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
            handleOpenCourse={(courseId, courseName) => {
              handleOpenCourse(courseId, courseName);
              setMobileDrawerOpen(false);
            }}
            user={user}
            isMobile={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;
