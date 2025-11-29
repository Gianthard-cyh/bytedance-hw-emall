import FilterSelecter from "@/components/filterSelector";
import ProductList from "@/components/productList";

export default function ProductsPage({
  classes,
  priceConfig,
  onApply,
  onReset,
}: {
  classes: { title: string; path: string }[];
  priceConfig: { min: number; max: number };
  onApply: (filters: { classes: string[]; price?: { min: number; max: number } }) => void;
  onReset: () => void;
}) {
  return (
    <section className="grid sm:grid-cols-[1fr_2fr] gap-4 p-4">
      <FilterSelecter classes={classes} priceConfig={priceConfig} onApply={onApply} onReset={onReset} />
      <ProductList />
    </section>
  );
}

