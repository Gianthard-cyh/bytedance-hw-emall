import { useMemo } from "react";
import { useCartStore } from "@/store/cart";
import { useProductsStore } from "@/store/products";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const getProductById = useProductsStore((s) => s.getProductById);

  const total = useMemo(() => {
    return cart.reduce((sum, it) => {
      const p = getProductById(it.pid);
      const price = p?.price ?? 0;
      return sum + price * it.qty;
    }, 0);
  }, [cart, getProductById]);

  return (
    <section className="p-4 grid gap-4">
      <h2 className="text-xl font-bold">购物车</h2>
      {cart.length === 0 && <div className="text-muted-foreground">购物车为空</div>}
      {cart.length > 0 && (
        <ul className="grid gap-3">
          {cart.map((it, idx) => {
            const p = getProductById(it.pid);
            return (
              <li key={idx} className="rounded-xl border bg-background p-4 grid gap-3 md:grid-cols-[120px_1fr_auto] items-center">
                <img src={p?.image} alt={p?.name ?? String(it.pid)} className="w-[120px] h-[90px] object-cover rounded-md" />
                <div className="grid gap-1">
                  <div className="font-medium">{p?.name ?? `商品 ${it.pid}`}</div>
                  <div className="text-sm text-muted-foreground">¥{p?.price ?? 0}</div>
                  <div className="text-xs text-muted-foreground">颜色：{it.color ?? "-"}，尺码：{it.size ?? "-"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => updateQty(it.pid, it.size, it.color, Math.max(1, Number(e.target.value) || 1))}
                    className="h-9 w-16 rounded-md border bg-background px-2 text-sm"
                  />
                  <Button variant="outline" onClick={() => removeFromCart(it.pid, it.size, it.color)}>移除</Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <footer className="flex items-center justify-between mt-2">
        <div className="text-lg">总计：<span className="font-bold">¥{total}</span></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>继续购物</Button>
          <Button variant="destructive" onClick={() => clearCart()}>清空</Button>
          <Button>结算</Button>
        </div>
      </footer>
    </section>
  );
}
