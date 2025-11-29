import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu-variants"
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export type NavBarItem = {
  title: string;
  path: string;
}

export default function NavBar({ items }: { items: NavBarItem[] }) {
  return (
    <div className="w-full h-16 flex flex-row items-center bg-white px-4">
      <label className="text-2xl font-bold text-slate-700 mr-4 font-serif">
        eMall
      </label>
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link to={item.path} className={cn(navigationMenuTriggerStyle(), "text-slate-700")}>{item.title}</Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

