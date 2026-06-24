import Filters from "@/components/Plp/Filters";
import Products from "@/components/Plp/Products";

const Plp = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto p-6">
          <Filters />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6">
        <Products />
      </main>
    </div>
  );
};

export default Plp;
