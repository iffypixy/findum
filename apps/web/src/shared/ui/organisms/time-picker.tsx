import * as Popover from "@radix-ui/react-popover";
import {BiTimeFive} from "react-icons/bi";
import {useState} from "react";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

import {Nullable, PropsWithClassName} from "@shared/lib/types";

interface Time {
  hour: Nullable<string>;
  minute: Nullable<string>;
}

interface TimePickerProps extends PropsWithClassName {
  label?: string;
  error?: string;
  onSelect?: (time: Time) => void;
  initialValue?: Time;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  error,
  onSelect,
  initialValue,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const [time, setTime] = useState<Time>({
    hour: initialValue?.hour || null,
    minute: initialValue?.minute || null,
  });

  const fallback = (time: Nullable<string>) => (time === null ? "00" : time);

  const show = time.hour || time.minute;
  const display = `${fallback(time.hour)}:${fallback(time.minute)}`;

  const trigger = (
    <Popover.Trigger asChild>
      <span
        className={twMerge(
          cx(
            "relative flex items-center border border-paper-contrast/25 rounded-md space-x-2 transition p-2",
            {
              "border-accent": open,
            },
          ),
        )}
      >
        <input
          type="text"
          placeholder="Select time"
          value={show ? display : ""}
          readOnly
          className={cx(
            "bg-transparent outline-none placeholder:text-paper-contrast/25",
            {
              "text-accent": open,
            },
          )}
        />

        <BiTimeFive
          className={twMerge(
            cx("w-5 h-auto text-paper-contrast/25 absolute right-2 top-2.5", {
              "text-accent": open,
            }),
          )}
        />
      </span>
    </Popover.Trigger>
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className={cx("flex flex-col space-y-1", className)}>
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
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={15}
          className="z-[999]"
        >
          <div className="flex flex-col bg-paper rounded-md shadow-md space-y-1">
            <div className="flex h-[15rem] text-sm text-paper-contrast/80 space-x-2 p-2">
              <ul className="flex flex-col overflow-auto scrollbar-none space-y-1">
                {Array.from({length: 24})
                  .map((_, idx) => idx)
                  .map((h) => h.toString())
                  .map((h) => (h.length === 1 ? `0${h}` : h))
                  .map((h) => (
                    <li key={h}>
                      <button
                        onClick={() => {
                          const updated = {...time, hour: h};

                          setTime(updated);
                          onSelect && onSelect(updated);
                        }}
                        className={cx("cursor-pointer rounded-md py-2 px-4", {
                          "bg-accent-300": h === time.hour,
                          "hover:bg-paper-contrast/5": h !== time.hour,
                        })}
                      >
                        {h}
                      </button>
                    </li>
                  ))}
              </ul>

              <div className="w-[1px] h-[100%] bg-paper-contrast/10" />

              <ul className="flex flex-col overflow-auto scrollbar-none space-y-1">
                {Array.from({length: 60})
                  .map((_, idx) => idx)
                  .map((m) => m.toString())
                  .map((m) => (m.length === 1 ? `0${m}` : m))
                  .map((m) => (
                    <li key={m}>
                      <button
                        onClick={() => {
                          const updated = {...time, minute: m};

                          setTime(updated);
                          onSelect && onSelect(updated);
                        }}
                        className={cx("cursor-pointer rounded-md py-2 px-4", {
                          "bg-accent-300": m === time.minute,
                          "hover:bg-paper-contrast/5": m !== time.minute,
                        })}
                      >
                        {m}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
