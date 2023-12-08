import {forwardRef, useState} from "react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  maxWords?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({maxWords, ...props}, ref) => {
    const [value, setValue] = useState(props.defaultValue || props.value || "");

    const textarea = (
      <textarea
        {...props}
        ref={ref}
        onChange={(event) => {
          props.onChange && props.onChange(event);

          setValue(event.currentTarget.value);
        }}
        className="w-full h-60 bg-transparent placeholder:text-paper-contrast/40 border border-paper-contrast/40 focus:border-accent rounded-md outline-none p-2 resize-none scrollbar-thin"
      />
    );

    if (maxWords)
      return (
        <div className="relative">
          {textarea}

          <span className="text-paper-contrast/40 absolute right-4 bottom-4">
            {
              value
                .toString()
                .split(" ")
                .filter((w) => w !== "").length
            }{" "}
            / {maxWords}
          </span>
        </div>
      );

    return textarea;
  },
);
