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

    let result = cloneTree(treeData);

    // If on favorites tab
    if (activeTab === "favorites") {
      if (favorites.length === 0) {
        console.log("No favorites - returning empty tree");
        // Return empty tree structure
        return {
          id: treeData.id,
          name: treeData.name,
          value: treeData.value,
          children: [],
        };
      }
      
      console.log("Filtering for favorites:", favorites);
      const favoritesResult = filterForFavorites(result, favorites);
      
      // CRITICAL FIX: Make sure we're not losing the root node structure
      if (favoritesResult) {
        result = favoritesResult;
      } else {
        // If nothing matched, return empty children but keep root structure
        result = {
          id: treeData.id,
          name: treeData.name,
          value: treeData.value,
          children: [],
        };
      }
      
      // If there's also a search query, filter the favorites result
      if (searchQuery && result) {
        console.log("Additionally filtering favorites by search");
        const searchResult = filterForSearch(result, searchQuery);
        if (searchResult) {
          result = searchResult;
        } else {
          // If nothing matched the search, return empty children
          result = {
            id: treeData.id,
            name: treeData.name,
            value: treeData.value,
            children: [],
          };
        }
      }
    }
    // If on all courses tab with search
    else if (searchQuery) {
      console.log("Filtering for search");
      const searchResult = filterForSearch(result, searchQuery);
      if (searchResult) {
        result = searchResult;
      } else {
        // If nothing matched the search, return empty children
        result = {
          id: treeData.id,
          name: treeData.name,
          value: treeData.value,
          children: [],
        };
      }
    }

    console.log("Filtering result:", {
      hasChildren: result?.children?.length > 0,
      childrenCount: result?.children?.length || 0
    });
    
    return result;
  }, [treeData, searchQuery, activeTab, favorites, filterForSearch, filterForFavorites]);

  return filteredTreeData;
}
