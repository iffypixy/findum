import {forwardRef, useState} from "react";
import {cx} from "class-variance-authority";
import {RiAttachment2} from "react-icons/ri";

import {Nullable, PropsWithClassName} from "@shared/lib/types";

interface InputProps extends PropsWithClassName, React.ComponentProps<"input"> {
  error?: string;
  label?: string;
}

interface TextFieldProps extends InputProps {
  suffix?: React.ReactNode;
  borderless?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({label, error, suffix, className, borderless, ...props}, ref) => {
    const input = (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          className={cx(
            "w-full h-12 bg-transparent placeholder:text-paper-contrast/40 border border-paper-contrast/40 focus:border-accent rounded-md outline-none p-2 disabled:border-paper-contrast/20 disabled:text-paper-contrast/20",
            {
              "pr-8": !!suffix,
              "border-none": borderless,
            },
          )}
        />

        <div className="inline-flex absolute right-[3%] top-[50%] translate-y-[-50%]">
          {suffix}
        </div>
      </div>
    );

    return (
      <div className={cx("h-24 flex flex-col space-y-1", className)}>
        {label ? (
          <label className="flex flex-col space-y-1 text-left">
            <span className="text-paper-contrast/80">{label}</span>

            {input}
          </label>
        ) : (
          input
        )}

        {error && <span className="text-error text-sm">{error}</span>}
      </div>
    );
  },
);

export const UploadField = forwardRef<HTMLInputElement, InputProps>(
  ({label, placeholder, error, className, ...props}, ref) => {
    const [name, setName] = useState<Nullable<string>>(null);

    const text = name ? (
      <span>{name}</span>
    ) : (
      <span className="text-paper-contrast/40">{placeholder}</span>
    );

    const input = (
      <input
        {...props}
        type="file"
        ref={ref}
        onChange={(event) => {
          const file = event.currentTarget.files![0];

          if (file) setName(file.name);

          if (props.onChange) props.onChange(event);
        }}
        className="absolute right-0 top-0 min-w-[100%] min-h-full opacity-0 cursor-pointer"
      />
    );

    return (
      <div
        className={cx(
          "relative block cursor-pointer bg-transparent overflow-hidden space-y-1 h-24",
          className,
        )}
      >
        {label ? (
          <label>
            {input}

            <span>{label}</span>
          </label>
        ) : (
          input
        )}

        <div className="min-w-[15rem] h-12 flex border justify-between items-center border-paper-contrast/40 rounded-md p-2">
          {text}

          <RiAttachment2 className="w-6 h-6 fill-main" />
        </div>

        {error && <span className="text-error text-sm">{error}</span>}
      </div>
    );
  },
);
