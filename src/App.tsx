import NavBar from "@/components/navBar";
import FilterSelecter from "./components/filterSelector";
import ProductList from "@/components/productList";
import ProductDetailPage from "@/pages/productDetail";

const navItems = [
  { title: "首页", path: "/" },
  { title: "商品", path: "/products" },
  { title: "购物车", path: "/cart" },
  { title: "订单", path: "/orders" },
  { title: "我的", path: "/profile" }
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
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  if (/^\/product\/\d+$/.test(path)) {
    return (
      <main className="min-h-screen w-full bg-slate-200 flex flex-col">
        <NavBar items={navItems} />
        <ProductDetailPage />
      </main>
    );
  }
  return (
    <main className="min-h-screen w-full bg-slate-200 flex flex-col">
      <NavBar items={navItems} />
      <section className="grid sm:grid-cols-[1fr_2fr] gap-4 p-4">
        <FilterSelecter classes={classes} priceConfig={priceConfig}/>
        <ProductList />
      </section>
    </main>
  );
}

export default App
