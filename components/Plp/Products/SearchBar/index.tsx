import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { useDebounce } from "@/hooks/use-debounce";

const SearchBar = () => {
  const [urlQuery, setUrlQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [, setPage] = useQueryState("page", parseAsString);
  
  const [inputValue, setInputValue] = useState(urlQuery);

  // Sync internal state when URL changes externally
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  const debouncedQuery = useDebounce(inputValue, 400);

  // Push debounced value to URL
  useEffect(() => {
    if (debouncedQuery !== urlQuery) {
      if (debouncedQuery) {
        setUrlQuery(debouncedQuery);
      } else {
        setUrlQuery(null);
      }
      // Reset page when search changes
      setPage(null);
    }
  }, [debouncedQuery, urlQuery, setUrlQuery, setPage]);

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="bg-background pl-9"
          id="search-input"
          placeholder="Search Products"
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
