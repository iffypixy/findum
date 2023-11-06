import {forwardRef} from "react";

type TextareaProps = React.ComponentProps<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => (
    <textarea
      {...props}
      ref={ref}
      className="w-full h-60 placeholder:text-paper-contrast/40 border border-paper-contrast/40 focus:border-accent rounded-lg outline-none py-2 px-4 resize-none"
    />
  ),
);
