import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Heart, BarChart, Atom, Film } from "lucide-react";
interface CourseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  isMobile?: boolean;
}
const CourseSearch: React.FC<CourseSearchProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
  isMobile = false,
}) => {
  const [inputValue, setInputValue] = React.useState(searchQuery);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Update local input value when searchQuery prop changes
  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Improved input handling for faster response
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Apply search immediately for faster feedback
    setSearchQuery(value);
  };

  // Focus on search input when component mounts
  React.useEffect(() => {
    if (inputRef.current && searchQuery) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="border-b border-muted">
      <div
        className={`p-4 flex justify-between items-center ${
          isMobile ? "py-1.5" : ""
        }`}
      >
        <div className="relative flex-1 mr-2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Kurse suchen..."
            value={inputValue}
            onChange={handleInputChange}
            className={`w-full pl-9 pr-9 ${isMobile ? "h-6 text-sm" : ""}`}
            style={
              isMobile
                ? {
                    height: "1.5em",
                  }
                : {}
            }
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                clearSearch();
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="px-4 pb-3">
          <p className="text-sm text-muted-foreground mb-2">
            Lerne etwas neues über:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("Liebe");
                if (inputRef.current) inputRef.current.focus();
              }}
              className="flex items-center gap-1 text-muted-foreground rounded-full text-sm"
            >
              <Heart size={14} />
              Liebe
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("Data Analysis");
                if (inputRef.current) inputRef.current.focus();
              }}
              className="flex items-center gap-1 text-muted-foreground rounded-full text-sm"
            >
              <BarChart size={14} />
              Data Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("Film");
                if (inputRef.current) inputRef.current.focus();
              }}
              className="flex items-center gap-1 text-muted-foreground rounded-full text-sm"
            >
              <Film size={14} />
              Film
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CourseSearch;
