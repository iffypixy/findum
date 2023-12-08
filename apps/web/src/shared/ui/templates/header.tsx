import React, {useEffect, useRef, useState} from "react";
import * as Select from "@radix-ui/react-select";
import {BiBell, BiSearch} from "react-icons/bi";
import {twMerge} from "tailwind-merge";
import {cx} from "class-variance-authority";
import * as Popover from "@radix-ui/react-popover";

import {Avatar, H6, Icon} from "@shared/ui";

const avatar = "https://shorturl.at/ikvZ0";

export const Header: React.FC = () => {
  return (
    <div
      id="header"
      className="relative w-[100%] h-[6rem] flex justify-end items-center bg-paper-brand py-6 px-10"
    >
      <div className="flex items-center space-x-5">
        <SearchBar />

        <Popover.Root>
          <Popover.Trigger>
            <BiBell className="w-6 h-auto" />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content side="bottom" align="end" sideOffset={15}>
              <div className="flex flex-col rounded-md bg-paper shadow-md space-y-6 p-8">
                <H6>Recent notifications</H6>

                <div className="flex flex-col">
                  <div className="flex space-x-4">
                    <Avatar src={avatar} />

                    <div className="flex flex-col">
                      <span className="text-lg">Findum app</span>

                      <span className="text-sm text-paper-contrast/80">
                        You were accepted to the team
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-paper-contrast/60 text-sm">
                        May 15, 16:55 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <LanguageSelect />
      </div>
    </div>
  );
};

const SearchBar: React.FC = () => {
  const [showInput, setShowInput] = useState(false);

  return (
    <div
      className={twMerge(
        cx(
          "flex items-center rounded-lg px-3 py-2 -my-2 -mx-3 border-2 border-transparent",
          {
            "border-accent": showInput,
          },
        ),
      )}
    >
      {showInput && (
        <SearchBarInput
          onBlur={() => {
            setShowInput(false);
          }}
        />
      )}

      <button
        onClick={() => {
          setShowInput(true);
        }}
      >
        <BiSearch className="w-6 h-auto" />
      </button>
    </div>
  );
};

interface SearchBarInputProps {
  onBlur: () => void;
}

const SearchBarInput: React.FC<SearchBarInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className="mr-4">
      <input
        className="bg-transparent border-none outline-none"
        ref={inputRef}
        onBlur={props.onBlur}
      />
    </form>
  );
};

type Flag = "usa" | "germany" | "russia";

const LanguageSelect: React.FC = () => {
  const [flag, setFlag] = useState<Flag>("usa");

  const flags = {
    germany: Icon.Flag.Germany,
    usa: Icon.Flag.USA,
    russia: Icon.Flag.Russia,
  };

  const Flag = flags[flag];

  return (
    <Select.Root
      onValueChange={(value) => {
        setFlag(value as Flag);
      }}
      value={flag}
      name="language"
    >
      <Select.Trigger>
        <Select.Value>
          <Flag className="w-8 h-auto" />
        </Select.Value>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="bg-paper rounded-md border border-paper-contrast shadow-md"
        >
          <Select.Viewport className="p-2">
            {Object.entries(flags)
              .filter(([f]) => f !== flag)
              .map(([flag, Flag]) => (
                <Select.Item
                  key={flag}
                  value={flag}
                  className="data-[highlighted]:bg-accent rounded-md select-none outline-none p-2"
                >
                  <Flag className="w-8 h-auto" />
                </Select.Item>
              ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
