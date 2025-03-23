import React, { useState, useEffect, useCallback, useMemo } from "react";
import TreeNode from "./TreeNode";
import CourseDetail from "./CourseDetail";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar as CalendarIcon,
  X,
  User,
  LogOut,
} from "lucide-react";
import {
  fetchCourseTree,
  fetchCourseDetails,
  fetchFavorites,
  CourseNode,
} from "@/services/courseService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import CalendarModal from "./CalendarModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CourseTab {
  course_id: string;
  name: string;
  details: unknown | null;
}

const TreeBrowser: React.FC = () => {
  const [treeData, setTreeData] = useState<CourseNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [openTabs, setOpenTabs] = useState<CourseTab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(-1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all-courses");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const isMobile = useIsMobile();

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      try {
        const courseTreeData = await fetchCourseTree();
        setTreeData(courseTreeData);
      } catch (error) {
        console.error("Error loading course data:", error);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const userFavorites = await fetchFavorites();
          setFavorites(userFavorites);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      } else {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      }
      
      setAuthDialogOpen(false);
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const loadCourseDetails = async (courseId: string) => {
    if (courseId) {
      try {
        const details = await fetchCourseDetails(courseId);
        return details;
      } catch (error) {
        console.error("Error loading course details:", error);
        return null;
      }
    }
    return null;
  };

  const handleOpenCourse = async (courseId: string, courseName: string) => {
    const existingTabIndex = openTabs.findIndex(
      (tab) => tab.course_id === courseId
    );

    if (existingTabIndex !== -1) {
      setActiveTabIndex(existingTabIndex);
    } else {
      const details = await loadCourseDetails(courseId);
      setOpenTabs((prev) => [
        ...prev,
        { course_id: courseId, name: courseName, details },
      ]);
      setActiveTabIndex((prev) => prev + 1);
    }
  };

  const handleCloseTab = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    setOpenTabs((prev) => {
      const newTabs = [...prev];
      newTabs.splice(index, 1);
      return newTabs;
    });

    if (index === activeTabIndex) {
      if (index > 0) {
        setActiveTabIndex(index - 1);
      } else if (openTabs.length > 1) {
        setActiveTabIndex(0);
      } else {
        setActiveTabIndex(-1);
      }
    } else if (index < activeTabIndex) {
      setActiveTabIndex((prev) => prev - 1);
    }
  };

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
      if (!nodeMatchesSearch(node) || !nodeMatchesFavorites(node)) {
        return null;
      }

      const filteredNode: CourseNode = {
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

      return filteredNode;
    };

    return filterNode(treeData);
  }, [treeData, searchQuery, activeTab, favorites]);

  const handleNodeToggle = (nodePath: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };

  const renderTreeNodes = (
    node: CourseNode | null,
    level: number = 0,
    parentPath: string[] = []
  ) => {
    if (!node) return null;

    const nodePath = [...parentPath, node.name].join("/");
    const isExpanded =
      expandedNodes.has(node.name) || expandedNodes.has(nodePath);
    const hasChildren = node.children && node.children.length > 0;
    const isCourse = node.value !== undefined;

    return (
      <React.Fragment key={nodePath}>
        <TreeNode
          name={node.name}
          level={level}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          isActive={
            isCourse && openTabs.some((tab) => tab.course_id === node.value)
          }
          isHighlighted={
            searchQuery &&
            node.name.toLowerCase().includes(searchQuery.toLowerCase())
          }
          isFavorite={
            isCourse &&
            node.value !== undefined &&
            favorites.includes(node.value)
          }
          onToggle={() => handleNodeToggle(nodePath)}
          onClick={() => {
            if (isCourse && node.value) {
              handleOpenCourse(node.value, node.name);
            } else {
              handleNodeToggle(nodePath);
            }
          }}
        >
          {isExpanded &&
            hasChildren &&
            node.children?.map((childNode) =>
              renderTreeNodes(childNode, level + 1, [...parentPath, node.name])
            )}
        </TreeNode>
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? "w-0"
            : isMobile
            ? "w-full h-1/2"
            : "w-full md:w-1/2 lg:w-1/3"
        } ${isMobile && activeTabIndex !== -1 ? "hidden" : "flex"}`}
      >
        <div className="flex flex-col h-full w-full">
          <div className="p-4 border-b border-muted flex justify-between items-center">
            <div className="relative flex-1 mr-2">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2"
              />
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAuthDialogOpen(true)}
                className="whitespace-nowrap"
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="all-courses">
                All Courses
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="favorites">
                Favorites
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "favorites" && (
            <div className="p-2 border-b border-muted">
              <CalendarModal />
            </div>
          )}

          <div className="overflow-y-auto h-full relative">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading courses...
              </div>
            ) : (
              <>
                {activeTab === "favorites" && !user && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
                    <h3 className="text-lg font-medium mb-2">Sign in to add favorites</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Create an account to save your favorite courses
                    </p>
                    <Button 
                      onClick={() => setAuthDialogOpen(true)}
                      className="gap-2"
                    >
                      <User size={16} />
                      Sign In
                    </Button>
                  </div>
                )}
                
                {activeTab === "favorites" && user && favorites.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    You don't have any favorite courses yet. Browse courses and
                    click the heart icon to add favorites.
                  </div>
                ) : filteredTreeData ? (
                  filteredTreeData.children?.map((childNode) =>
                    renderTreeNodes(childNode, 0)
                  )
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    No courses found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {!isMobile && (
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
      )}

      <div
        className={`bg-white transition-all duration-300 ${
          sidebarCollapsed
            ? "w-full"
            : isMobile
            ? "w-full h-1/2"
            : "w-full md:w-1/2 lg:w-2/3"
        } ${isMobile && activeTabIndex === -1 ? "hidden" : "flex flex-col"}`}
      >
        {isMobile && activeTabIndex !== -1 && (
          <div className="p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => setActiveTabIndex(-1)}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to courses
            </Button>
          </div>
        )}

        {favorites.length > 0 && (
          <Accordion type="single" collapsible className="w-full border-b">
            <AccordionItem value="calendar" className="border-0">
              <AccordionTrigger className="px-6 py-3">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Your Schedule
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <p className="text-sm mb-3">
                    Quick view of your upcoming course sessions:
                  </p>
                  <div className="flex justify-between mb-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/calendar">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Calendar View
                      </a>
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {openTabs.length > 0 ? (
          <div className="flex-1 flex flex-col">
            <div className="flex overflow-x-auto border-b">
              {openTabs.map((tab, index) => (
                <button
                  key={`tab-${index}`}
                  className={`flex items-center px-4 py-2 text-sm whitespace-nowrap ${
                    index === activeTabIndex
                      ? "bg-background border-b-2 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveTabIndex(index)}
                >
                  <span className="truncate max-w-[150px]">{tab.name}</span>
                  <X
                    size={14}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                    onClick={(e) => handleCloseTab(index, e)}
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTabIndex >= 0 && openTabs[activeTabIndex] && (
                <CourseDetail
                  course={openTabs[activeTabIndex].details}
                  path={[]}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              Select a course to view details
            </p>
          </div>
        )}
      </div>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
            <DialogDescription>
              {isSignUp 
                ? "Create a new account to save your favorite courses" 
                : "Sign in to your account to access your favorites"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            {authError && (
              <div className="text-destructive text-sm">{authError}</div>
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={authLoading}
              >
                {isSignUp ? "Already have an account?" : "Need an account?"}
              </Button>
              
              <Button type="submit" disabled={authLoading}>
                {authLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreeBrowser;
