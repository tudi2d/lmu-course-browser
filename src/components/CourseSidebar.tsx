import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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
  // Debug favorites data directly
  useEffect(() => {
    if (activeTab === "favorites") {
      console.log("Favorites tab selected with favorites:", favorites);
      console.log("Filtered tree data:", filteredTreeData);
    }
  }, [activeTab, favorites, filteredTreeData]);

  return (
    <div className="flex flex-col h-full w-full">
      <CourseSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
        isMobile={isMobile}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="all-courses">
            Alle Kurse
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="favorites">
            Favoriten {favorites.length > 0 && `(${favorites.length})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-y-auto h-full relative">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Kurse werden geladen...
          </div>
        ) : (
          <>
            {activeTab === "favorites" && !user && (
              <div className="p-4 text-sm bg-muted/30 border-b">
                <p className="text-muted-foreground mb-2">
                  <strong>Hinweis:</strong> Melde dich an, um deine Favoriten
                  dauerhaft zu speichern.
                </p>
                <Button
                  onClick={() => {
                    const signInButton = document.querySelector(
                      '[aria-label="Anmelden"]'
                    );
                    if (signInButton && "click" in signInButton) {
                      (signInButton as HTMLElement).click();
                    }
                  }}
                  className="gap-2"
                  size="sm"
                  variant="outline"
                >
                  <User size={14} />
                  Anmelden
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
            ) : filteredTreeData &&
              filteredTreeData.children &&
              filteredTreeData.children.length > 0 ? (
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
                Keine Kurse gefunden
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
