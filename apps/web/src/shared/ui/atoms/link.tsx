import {LinkProps, Link as L} from "wouter";
import {cx} from "class-variance-authority";

export const Link: React.FC<LinkProps> = ({children, className, ...props}) => (
  <L className={cx("text-accent underline", className)} {...props}>
    {children}
  </L>
);
