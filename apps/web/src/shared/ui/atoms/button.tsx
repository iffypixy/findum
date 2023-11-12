import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {PropsWithClassName} from "@shared/lib/types";

interface ButtonProps
  extends PropsWithClassName,
    React.ComponentProps<"button">,
    React.PropsWithChildren {}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    className={twMerge(
      cx(
        "text-accent-contrast bg-accent rounded-xl py-2 px-7",
        {
          "opacity-70": props.disabled,
        },
        className,
      ),
    )}
  >
    {children}
  </button>
);
