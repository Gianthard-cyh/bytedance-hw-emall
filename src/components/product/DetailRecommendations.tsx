import { useEffect, useRef } from "react";
import ProductCard from "@/components/product/Card";

export default function DetailRecommendations({
  items,
}: {
  items: Array<{ id: number; name: string; price: number; rating: number; image: string }>;
}) {

  const listRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const lis = Array.from(list.querySelectorAll<HTMLLIElement>("li"));
    const handlers: Array<(e: Event) => void> = [];
    lis.forEach((li, idx) => {
      const handler = (e: Event) => {
        const t = e.target as HTMLElement | null;
        if (t && (t.closest("button") || t.closest("a"))) return;
        const pid = items[idx]?.id;
        if (pid) window.location.href = `/product/${pid}`;
      };
      handlers.push(handler);
      li.classList.add("cursor-pointer");
      li.addEventListener("click", handler);
    });
    return () => {
      lis.forEach((li, idx) => {
        const h = handlers[idx];
        if (h) li.removeEventListener("click", h);
      });
    };
  }, [items]);

  return (
    <ul ref={listRef} className="grid gap-3 md:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </ul>
  );
}
