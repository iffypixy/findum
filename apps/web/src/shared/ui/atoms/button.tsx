import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {PropsWithClassName} from "@shared/lib";

interface ButtonProps
  extends PropsWithClassName,
    React.ComponentProps<"button"> {
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    className={twMerge(
      cx("text-accent-contrast bg-accent rounded-xl py-2 px-7", className),
    )}
  >
    {children}
  </button>
);
