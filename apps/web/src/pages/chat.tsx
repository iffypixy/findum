import {useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {BiDotsVerticalRounded, BiSmile} from "react-icons/bi";
import {RiAttachment2} from "react-icons/ri";
import * as Popover from "@radix-ui/react-popover";
import {IoIosExpand, IoIosContract} from "react-icons/io";
import {twMerge} from "tailwind-merge";

import {Avatar, ContentTemplate, TextField} from "@shared/ui";

const avatar = "https://shorturl.at/ikvZ0";

type Tab = "private" | "rooms";

export const ChatPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("private");

  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);

  return (
    <ContentTemplate>
      <Tabs.Root
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as Tab);
        }}
        className="h-[100%] flex flex-col"
      >
        <Tabs.List
          className={cx("px-8 transition-[height]", {
            "h-0": fullscreenEnabled,
          })}
        >
          <Tabs.Trigger
            value="private"
            className={cx("bg-paper rounded-t-lg px-10 py-2", {
              "bg-paper-brand": currentTab === "private",
            })}
          >
            Private
          </Tabs.Trigger>

          <Tabs.Trigger
            value="rooms"
            className={cx("bg-paper rounded-t-lg px-10 py-2", {
              "bg-paper-brand": currentTab === "rooms",
            })}
          >
            Rooms
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="private" className="flex-1 overflow-y-auto">
          <div className="h-[100%] flex">
            <div
              className={twMerge(
                cx("w-[40%] h-[100%] overflow-y-auto transition-width", {
                  "w-0": fullscreenEnabled,
                }),
              )}
            >
              {Array.from({length: 15}).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6"
                >
                  <div className="flex flex-1 space-x-4">
                    <Avatar src={avatar} />

                    <div className="flex flex-col justify-between flex-1">
                      <span className="text-lg font-bold">Omar Moldashev</span>

                      <span className="text-sm">
                        Can we skip to the good part?
                      </span>
                    </div>
                  </div>

                  <div className="flex">
                    <span className="text-paper-contrast/40">16:59</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={twMerge(
                cx("w-[60%] flex flex-col overflow-y-auto transition-width", {
                  "w-[100%]": fullscreenEnabled,
                }),
              )}
            >
              <div className="flex items-center justify-between bg-paper-brand p-6">
                <div className="flex items-center space-x-4">
                  <Avatar src={avatar} />

                  <div className="flex flex-col space-y-1">
                    <span className="text-paper-contrast font-semibold">
                      Omar Moldashev
                    </span>
                    <span className="text-sm text-paper-contrast/40">
                      6 min. ago
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setFullscreenEnabled(!fullscreenEnabled);
                    }}
                  >
                    {fullscreenEnabled ? (
                      <IoIosContract className="w-6 h-auto" />
                    ) : (
                      <IoIosExpand className="w-6 h-auto" />
                    )}
                  </button>

                  <Popover.Root>
                    <Popover.Trigger>
                      <BiDotsVerticalRounded className="w-6 h-auto" />
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        align="end"
                        side="bottom"
                        sideOffset={20}
                      >
                        <div className="flex flex-col bg-paper text-sm rounded-xl overflow-hidden shadow-md">
                          <button className="py-4 px-8">Clear messages</button>

                          <div className="w-[100%] h-[1px] bg-paper-contrast/25" />

                          <button className="py-4 px-8">Show data</button>

                          <div className="w-[100%] h-[1px] bg-paper-contrast/25" />

                          <button className="py-4 px-8">Unmute</button>
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6"></div>

              <div className="flex items-center space-x-6 bg-paper-brand p-6">
                <button>
                  <RiAttachment2 className="w-8 h-auto" />
                </button>

                <TextField
                  className="flex-1 h-auto"
                  placeholder="Enter your message..."
                />

                <button>
                  <BiSmile className="w-8 h-auto" />
                </button>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="rooms">Rooms</Tabs.Content>
      </Tabs.Root>
    </ContentTemplate>
  );
};
