
import React, { useState, useEffect } from 'react';
import TreeNode from './TreeNode';
import CourseDetail from './CourseDetail';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { fetchCourseTree, CourseTreeItem } from '@/services/courseService';
import { toast } from '@/components/ui/use-toast';

interface TreeNode {
  name: string;
  children: { [key: string]: TreeNode };
  courses: CourseTreeItem[];
}

const TreeBrowser: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode>({ name: 'root', children: {}, courses: [] });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<CourseTreeItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Fetch course data from Supabase
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      try {
        const courseTreeData = await fetchCourseTree();
        if (courseTreeData.length > 0) {
          const builtTree = buildTree(courseTreeData);
          setTreeData(builtTree);
          
          // Auto-expand first level
          const firstLevelNodes = new Set<string>();
          courseTreeData.forEach(item => {
            if (item.path[0]) {
              firstLevelNodes.add(item.path[0]);
            }
          });
          setExpandedNodes(firstLevelNodes);
        } else {
          toast({
            title: "No courses found",
            description: "The course database is empty.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        toast({
          title: "Error loading courses",
          description: "Could not load course data from the database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCourseData();
  }, []);
  
  // Build tree data from flat data
  const buildTree = (courseItems: CourseTreeItem[]) => {
    const root: TreeNode = { name: 'root', children: {}, courses: [] };
    
    courseItems.forEach(item => {
      let currentNode = root;
      
      // Add path nodes
      item.path.forEach((pathPart, idx) => {
        if (!currentNode.children[pathPart]) {
          currentNode.children[pathPart] = { name: pathPart, children: {}, courses: [] };
        }
        currentNode = currentNode.children[pathPart];
        
        // Add course to leaf node
        if (idx === item.path.length - 1) {
          currentNode.courses.push(item);
        }
      });
    });
    
    return root;
  };
  
  const handleNodeToggle = (nodePath: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };
  
  const renderTreeNodes = (node: TreeNode, level: number = 0, parentPath: string[] = []) => {
    if (!node) return null;
    
    const nodeEntries = Object.entries(node.children);
    
    // Filter nodes if search query exists
    const filteredEntries = searchQuery
      ? nodeEntries.filter(([name]) => 
          name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : nodeEntries;
    
    return (
      <>
        {filteredEntries.map(([name, childNode]) => {
          const currentPath = [...parentPath, name];
          const nodePath = currentPath.join('/');
          const isExpanded = expandedNodes.has(name) || expandedNodes.has(nodePath);
          const hasChildren = Object.keys(childNode.children).length > 0;
          const hasCourses = childNode.courses.length > 0;
          
          return (
            <React.Fragment key={nodePath}>
              <TreeNode
                name={name}
                level={level}
                hasChildren={hasChildren || hasCourses}
                isExpanded={isExpanded}
                isActive={selectedCourse?.path.join('/') === currentPath.join('/')}
                onToggle={() => handleNodeToggle(nodePath)}
                onClick={() => handleNodeToggle(nodePath)}
              >
                {isExpanded && hasChildren && renderTreeNodes(childNode, level + 1, currentPath)}
                {isExpanded && hasCourses && childNode.courses.map((courseItem, index) => (
                  <div key={`course-${index}`} className="animate-slide-in">
                    <TreeNode
                      name={courseItem.course.name}
                      level={level + 1}
                      hasChildren={false}
                      isActive={selectedCourse === courseItem}
                      onToggle={() => {}}
                      onClick={() => setSelectedCourse(courseItem)}
                    />
                  </div>
                ))}
              </TreeNode>
            </React.Fragment>
          );
        })}
      </>
    );
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar / Tree View */}
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-0' : 'w-full sm:w-1/2 md:w-1/3 lg:w-3/10'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Search bar */}
          <div className="p-4 border-b border-muted">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/20 border-0 rounded-sm pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-tree-accent transition-shadow"
              />
            </div>
          </div>
          
          {/* Tree navigation */}
          <div className="overflow-y-auto h-full">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">Loading courses...</div>
            ) : (
              renderTreeNodes(treeData)
            )}
          </div>
        </div>
      </div>
      
      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-1.5 rounded-r-sm hover:bg-muted transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight size={16} className="text-tree-gray" />
        ) : (
          <ChevronLeft size={16} className="text-tree-gray" />
        )}
      </button>
      
      {/* Content View */}
      <div className={`bg-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-full' : 'w-full sm:w-1/2 md:w-2/3 lg:w-7/10'
      }`}>
        <CourseDetail 
          course={selectedCourse?.course ?? null} 
          path={selectedCourse?.path}
        />
      </div>
    </div>
  );
};

export default TreeBrowser;
