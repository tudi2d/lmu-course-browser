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
      favorites: favorites,
    });

    // Start with a clone of the original tree
    let result = cloneTree(treeData);

    // Apply search filter if needed
    if (searchQuery) {
      console.log("Filtering for search");
      const searchResult = filterForSearch(result, searchQuery);
      if (searchResult) {
        result = searchResult;
      }
    }

    console.log("Filtering result:", {
      hasChildren: result?.children?.length > 0,
      childrenCount: result?.children?.length || 0,
      result: result,
    });

    return result;
  }, [treeData, searchQuery, filterForSearch]);

  return filteredTreeData;
}
