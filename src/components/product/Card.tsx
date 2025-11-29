import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon } from "lucide-react";

export type ProductCardData = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
};

export default function ProductCard({ p }: { p: ProductCardData }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <li className="rounded-xl border bg-background overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3]">
        {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent text-white">
          <div className="text-sm font-medium">{p.name}</div>
        </div>
      </div>
      <div className="p-4 bg-secondary text-secondary-foreground flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">¥{p.price}</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`size-4 ${i < Math.round(p.rating) ? "text-yellow-500" : "text-muted-foreground"}`}
                fill={i < Math.round(p.rating) ? "currentColor" : "none"}
              />
            ))}
            <span className="text-sm opacity-80">{p.rating}</span>
          </div>
        </div>
      </div>
      <Button className="w-full h-12 rounded-none">加入购物车</Button>
    </li>
  );
}

