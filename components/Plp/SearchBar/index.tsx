import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => (
  <div className="w-full space-y-2">
    <div className="relative">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
      <Input
        className="bg-background pl-9"
        id="search-input"
        placeholder="Search..."
        type="search"
      />
    </div>
  </div>
);

export default SearchBar;
