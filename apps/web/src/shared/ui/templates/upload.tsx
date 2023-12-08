import {cx} from "class-variance-authority";
import {useRef} from "react";

interface UploadProps
  extends React.PropsWithChildren,
    React.ComponentProps<"input"> {}

export const Upload: React.FC<UploadProps> = ({
  children,
  className,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const clickInput = () => {
    ref.current?.click();
  };

  return (
    <div
      className={cx(
        "inline-block relative cursor-pointer outline-none",
        className,
      )}
      role="button"
      tabIndex={0}
      onClick={() => {
        clickInput();
      }}
      onKeyDown={(event) => {
        const code = "Enter";

        if (event.code === code) {
          clickInput();
        }
      }}
    >
      <input {...props} ref={ref} type="file" className="hidden" />

      {children}
    </div>
  );
};
