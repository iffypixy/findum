import {PropsWithChildren} from "react";
import {cx} from "class-variance-authority";

import {PropsWithClassName} from "@shared/lib/types";

type TextProps = PropsWithClassName & PropsWithChildren;

export const Text: React.FC<TextProps> = ({className, children}) => (
  <span className={cx("text-[#817C7C]", className)}>{children}</span>
);
