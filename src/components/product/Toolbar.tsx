import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortKey = "price_asc" | "price_desc" | "rating_desc" | "name_asc";

export default function ProductToolbar({
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

