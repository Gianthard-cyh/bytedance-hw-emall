import NavBar from "@/components/navBar";
import ProductDetailPage from "@/pages/productDetail";
import CartPage from "@/pages/cart";
import { Routes, Route } from "react-router-dom";
import { useProductsStore } from "@/store/products";
import ProductsPage from "./pages/products";

const navItems = [
  { title: "商品", path: "/products" },
  { title: "购物车", path: "/cart" },
];

const classes = [
  { title: "全部", path: "/" },
  { title: "手机", path: "/products/phone" },
  { title: "电脑", path: "/products/computer" },
  { title: "平板", path: "/products/tablet" },
];

const priceConfig = {
  min: 0,
  max: 10000,
}

function App() {
  const setFilters = useProductsStore((s) => s.setFilters);
  const clearFilters = useProductsStore((s) => s.clearFilters);
  return (
    <main className="min-h-screen w-full bg-slate-200 flex flex-col">
      <NavBar items={navItems} />
      <Routes>
        <Route path="/" element={<ProductsPage classes={classes} priceConfig={priceConfig} onApply={setFilters} onReset={clearFilters} />} />
        <Route path="/products" element={<ProductsPage classes={classes} priceConfig={priceConfig} onApply={setFilters} onReset={clearFilters} />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </main>
  );
}

export default App
