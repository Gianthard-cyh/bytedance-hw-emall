import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { RotateCcwIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useMemo, useState } from "react";

export type FilterClassItem = {
  key?: string;
  path?: string;
  title: string;
}

export type FilterPriceConfig = {
  min: number;
  max: number;
}

export type FilterSelecterProps = {
  className?: string;
  classes: FilterClassItem[];
  priceConfig: FilterPriceConfig;
  onApply?: (filters: { classes: string[]; price: FilterPriceConfig }) => void;
  onReset?: () => void;
}

function FilterClassItem({
  item,
  checked,
  onToggle,
}: {
  item: FilterClassItem;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  const id = item.key ?? item.path ?? item.title;
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2 bg-slate-100 py-2 px-6 w-full rounded-sm min-h-12 cursor-pointer transition",
        {
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/80": !checked,
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80": checked
        }
      )}
      onClick={() => onToggle(id)}
    >
      <span>{item.title}</span>
      <Checkbox className="bg-white transition" checked={checked} />
    </div>
  );
}

export default function FilterSelecter({
  className,
  classes,
  priceConfig,
  onApply,
  onReset,
}: FilterSelecterProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [min, setMin] = useState<number>(priceConfig.min);
  const [max, setMax] = useState<number>(priceConfig.max);

  const clampMin = useMemo(() => Math.min(min, max), [min, max]);
  const clampMax = useMemo(() => Math.max(min, max), [min, max]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function apply() {
    onApply?.({ classes: selected, price: { min: clampMin, max: clampMax } });
  }

  function reset() {
    setSelected([]);
    setMin(priceConfig.min);
    setMax(priceConfig.max);
    onReset?.();
  }

  return (
    <div className={cn("flex-1 flex flex-col bg-slate-100 m-4 p-4 rounded-2xl", className)}>
      <h1 className="text-xl font-bold text-foreground">筛选</h1>

      <div className="bg-white w-full rounded-lg flex flex-col p-4 mt-4 gap-2">
        {classes.map((item, index) => {
          const id = item.key ?? item.path ?? item.title;
          return (
            <FilterClassItem
              key={id + index}
              item={item}
              checked={selected.includes(id)}
              onToggle={toggle}
            />
          );
        })}
      </div>

      <div className="bg-white w-full rounded-lg flex flex-col p-4 mt-4 gap-3">
        <span className="text-sm text-muted-foreground">价格范围</span>
        <div className="flex flex-row items-center gap-3">
          <input
            type="number"
            value={clampMin}
            onChange={(e) => setMin(Number(e.target.value) || priceConfig.min)}
            className={cn(
              "h-10 w-24 rounded-md border px-3 text-sm",
              "bg-background text-foreground"
            )}
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            value={clampMax}
            onChange={(e) => setMax(Number(e.target.value) || priceConfig.max)}
            className={cn(
              "h-10 w-24 rounded-md border px-3 text-sm",
              "bg-background text-foreground"
            )}
          />
        </div>
      </div>

      <footer className="flex flex-row justify-end items-center mt-4 gap-2">
        <Button className="flex-1" size={"lg"} onClick={apply}>
          应用筛选
        </Button>
        <Button variant={"outline"} size={"icon-lg"} onClick={reset}>
          <RotateCcwIcon />
        </Button>
      </footer>
    </div>
  );
}
