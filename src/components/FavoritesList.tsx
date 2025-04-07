
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fetchCourseTree, CourseNode } from "@/services/courseService";

interface FavoritesListProps {
  favorites: string[];
  courseNames: Record<string, string>;
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  handleOpenCourse: (courseId: string, courseName: string) => void;
}

interface FavoriteItem {
  course_id: string;
  name: string | null;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  courseNames,
  openTabs,
  handleOpenCourse,
}) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [treeNames, setTreeNames] = useState<Record<string, string>>({});

  // Function to find a course name in the tree by ID
  const findCourseNameInTree = (node: CourseNode, id: string, namesMap: Record<string, string>): void => {
    if (node.value === id) {
      namesMap[id] = node.name;
    }
    
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        findCourseNameInTree(child, id, namesMap);
      }
    }
  };

  // Fetch course names from tree for any missing names
  useEffect(() => {
    const fetchTreeNames = async () => {
      try {
        // Only fetch tree data if we have favorites without names
        const missingNames = favorites.filter(id => !courseNames[id]);
        if (missingNames.length === 0) return;
        
        console.log("Fetching tree data for missing course names:", missingNames);
        const treeData = await fetchCourseTree();
        
        const namesMap: Record<string, string> = {};
        for (const id of missingNames) {
          findCourseNameInTree(treeData, id, namesMap);
        }
        
        console.log("Found names in tree:", namesMap);
        setTreeNames(namesMap);
      } catch (error) {
        console.error("Error fetching course names from tree:", error);
      }
    };

    fetchTreeNames();
  }, [favorites, courseNames]);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // For authenticated users, fetch from database with names
          const { data, error } = await supabase
            .from('favorites')
            .select('course_id, name')
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error fetching favorite details:', error);
          } else if (data) {
            console.log('Fetched favorite details:', data);
            setFavoriteItems(data);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to using local favorites and course names from props
        const items = favorites.map(courseId => ({
          course_id: courseId,
          name: courseNames[courseId] || treeNames[courseId] || null
        }));
        
        setFavoriteItems(items);
      } catch (error) {
        console.error('Error in fetchFavoriteDetails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteDetails();
  }, [favorites, courseNames, treeNames]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading favorites...
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        You don't have any favorite courses yet. Browse courses and
        click the heart icon to add favorites.
      </div>
    );
  }

  return (
    <div className="p-2">
      <ul className="space-y-1">
        {favoriteItems.map((item) => {
          const courseId = item.course_id;
          const displayName = item.name || courseNames[courseId] || treeNames[courseId] || courseId;
          const isActive = openTabs.some((tab) => tab.course_id === courseId);
          
          return (
            <li key={courseId}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left px-3 py-2 h-auto ${
                  isActive ? 'bg-muted' : ''
                }`}
                onClick={() => handleOpenCourse(courseId, displayName)}
              >
                <span className="truncate">{displayName}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoritesList;
