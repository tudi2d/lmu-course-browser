
import { useMemo } from "react";
import { CourseNode } from "@/services/courseService";
import { cloneTree } from "@/utils/tree-utils";
import { useSearchFilter } from "./filters/use-search-filter";
import { useFavoritesFilter } from "./filters/use-favorites-filter";

export function useFilteredTree(
  treeData: CourseNode | null,
  searchQuery: string,
  activeTab: string,
  favorites: string[]
) {
  const { filterForSearch } = useSearchFilter();
  const { filterForFavorites } = useFavoritesFilter();
  
  const filteredTreeData = useMemo(() => {
    if (!treeData) return null;
    
    console.log("Filtering tree with:", {
      searchQuery,
      activeTab,
      favoritesCount: favorites.length,
      favorites: favorites
    });

    // Start with a clone of the original tree
    let result = cloneTree(treeData);

    // Apply filters based on the active tab
    if (activeTab === "favorites") {
      // Filter for favorites first
      if (favorites.length === 0) {
        // If no favorites, return empty tree
        console.log("No favorites - returning empty tree");
        return {
          ...result,
          children: []
        };
      }
      
      console.log("Filtering for favorites:", favorites);
      // Apply favorites filter
      result = filterForFavorites(result, favorites);
      
      // Then apply search filter if needed
      if (searchQuery) {
        console.log("Additionally filtering favorites by search");
        const searchResult = filterForSearch(result, searchQuery);
        if (searchResult) {
          result = searchResult;
        }
      }
    } 
    // All courses tab with search
    else if (searchQuery) {
      console.log("Filtering for search");
      const searchResult = filterForSearch(result, searchQuery);
      if (searchResult) {
        result = searchResult;
      }
    }

    console.log("Filtering result:", {
      hasChildren: result?.children?.length > 0,
      childrenCount: result?.children?.length || 0,
      result: result
    });
    
    return result;
  }, [treeData, searchQuery, activeTab, favorites, filterForSearch, filterForFavorites]);

  return filteredTreeData;
}
