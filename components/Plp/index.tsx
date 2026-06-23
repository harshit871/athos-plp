import Filters from "./Filters";
import Products from "./Products";

const Plp = () => {
  return (
    <section className="grid grid-cols-[3fr_7fr] gap-2 p-4">
      <Filters />
      <Products />
    </section>
  );
};

export default Plp;
