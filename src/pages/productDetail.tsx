import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import DetailGallery from "@/components/product/DetailGallery";
import DetailInfo from "@/components/product/DetailInfo";
import DetailRecommendations from "@/components/product/DetailRecommendations";
import { deriveProductDetail, type ProductDetail } from "@/lib/data";
import { useProductsStore } from "@/store/products";
import { useCartStore } from "@/store/cart";

// ProductDetail type moved to lib/data

// id parsing moved to utils

export default function ProductDetailPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const getRecommendations = useProductsStore((s) => s.getRecommendations);
  const addToCart = useCartStore((s) => s.addToCart);

  const products = useProductsStore((s) => s.products);
  const productsStatus = useProductsStore((s) => s.status);
  const loadProducts = useProductsStore((s) => s.loadProducts);

  useEffect(() => {
    if (productsStatus === "idle") loadProducts();
  }, [productsStatus, loadProducts]);

  const params = useParams();
  const id = useMemo(() => Number(params.id ?? 0), [params.id]);
  const base = products.find((p) => p.id === id);
  const data: ProductDetail | null = productsStatus === "ready" ? deriveProductDetail(id, base) : null;

  const status: "loading" | "ready" = productsStatus !== "ready" || !data ? "loading" : "ready";

  const canAdd = useMemo(() => {
    return !!data && data.stock > 0 && !!size && !!color && qty > 0;
  }, [data, size, color, qty]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-background p-4">
          {status === "loading" && <Skeleton className="w-full aspect-[4/3]" />}
          {status === "ready" && data && (
            <DetailGallery images={data.images} active={activeImg} onChange={setActiveImg} />
          )}
        </div>

        <div className="rounded-2xl border bg-background p-6 flex flex-col gap-4">
          {status === "loading" && (
            <>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </>
          )}
          {status === "ready" && data && (
            <DetailInfo
              title={data.title}
              price={data.price}
              sizes={data.sizes}
              colors={data.colors}
              stock={data.stock}
              desc={data.desc}
              selectedSize={size}
              selectedColor={color}
              qty={qty}
              onSizeChange={setSize}
              onColorChange={setColor}
              onQtyChange={(n) => setQty(n)}
              onAdd={() => {
                if (!data) return;
                addToCart({ pid: data.id, size, color, qty: Math.max(1, qty) });
              }}
              canAdd={canAdd}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-4">
        <div className="text-sm text-muted-foreground mb-3">推荐/相似商品</div>
        {status === "loading" && (
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[4/3]" />
            ))}
          </div>
        )}
        {status === "ready" && data && (
          <DetailRecommendations items={getRecommendations(data.id)} />
        )}
      </div>
    </div>
  );
}
