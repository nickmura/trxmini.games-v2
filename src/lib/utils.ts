import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classnames: string[]) => {
  return twMerge(clsx(...(classnames ? classnames : [])));
};
