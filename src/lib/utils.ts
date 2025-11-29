import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductIdFromPath(pathname: string = window.location.pathname) {
  const m = pathname.match(/\/product\/(\d+)/)
  return m ? Number(m[1]) : 1
}

export function normalizeCategoryId(id: string): "phone" | "computer" | "tablet" | null {
  const s = id.toLowerCase()
  if (s.includes("phone") || s.includes("手机")) return "phone"
  if (s.includes("computer") || s.includes("电脑")) return "computer"
  if (s.includes("tablet") || s.includes("平板")) return "tablet"
  return null
}
