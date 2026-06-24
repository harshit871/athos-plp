import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/router";

const SearchBar = () => {
  const router = useRouter();
  const [urlQuery, setUrlQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [, setPage] = useQueryState("page", parseAsString);
  
  const [inputValue, setInputValue] = useState("");
  const isUserTyping = useRef(false);


  useEffect(() => {
    if (router.isReady) {
      setInputValue(urlQuery);

      if (urlQuery === inputValue) {
        isUserTyping.current = false;
      }
    }

  }, [router.isReady, urlQuery]);

  const debouncedQuery = useDebounce(inputValue, 400);


  useEffect(() => {
    if (!router.isReady || !isUserTyping.current) return;

    if (debouncedQuery !== urlQuery) {
      if (debouncedQuery) {
        setUrlQuery(debouncedQuery);
      } else {
        setUrlQuery(null);
      }

      setPage(null);
    }
  }, [debouncedQuery, urlQuery, router.isReady, setUrlQuery, setPage]);

  const handleInputChange = (value: string) => {
    isUserTyping.current = true;
    setInputValue(value);
  };

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
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;

