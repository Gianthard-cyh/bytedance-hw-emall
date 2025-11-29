import { useCallback } from "react";
import ProductCard from "@/components/product/Card";
import type { Product } from "@/lib/data";

export default function DetailRecommendations({
  items,
}: {
  items: Product[];
}) {
  const handleClick = useCallback((id: number) => {
    window.location.href = `/product/${id}`;
  }, []);

  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} onClick={handleClick} />
      ))}
    </ul>
  );
}
