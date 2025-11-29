import { Button } from "@/components/ui/button";

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
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-bold">{title}</div>
        <div className="mt-1 text-lg text-primary">价格：¥{price}</div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">尺码</div>
        <div className="mt-2 flex gap-2">
          {sizes.map((s) => (
            <Button key={s} variant={selectedSize === s ? "secondary" : "outline"} onClick={() => onSizeChange(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">颜色</div>
        <div className="mt-2 flex gap-2">
          {colors.map((c) => (
            <Button key={c} variant={selectedColor === c ? "secondary" : "outline"} onClick={() => onColorChange(c)}>
              {c}
            </Button>
          ))}
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
        <Button disabled={!canAdd} className="flex-1 h-10" onClick={onAdd}>
          加入购物车
        </Button>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">商品描述</div>
        <p className="mt-2 text-sm leading-6">{desc}</p>
      </div>
    </div>
  );
}

