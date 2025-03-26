import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Heart, BarChart, Atom } from "lucide-react";
interface CourseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}
const CourseSearch: React.FC<CourseSearchProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch
}) => {
  const [inputValue, setInputValue] = React.useState(searchQuery);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Update local input value when searchQuery prop changes
  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 200);
  };

  // Cleanup timeout on component unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return <div className="border-b border-muted">
      <div className="p-4 flex justify-between items-center">
        <div className="relative flex-1 mr-2">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder="Search courses..." value={inputValue} onChange={handleInputChange} className="w-full pl-9 pr-9 py-2" />
          {inputValue && <button onClick={() => {
          setInputValue("");
          clearSearch();
        }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>}
        </div>
      </div>
      
      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground mb-2">Learn something new about:</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("Love")} className="flex items-center gap-1 text-muted-foreground rounded-full text-sm">
            <Heart size={14} />
            Love
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("Data Analysis")} className="flex items-center gap-1 text-muted-foreground rounded-full text-sm">
            <BarChart size={14} />
            Data Analysis
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("Quantum")} className="flex items-center gap-1">
            <Atom size={14} />
            Quantum
          </Button>
        </div>
      </div>
    </div>;
};
export default CourseSearch;