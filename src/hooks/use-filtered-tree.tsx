
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

    const nodeMatchesFavorites = (node: CourseNode): boolean => {
      // If not filtering by favorites, return true
      if (activeTab !== "favorites") return true;

      // If this node is a course and is in favorites, return true
      if (node.value && favorites.includes(node.value)) {
        return true;
      }

      // If any children match favorites, return true
      if (node.children) {
        for (const child of node.children) {
          if (nodeMatchesFavorites(child)) {
            return true;
          }
        }
      }

      return false;
    };

    const filterNode = (node: CourseNode): CourseNode | null => {
      // For favorites tab, only check favorites match if we have favorites
      if (activeTab === "favorites") {
        if (favorites.length === 0) {
          // If we're on favorites tab but have no favorites, return empty tree
          return {
            id: node.id,
            name: node.name,
            value: node.value,
            children: [],
          };
        }
        
        if (!nodeMatchesFavorites(node)) {
          return null;
        }
        
        // If we have search query, also check search match
        if (searchQuery && !nodeMatchesSearch(node)) {
          return null;
        }
      } 
      // For all-courses tab with search
      else if (searchQuery && !nodeMatchesSearch(node)) {
        return null;
      }

      // Create a new node with filtered children
      const filteredNode: CourseNode = {
        id: node.id,
        name: node.name,
        value: node.value,
        children: [],
      };

      // Filter children
      if (node.children) {
        node.children.forEach((child) => {
          const filteredChild = filterNode(child);
          if (filteredChild) {
            if (!filteredNode.children) filteredNode.children = [];
            filteredNode.children.push(filteredChild);
          }
        });
      }

      // Don't return nodes that have no value (aren't courses) and have no children
      if (!filteredNode.value && (!filteredNode.children || filteredNode.children.length === 0)) {
        return null;
      }

      return filteredNode;
    };

    return filterNode(treeData);
  }, [treeData, searchQuery, activeTab, favorites]);

  return filteredTreeData;
}
