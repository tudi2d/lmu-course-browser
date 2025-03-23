
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface CourseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
}) => {
  return (
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
          className="w-full pl-9 pr-9 py-2"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseSearch;
