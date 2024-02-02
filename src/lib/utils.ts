import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classnames: ClassValue[]) => {
  return twMerge(clsx(...(classnames ? classnames : [])));
};
