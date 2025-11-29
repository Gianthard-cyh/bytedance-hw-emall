import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductIdFromPath(pathname: string = window.location.pathname) {
  const m = pathname.match(/\/product\/(\d+)/)
  return m ? Number(m[1]) : 1
}
