import { useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import DetailGallery from "@/components/product/DetailGallery";
import DetailInfo from "@/components/product/DetailInfo";
import DetailRecommendations from "@/components/product/DetailRecommendations";

type ProductDetail = {
  id: number;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  desc: string;
};

function parseIdFromPath() {
  const m = window.location.pathname.match(/\/product\/(\d+)/);
  return m ? Number(m[1]) : 1;
}

export default function ProductDetailPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<ProductDetail | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus("loading");
      try {
        const id = parseIdFromPath();
        const mod: any = await import("mockjs");
        const Mock = mod.default ?? mod;
        const result = Mock.mock({
          id,
          title: "@ctitle(5,12)",
          price: "@integer(99, 2999)",
          "images|5": [
            () => `https://picsum.photos/seed/${id}-${Math.random().toString(36).slice(2)}/800/600`,
          ],
          colors: ["黑色", "蓝色", "红色"],
          sizes: ["S", "M", "L", "XL"],
          stock: "@integer(0, 100)",
          desc: "@cparagraph(1,3)",
        });
        if (!mounted) return;
        setData(result as ProductDetail);
        setStatus("ready");
      } catch {
        if (!mounted) return;
        const id = parseIdFromPath();
        setData({
          id,
          title: `商品标题 ${id}`,
          price: Math.floor(Math.random() * 2000) + 99,
          images: Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${id}-${i}/800/600`),
          colors: ["黑色", "蓝色", "红色"],
          sizes: ["S", "M", "L", "XL"],
          stock: Math.floor(Math.random() * 100),
          desc: "这是一段示例商品描述，用于展示详情页布局。",
        });
        setStatus("ready");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canAdd = useMemo(() => {
    return !!data && data.stock > 0 && !!size && !!color && qty > 0;
  }, [data, size, color, qty]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>无法获取商品详情，请稍后重试。</AlertDescription>
        </Alert>
      )}

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
              onAdd={() => {}}
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
          <DetailRecommendations
            items={Array.from({ length: 6 }).map((_, i) => ({
              id: data.id + i + 1,
              name: `推荐商品 ${i + 1}`,
              price: Math.floor(Math.random() * 2000) + 99,
              rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
              image: `https://picsum.photos/seed/${data.id}-rec-${i}/480/360`,
            }))}
          />
        )}
      </div>
    </div>
  );
}
