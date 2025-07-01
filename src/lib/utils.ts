import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const typography = {
  h1: "text-h1",
  h2: "text-h2", 
  h3: "text-h3",
  h4: "text-h4",
  body: "text-body",
  small: "text-small",
  code: "text-code",
} as const;

export const spacing = {
  section: "section",
  component: "component", 
  paragraph: "paragraph",
  list: "list",
} as const;

export const colors = {
  primary: "text-primary",
  offBlack: "text-off-black",
  offWhite: "text-off-white",
  warmGray: "text-warm-gray",
  lightGray: "text-light-gray",
} as const;

export const accessibility = {
  focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  touchTarget: "min-h-[44px] min-w-[44px]",
} as const;
