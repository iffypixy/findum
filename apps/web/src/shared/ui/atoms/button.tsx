import {cx, cva} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {PropsWithClassName} from "@shared/lib/types";

interface ButtonProps
  extends PropsWithClassName,
    React.ComponentProps<"button">,
    React.PropsWithChildren {
  color?: "primary" | "secondary" | "chromatic";
}

const styles = cva("w-fit h-fit text-lg rounded-xl py-2 px-8", {
  variants: {
    color: {
      primary: "text-accent-contrast bg-accent",
      secondary: "text-accent bg-accent-contrast border border-accent",
      chromatic: "text-[#112042] bg-[#F8F9FA] border-2 border-[#8193F3]",
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
          "opacity-60 cursor-not-allowed": props.disabled,
        },
        className,
      ),
    )}
  >
    {children}
  </button>
);
