import {useState} from "react";
import {DayPicker, DayPickerSingleProps} from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import {twMerge} from "tailwind-merge";
import {cx} from "class-variance-authority";
import {AiOutlineCalendar} from "react-icons/ai";
import dayjs from "dayjs";

import {Nullable} from "@shared/lib/types";

import "react-day-picker/dist/style.css";
import "./index.css";

interface DatePickerProps
  extends Omit<DayPickerSingleProps, "selected" | "onSelect" | "mode"> {
  label?: string;
  error?: string;
  initialValue?: Date;
  onSelect?: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  error,
  label,
  initialValue,
  onSelect,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Nullable<Date>>(
    initialValue || null,
  );

  const display = selected && dayjs(selected).format("DD.MM.YYYY");

  const trigger = (
    <Popover.Trigger>
      <div
        className={twMerge(
          cx(
            "flex items-center border border-paper-contrast/25 rounded-md space-x-2 transition p-2",
            {
              "border-accent": open,
            },
          ),
        )}
      >
        <input
          type="text"
          placeholder="Select date"
          value={display || ""}
          readOnly
          className={cx(
            "bg-transparent outline-none placeholder:text-paper-contrast/25",
            {
              "text-accent": open,
            },
          )}
        />

        <AiOutlineCalendar
          className={twMerge(
            cx("w-5 h-auto fill-paper-contrast/25", {
              "fill-accent": open,
            }),
          )}
        />
      </div>
    </Popover.Trigger>
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col space-y-1">
        {label ? (
          <label className="flex flex-col space-y-1 text-left">
            <span className="text-paper-contrast/80">{label}</span>

            {trigger}
          </label>
        ) : (
          trigger
        )}

        {error && <span className="text-sm text-error">{error}</span>}
      </div>

      <Popover.Portal>
        <Popover.Content>
          <DayPicker
            {...props}
            mode="single"
            selected={selected || undefined}
            onSelect={(date) => {
              setSelected(date!);

              onSelect && onSelect(date!);
            }}
            className="bg-paper rounded-md shadow-md p-4"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};