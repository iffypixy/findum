import React, {useEffect, useRef, useState} from "react";
import * as Select from "@radix-ui/react-select";
import {BiBell, BiSearch} from "react-icons/bi";
import {twMerge} from "tailwind-merge";
import {cx} from "class-variance-authority";
import * as Popover from "@radix-ui/react-popover";

import {Avatar, H6, Icon} from "@shared/ui";
import {useSelector} from "react-redux";
import {notificationsModel} from "@features/notifications";
import {dayjs} from "@shared/lib/dayjs";
import {useDebouncedValue} from "@shared/lib/debounce";
import {SearchResponse, api} from "@shared/api";
import {navigate} from "wouter/use-location";
import {RootState, useDispatch} from "@shared/lib/store";
import {setNotRead} from "@features/notifications/model/actions";
import {useTranslation} from "react-i18next";

export const Header: React.FC = () => {
  const dispatch = useDispatch();

  const notRead = useSelector((s: RootState) => s.notifications.notRead);

  const notifications = useSelector(notificationsModel.selectors.notifications);

  return (
    <div
      id="header"
      className="relative w-[100%] h-[6rem] flex justify-end items-center bg-paper-brand py-6 px-10"
    >
      <div className="flex items-center space-x-5">
        <SearchBar />

        <Popover.Root>
          <Popover.Trigger
            onClick={() => {
              dispatch(setNotRead(false));
            }}
          >
            <BiBell
              className={cx("w-6 h-auto", {
                "text-red-300": notRead,
              })}
            />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content side="bottom" align="end" sideOffset={15}>
              <div className="flex flex-col rounded-md bg-paper shadow-md space-y-8 p-8">
                <H6>Recent notifications</H6>

                <div className="flex flex-col space-y-6">
                  {notifications.length === 0 && (
                    <div className="w-[100%] h-[100%] flex justify-center items-center">
                      <span className="text-paper-contrast/60">
                        No notifications
                      </span>
                    </div>
                  )}

                  {notifications.map((notification) => (
                    <div className="flex space-x-4">
                      <Avatar src={notification.project.avatar} />

                      <div className="flex flex-col">
                        <span className="text-lg">
                          {notification.project.name}
                        </span>

                        <span className="text-sm text-paper-contrast/80">
                          {notification.text}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="text-paper-contrast/60 text-sm">
                          {dayjs(new Date(notification.date)).format("lll")}
                        </span>
                      </div>
                    </div>
                  ))}
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
  const [text, setText] = useState("");

  const search = useDebouncedValue(text, 500);

  const [result, setResult] = useState<SearchResponse>({
    projects: [],
    users: [],
  });

  useEffect(() => {
    if (text) api.search({query: search}).then(({data}) => setResult(data));
  }, [search]);

  return (
    <div
      className={twMerge(
        cx(
          "flex items-center relative rounded-lg px-3 py-2 -my-2 -mx-3 border-2 border-transparent",
          {
            "border-accent": showInput,
          },
        ),
      )}
    >
      {showInput && (
        <SearchBarInput
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
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

      {showInput && text && (
        <div
          className="absolute z-50 w-[100%] left-0 bg-[#F1F5F9]"
          style={{
            top: `3rem`,
          }}
        >
          {result.projects.length === 0 && result.users.length === 0 && (
            <div className="w-[100%] m-auto p-4">
              <span className="text-lg text-paper-contrast/75">No result</span>
            </div>
          )}

          {result.users.map((u, idx) => (
            <div
              key={idx}
              role="presentation"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();

                navigate(`/profiles/${u.id}`);
              }}
              className="w-[100%] cursor-pointer flex items-center justify-between p-4 border border-t-[#D2D1D1]"
            >
              <div className="flex items-center space-x-3 w-[100%] overflow-hidden">
                <Avatar src={u.avatar} />

                <span className="w-[60%] overflow-hidden whitespace-nowrap">
                  {u.firstName} {u.lastName}
                </span>
              </div>
            </div>
          ))}

          {result.projects.map((p, idx) => (
            <div
              key={idx}
              role="presentation"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();

                navigate(`/projects/${p.id}`);
              }}
              className="w-[100%] cursor-pointer flex items-center justify-between p-5 border border-t-[#D2D1D1]"
            >
              <div className="flex items-center space-x-3 w-[100%] overflow-hidden">
                <Avatar src={p.avatar} />

                <span className="w-[60%] overflow-hidden whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SearchBarInputProps {
  onBlur: () => void;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchBarInput: React.FC<SearchBarInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className="mr-4">
      <input
        value={props.value}
        onChange={props.onChange}
        className="bg-transparent border-none outline-none"
        ref={inputRef}
        onBlur={props.onBlur}
      />
    </form>
  );
};

type Flag = "usa" | "russia";

const LanguageSelect: React.FC = () => {
  const {i18n} = useTranslation();

  const [flag, setFlag] = useState<Flag>("russia");

  const flags = {
    usa: Icon.Flag.USA,
    russia: Icon.Flag.Russia,
  };

  const Flag = flags[flag]!;

  return (
    <Select.Root
      onValueChange={(value) => {
        setFlag(value as Flag);

        if (value === "usa") {
          i18n.changeLanguage("en");
        } else if (value === "russia") {
          i18n.changeLanguage("ru");
        }
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
