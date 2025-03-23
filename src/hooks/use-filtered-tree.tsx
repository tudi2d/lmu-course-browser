
import { useMemo } from "react";
import { CourseNode } from "@/services/courseService";

export function useFilteredTree(
  treeData: CourseNode | null,
  searchQuery: string,
  activeTab: string,
  favorites: string[]
) {
  const filteredTreeData = useMemo(() => {
    if (!searchQuery && activeTab === "all-courses") {
      return treeData;
    }

    if (!treeData) return null;

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
      if (activeTab !== "favorites") return true;

      if (node.value && favorites.includes(node.value)) {
        return true;
      }

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
      // For favorites tab without search, only check favorites match
      if (activeTab === "favorites" && !searchQuery) {
        if (!nodeMatchesFavorites(node)) {
          return null;
        }
      } 
      // For combined favorites and search
      else if (activeTab === "favorites" && searchQuery) {
        if (!nodeMatchesFavorites(node) || !nodeMatchesSearch(node)) {
          return null;
        }
      }
      // For all-courses tab with search
      else if (searchQuery && !nodeMatchesSearch(node)) {
        return null;
      }

      const filteredNode: CourseNode = {
        id: node.id,
        name: node.name,
        value: node.value,
        children: [],
      };

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
