import { useQueryState, parseAsString } from "nuqs";

const SortDropdown = () => {
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault(""));

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        Sort by
      </span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value || null)}
        className="h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer hover:border-muted-foreground/30"
      >
        <option value="">Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortDropdown;
