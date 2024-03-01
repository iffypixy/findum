import {PropsWithChildren} from "react";
import * as S from "@radix-ui/react-select";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {PropsWithClassName} from "@shared/lib/types";
import {Icon} from "@shared/ui";

interface SelectRootProps
  extends React.ComponentProps<typeof S.Root>,
    PropsWithClassName,
    PropsWithChildren {
  placeholder?: React.ReactNode;
  label?: string;
  error?: string;
}

const Root: React.FC<SelectRootProps> = ({
  placeholder,
  label,
  error,
  children,
  className,
  ...props
}) => {
  const select = (
    <S.Root {...props}>
      <S.Trigger
        className="
          w-[100%] flex items-center rounded-lg border border-[#D2D1D1] focus:border-accent data-[placeholder]:text-paper-contrast/40"
      >
        <span className="w-[100%] h-12 flex justify-between items-center rounded-md py-2 px-3 [&>span]:my-auto">
          <S.Value
            placeholder={placeholder}
            className="placeholder:text-[#D2D1D1] text-[#2D2D2E]"
          />
        </span>

        <S.Icon className="-translate-x-2">
          <Icon.Chevron.Down className="w-6 h-auto" />
        </S.Icon>
      </S.Trigger>

      <S.Portal>
        <S.Content
          className={cx(
            "bg-paper rounded-md border border-paper-contrast shadow-md z-[60] w-[95%] mx-auto",
          )}
        >
          <S.ScrollUpButton className="flex items-center justify-center bg-paper text-paper-contrast cursor-default">
            <Icon.Chevron.Up className="w-[1.5rem] h-auto" />
          </S.ScrollUpButton>

          <S.Viewport className="p-0">{children}</S.Viewport>

          <S.ScrollDownButton className="flex items-center justify-center bg-paper text-paper-contrast cursor-default">
            <Icon.Chevron.Down className="w-[1.5rem] h-auto" />
          </S.ScrollDownButton>
        </S.Content>
      </S.Portal>
    </S.Root>
  );

  return (
    <div className={cx("h-24 flex flex-col space-y-2", className)}>
      {label ? (
        <label className="flex flex-col space-y-1 text-left">
          <span className="text-[#817C7C]">{label}</span>

          {select}
        </label>
      ) : (
        select
      )}

      {error && <span className="text-error text-sm">{error}</span>}
    </div>
  );
};

interface SelectItemProps extends PropsWithClassName {
  value: string;
  children?: React.ReactNode;
}

const Item: React.FC<SelectItemProps> = ({value, children, className}) => {
  return (
    <S.Item
      value={value}
      className={twMerge(
        cx(
          "flex items-center space-x-2 data-[highlighted]:bg-accent data-[highlighted]:text-accent-contrast text-sm rounded-md select-none outline-none p-2",
          className,
        ),
      )}
    >
      <S.ItemIndicator className="inline-flex items-center justify-center">
        <Icon.Check className="w-[1.5rem] h-auto" />
      </S.ItemIndicator>

      <S.ItemText>{children}</S.ItemText>
    </S.Item>
  );
};

export const Select = {Root, Item};
