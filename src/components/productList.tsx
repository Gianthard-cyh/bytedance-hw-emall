import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import ProductToolbar from "@/components/product/Toolbar";
import ProductPager from "@/components/product/Pager";
import ProductCard from "@/components/product/Card";
import { useProductsStore } from "@/store/products";

type SortKey = "price_asc" | "price_desc" | "rating_desc" | "name_asc";

export default function ProductList() {
  const navigate = useNavigate();
  const products = useProductsStore((s) => s.products);
  const productsStatus = useProductsStore((s) => s.status);
  const loadProducts = useProductsStore((s) => s.loadProducts);
  const [sort, setSort] = useState<SortKey>("price_asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const status: "loading" | "ready" | "error" =
    productsStatus === "loading" ? "loading" : productsStatus === "error" ? "error" : "ready";

  useEffect(() => {
    if (productsStatus === "idle") loadProducts();
  }, [productsStatus, loadProducts]);

  const sorted = useMemo(() => {
    const arr = [...products];
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
  }, [products, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);
  const handleCardClick = useCallback((id: number) => {
    navigate(`/product/${id}`);
  }, [navigate]);

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
            <ProductCard key={p.id} p={p} onClick={handleCardClick} />
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
