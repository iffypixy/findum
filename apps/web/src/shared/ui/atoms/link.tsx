import {LinkProps, Link as L} from "wouter";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";
import {PropsWithChildren} from "react";

import {PropsWithClassName} from "@shared/lib/types";

type LProps = LinkProps &
  PropsWithClassName &
  PropsWithChildren & {
    underlined?: boolean;
  };

export const Link: React.FC<LProps> = ({
  children,
  className,
  underlined,
  ...props
}) => (
  <L {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a
      className={twMerge(
        cx(className, {
          "text-[#8193F3] underline": underlined,
        }),
      )}
    >
      {children}
    </a>
  </L>
);
