import ProductResults from "@/components/Plp/Products/ProductResults";
import SearchBar from "@/components/Plp/Products/SearchBar";

const Products = () => {
  return (
    <div className="flex flex-col gap-4">
      <SearchBar />
      <ProductResults />
    </div>
  );
};

export default Products;
