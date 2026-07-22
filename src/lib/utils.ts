import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function releaseYear(dateString: string) {
    return dateString ? dateString.slice(0, 4) : "TBA";
}