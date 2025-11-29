import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DetailInfo({
  title,
  price,
  sizes,
  colors,
  stock,
  desc,
  selectedSize,
  selectedColor,
  qty,
  onSizeChange,
  onColorChange,
  onQtyChange,
  onAdd,
  canAdd,
  remaining,
  inCartQty,
}: {
  title: string;
  price: number;
  sizes: string[];
  colors: string[];
  stock: number;
  desc: string;
  selectedSize: string;
  selectedColor: string;
  qty: number;
  onSizeChange: (s: string) => void;
  onColorChange: (c: string) => void;
  onQtyChange: (n: number) => void;
  onAdd: () => void;
  canAdd: boolean;
  remaining?: number;
  inCartQty?: number;
}) {
  const disabledReason = (() => {
    if (!selectedSize) return "请选择尺码";
    if (!selectedColor) return "请选择颜色";
    if (qty <= 0) return "数量必须大于 0";
    if (typeof remaining === 'number' && qty > remaining) {
      const cartInfo = typeof inCartQty === 'number' && inCartQty > 0 ? `，购物车已有 ${inCartQty} 件` : "";
      return `库存不足${cartInfo}，剩余可加入 ${remaining} 件`;
    }
    if (stock <= 0) return "无库存";
    return "";
  })();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-bold">{title}</div>
        <div className="mt-1 text-lg text-primary">价格：¥{price}</div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">尺码</div>
        <div className="mt-2">
          <Select value={selectedSize} onValueChange={(v) => onSizeChange(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="请选择尺码" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">颜色</div>
        <div className="mt-2">
          <Select value={selectedColor} onValueChange={(v) => onColorChange(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="请选择颜色" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">库存</div>
        <div className="mt-1 text-sm">{stock} 件</div>
        <div className="mt-1 text-xs text-muted-foreground">提示：选择尺寸与颜色后可加入购物车；无库存时不可加入。</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => onQtyChange(Math.max(1, Number(e.target.value) || 1))}
          className="h-10 w-24 rounded-md border bg-background px-3 text-sm"
        />
        {canAdd ? (
          <Button className="flex-1 h-10" onClick={onAdd}>
            加入购物车
          </Button>
        ) : (
          <div className="flex-1 grid gap-1">
            <Button disabled className="h-10 w-full">加入购物车</Button>
            <div className="text-xs text-muted-foreground">{disabledReason || "不可加入"}</div>
          </div>
        )}
      </div>

      <div>
        <div className="text-sm text-muted-foreground">商品描述</div>
        <p className="mt-2 text-sm leading-6">{desc}</p>
      </div>
    </div>
  );
}
