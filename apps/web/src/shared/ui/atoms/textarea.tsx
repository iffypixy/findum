import {forwardRef, useState} from "react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({error, ...props}, ref) => {
    const [value, setValue] = useState(
      (props.defaultValue as string) || (props.value as string) || "",
    );

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

    return (
      <div className="relative flex flex-col space-y-2">
        {error && <span className="text-error text-sm">{error}</span>}

        {textarea}

        <span className="text-paper-contrast/40 absolute right-4 bottom-4">
          ({value.length})
        </span>
      </div>
    );
  },
);
