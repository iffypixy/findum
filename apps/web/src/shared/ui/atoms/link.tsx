import {LinkProps, Link as L} from "wouter";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

export const Link: React.FC<LinkProps> = ({children, className, ...props}) => (
  <L className={twMerge(cx("text-[#8193F3] underline", className))} {...props}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a>{children}</a>
  </L>
);
