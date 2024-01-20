import {cx, cva} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {PropsWithClassName} from "@shared/lib/types";

interface ButtonProps
  extends PropsWithClassName,
    React.ComponentProps<"button">,
    React.PropsWithChildren {
  color?: "primary" | "secondary";
}

const styles = cva("rounded-xl py-2 px-7", {
  variants: {
    color: {
      primary: "text-accent-contrast bg-accent",
      secondary: "text-accent bg-accent-contrast border border-accent",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    className={twMerge(
      cx(
        styles({color: props.color}),
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
