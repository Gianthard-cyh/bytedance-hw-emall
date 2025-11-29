import { useCallback } from "react";
import ProductCard from "@/components/product/Card";
import type { Product } from "@/lib/data";
import { useNavigate } from "react-router-dom";

export default function DetailRecommendations({
  items,
}: {
  items: Product[];
}) {
  const navigate = useNavigate();
  const handleClick = useCallback((id: number) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} onClick={handleClick} />
      ))}
    </ul>
  );
}
