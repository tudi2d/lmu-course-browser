import { CourseNode } from "@/services/courseService";
import { isNodeFavorite } from "@/utils/tree-utils";

export function useFavoritesFilter() {
  // For favorites tab, filter to only keep nodes that are in favorites or have descendants in favorites
  const filterForFavorites = (node: CourseNode, favorites: string[]): CourseNode | null => {
    // Direct check if this node is a favorite course
    const isInFavorites = isNodeFavorite(node, favorites);
    
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
        const filteredChild = filterForFavorites(child, favorites);
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

  return { filterForFavorites };
}
