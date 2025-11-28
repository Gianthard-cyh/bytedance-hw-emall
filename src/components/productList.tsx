import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
};

type SortKey = "price_asc" | "price_desc" | "rating_desc" | "name_asc";

function ProductCard({ p }: { p: Product }) {
  return (
    <li className="rounded-xl border bg-background overflow-hidden flex flex-col">
      <div className="relative h-full">
        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
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

function ProductToolbar({
  sort,
  onSortChange,
  pageSize,
  onPageSizeChange,
}: {
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  pageSize: number;
  onPageSizeChange: (n: number) => void;
}) {
  return (
    <header className="flex flex-wrap items-center gap-3 justify-between bg-slate-100 py-4 px-6 rounded-2xl">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">排序</label>
        <Select value={sort} onValueChange={(value) => onSortChange(value as SortKey)}>
          <SelectTrigger className="h-9 rounded-md border bg-background px-3 text-sm text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">价格从低到高</SelectItem>
            <SelectItem value="price_desc">价格从高到低</SelectItem>
            <SelectItem value="rating_desc">评分从高到低</SelectItem>
            <SelectItem value="name_asc">名称A→Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">每页</label>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value) || 12)}>
          <SelectTrigger className="h-9 rounded-md border bg-background px-3 text-sm text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="32">32</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

function ProductPager({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (n: number) => void;
}) {
  return (
    <footer className="flex items-center justify-between">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink isActive={i + 1 === currentPage} onClick={() => onPageChange(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {currentPage > 9 && <PaginationEllipsis />}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </footer>
  );
}

export default function ProductList() {
  const [data, setData] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortKey>("price_asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus("loading");
      try {
        const mod: any = await import("mockjs");
        const Mock = mod.default ?? mod;
        const result = Mock.mock({
          "list|100": [
            {
              "id|+1": 1,
              name: "@ctitle(5,10)",
              price: "@integer(1, 9999)",
              rating: "@float(1, 5, 1, 1)",
            },
          ],
        });
        if (mounted) {
          const withImage = (result.list as Omit<Product, "image">[]).map((p) => ({
            ...p,
            image: `https://picsum.photos/seed/${p.id}/480/320`,
          }));
          setData(withImage as Product[]);
          setStatus("ready");
        }
      } catch {
        if (!mounted) return;
        setStatus("error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sorted = useMemo(() => {
    const arr = [...data];
    switch (sort) {
      case "price_asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case "name_asc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return arr;
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  function changePage(next: number) {
    setPage(Math.max(1, Math.min(totalPages, next)));
  }

  return (
    <div className="flex flex-col gap-4 m-4">
      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>无法获取商品数据，请稍后重试。</AlertDescription>
        </Alert>
      )}

      <ProductToolbar
        sort={sort}
        onSortChange={(s) => setSort(s)}
        pageSize={pageSize}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {status === "loading" && (
        <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="rounded-xl border overflow-hidden grid grid-rows-2 h-80">
              <Skeleton className="h-full w-full" />
              <div className="p-4 grid gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {status === "ready" && (
        <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </ul>
      )}

      {status === "ready" && visible.length === 0 && (
        <div className="grid place-items-center rounded-2xl bg-slate-100 py-12">
          <div className="text-muted-foreground">暂无商品</div>
        </div>
      )}

      {status === "ready" && sorted.length > 0 && (
        <ProductPager
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(n) => changePage(n)}
        />
      )}
    </div>
  );
}
