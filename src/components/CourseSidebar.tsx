
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CourseSearch from "./CourseSearch";
import CourseTreeRenderer from "./CourseTreeRenderer";
import FavoritesList from "./FavoritesList";
import { CourseNode } from "@/services/courseService";

interface CourseSidebarProps {
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
  isMobile?: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
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
  isMobile = false,
}) => {
  const [searchOpen, setSearchOpen] = useState(!isMobile);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Search section - collapsible on mobile */}
      {isMobile ? (
        <Collapsible open={searchOpen} onOpenChange={setSearchOpen}>
          <CollapsibleTrigger asChild>
            <div className="border-b border-muted p-3 flex justify-between items-center cursor-pointer">
              <span className="font-medium text-sm">Search Courses</span>
              {searchOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CourseSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              clearSearch={clearSearch}
            />
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <CourseSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
        />
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="all-courses">
            All Courses
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="favorites">
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-grow overflow-y-auto relative h-[calc(100%-88px)]">
        <div className="h-full">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">
              Loading courses...
            </div>
          ) : (
            <>
              {activeTab === "favorites" && !user && (
                <div className="p-4 text-sm bg-muted/30 border-b">
                  <p className="text-muted-foreground mb-2">
                    <strong>Note:</strong> Sign in to save your favorites permanently.
                  </p>
                  <Button 
                    onClick={() => {
                      const signInButton = document.querySelector('[aria-label="Sign In"]');
                      if (signInButton && 'click' in signInButton) {
                        (signInButton as HTMLElement).click();
                      }
                    }}
                    className="gap-2"
                    size="sm"
                    variant="outline"
                  >
                    <User size={14} />
                    Sign In
                  </Button>
                </div>
              )}
              
              {activeTab === "favorites" ? (
                <FavoritesList
                  favorites={favorites}
                  courseNames={courseNames}
                  openTabs={openTabs}
                  handleOpenCourse={handleOpenCourse}
                />
              ) : filteredTreeData && filteredTreeData.children && filteredTreeData.children.length > 0 ? (
                filteredTreeData.children.map((childNode) => (
                  <CourseTreeRenderer
                    key={childNode.name}
                    node={childNode}
                    expandedNodes={expandedNodes}
                    searchQuery={searchQuery}
                    openTabs={openTabs}
                    favorites={favorites}
                    handleNodeToggle={handleNodeToggle}
                    handleOpenCourse={handleOpenCourse}
                  />
                ))
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  No courses found
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CourseSidebar;
