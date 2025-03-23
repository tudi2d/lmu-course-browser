import { CourseNode } from "@/services/courseService";
import { nodeMatchesSearch } from "@/utils/tree-utils";

export function useSearchFilter() {
  // For search filtering, keep nodes that match search or have descendants that match
  const filterForSearch = (node: CourseNode, searchQuery: string): CourseNode | null => {
    // If this node or any of its descendants match the search, process it
    if (!nodeMatchesSearch(node, searchQuery)) {
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
        const filteredChild = filterForSearch(child, searchQuery);
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

  return { filterForSearch };
}
