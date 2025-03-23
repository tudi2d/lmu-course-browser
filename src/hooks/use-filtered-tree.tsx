import { useMemo } from "react";
import { CourseNode } from "@/services/courseService";

export function useFilteredTree(
  treeData: CourseNode | null,
  searchQuery: string,
  activeTab: string,
  favorites: string[]
) {
  const filteredTreeData = useMemo(() => {
    if (!treeData) return null;
    
    console.log("Filtering tree with:", {
      searchQuery,
      activeTab,
      favoritesCount: favorites.length,
      favorites: favorites
    });

    // Create deep copy of the tree so we don't modify the original
    const cloneTree = (node: CourseNode): CourseNode => {
      return {
        id: node.id,
        name: node.name,
        value: node.value,
        children: node.children ? node.children.map(child => cloneTree(child)) : []
      };
    };

    // Check if node or any of its descendants match the search query
    const nodeMatchesSearch = (node: CourseNode): boolean => {
      if (!searchQuery) return true;

      const nameMatches = node.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (nameMatches) return true;

      if (node.children) {
        for (const child of node.children) {
          if (nodeMatchesSearch(child)) {
            return true;
          }
        }
      }

      return false;
    };

    // CRITICAL FIX: This is a direct check if a node is a favorite
    const isNodeFavorite = (node: CourseNode): boolean => {
      return node.value !== undefined && favorites.includes(node.value);
    };

    // Check if this node or any of its descendants are in favorites
    const nodeHasFavorites = (node: CourseNode): boolean => {
      // If this node is a course and is in favorites, return true
      if (isNodeFavorite(node)) {
        return true;
      }

      // If any children have favorites, return true
      if (node.children) {
        for (const child of node.children) {
          if (nodeHasFavorites(child)) {
            return true;
          }
        }
      }

      return false;
    };

    // For favorites tab, filter to only keep nodes that are in favorites or have descendants in favorites
    const filterForFavorites = (node: CourseNode): CourseNode | null => {
      // Direct check if this node is a favorite course
      const isInFavorites = isNodeFavorite(node);
      
      if (isInFavorites) {
        console.log("Found favorite node:", node.name, node.value);
      }

      // New node with same properties but empty children
      const filteredNode: CourseNode = {
        id: node.id,
        name: node.name,
        value: node.value,
        children: [],
      };

      // Process children recursively
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const filteredChild = filterForFavorites(child);
          if (filteredChild) {
            if (!filteredNode.children) filteredNode.children = [];
            filteredNode.children.push(filteredChild);
          }
        }
      }

      // Return this node if it's a favorite OR has children with favorites
      if (isInFavorites || (filteredNode.children && filteredNode.children.length > 0)) {
        return filteredNode;
      }

      return null;
    };

    // For search filtering, keep nodes that match search or have descendants that match
    const filterForSearch = (node: CourseNode): CourseNode | null => {
      // If this node or any of its descendants match the search, process it
      if (!nodeMatchesSearch(node)) {
        return null;
      }

      // Create filtered node
      const filteredNode: CourseNode = {
        id: node.id,
        name: node.name,
        value: node.value,
        children: [],
      };

      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          const filteredChild = filterForSearch(child);
          if (filteredChild) {
            if (!filteredNode.children) filteredNode.children = [];
            filteredNode.children.push(filteredChild);
          }
        });
      }

      // Only include non-course nodes if they have children that match
      if (!node.value && (!filteredNode.children || filteredNode.children.length === 0)) {
        return null;
      }

      return filteredNode;
    };

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
      const favoritesResult = filterForFavorites(result);
      
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
        const searchResult = filterForSearch(result);
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
      const searchResult = filterForSearch(result);
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
  }, [treeData, searchQuery, activeTab, favorites]);

  return filteredTreeData;
}
