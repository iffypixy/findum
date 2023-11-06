import {forwardRef} from "react";
import {cx} from "class-variance-authority";

import {PropsWithClassName} from "@shared/lib";

interface CheckboxProps extends PropsWithClassName, RawCheckboxProps {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({label, className, ...props}, ref) => {
    if (label)
      return (
        <label
          className={cx(
            "flex items-center space-x-2 cursor-pointer",
            className,
          )}
        >
          <RawCheckbox {...props} ref={ref} />

          <span className="text-inherit text-paper-contrast/80">{label}</span>
        </label>
      );

    return <RawCheckbox {...props} className={className} ref={ref} />;
  },
);

type RawCheckboxProps = React.ComponentProps<"input">;

const RawCheckbox = forwardRef<HTMLInputElement, RawCheckboxProps>(
  ({className, ...props}, ref) => (
    <input ref={ref} type="checkbox" className={className} {...props} />
  ),
);
