import NavBar from "@/components/navBar";
import FilterSelecter from "./components/filterSelector";

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
  return (
    <main className="min-h-screen w-full bg-slate-200 flex flex-col">
      <NavBar items={navItems} />
      <section className="flex-1 flex flex-row">
        <FilterSelecter classes={classes} priceConfig={priceConfig} className="max-w-[300px]"/>
      </section>
    </main>
  );
}

export default App
