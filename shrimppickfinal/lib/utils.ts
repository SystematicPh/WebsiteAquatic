import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "@/lib/types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const currency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));

export const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "Completed":
      return "status-pill bg-seaweed/10 text-seaweed";
    case "Shipping":
      return "status-pill bg-tide/10 text-tide";
    default:
      return "status-pill bg-coral/10 text-coral";
  }
};

export const slugifyFileName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
