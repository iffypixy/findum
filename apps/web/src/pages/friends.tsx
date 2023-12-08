import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {BiMessageSquareDetail, BiSearch, BiTrash} from "react-icons/bi";
import {BsPlus} from "react-icons/bs";
import * as Popover from "@radix-ui/react-popover";

import {
  Avatar,
  Button,
  ContentTemplate,
  H3,
  H4,
  H6,
  TextField,
} from "@shared/ui";
import header from "@shared/assets/profile-header.png";

const avatar = "https://shorturl.at/ikvZ0";

type Tab = "my-friends" | "new-friends";

export const FriendsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("my-friends");

  const hasFriends = Math.floor(Math.random() * 10) % 2 === 0;

  return (
    <ContentTemplate>
      <Tabs.Root
        value={currentTab}
        onValueChange={(tab) => {
          setCurrentTab(tab as Tab);
        }}
        className="flex flex-col h-[100%]"
      >
        <Tabs.List className="px-14">
          <Tabs.Trigger
            value="my-friends"
            className={cx("bg-paper rounded-t-lg px-10 py-2", {
              "bg-paper-brand": currentTab === "my-friends",
            })}
          >
            My friends
          </Tabs.Trigger>

          <Tabs.Trigger
            value="new-friends"
            className={cx("bg-paper rounded-t-lg px-10 py-2", {
              "bg-paper-brand": currentTab === "new-friends",
            })}
          >
            New friends
          </Tabs.Trigger>
        </Tabs.List>

        <div className="flex-1 flex flex-col bg-paper-brand">
          <Tabs.Content value="my-friends">
            {hasFriends ? (
              <div className="flex flex-col space-y-8 py-8">
                <div className="flex justify-end px-14">
                  <TextField
                    placeholder="Enter your friend name"
                    type="text"
                    suffix={<BiSearch className="w-6 h-auto text-main" />}
                    className="h-auto"
                  />
                </div>

                <ul className="border-t border-paper-contrast/20">
                  {Array.from({length: 8}).map((_, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-paper-contrast/20 py-6 px-14 last:border-none"
                    >
                      <div className="flex space-x-6 items-center">
                        <Avatar src={avatar} className="w-16 h-auto" />

                        <div className="flex flex-col">
                          <span className="text-lg font-semibold">
                            Asema Maxutova
                          </span>

                          <span className="text-paper-contrast/40 text-sm">
                            Frontend developer | Designer | Project manager
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-4 items-center">
                        <Button className="p-3">
                          <BiMessageSquareDetail />
                        </Button>

                        <Popover.Root>
                          <Popover.Trigger>
                            <Button className="p-3">
                              <BiTrash />
                            </Button>
                          </Popover.Trigger>

                          <Popover.Portal>
                            <Popover.Content side="bottom" align="start">
                              <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md space-y-4 p-6">
                                <H6>Delete the friend?</H6>

                                <div className="flex items-center text-sm space-x-4">
                                  <Button className="w-[50%]">Cancel</Button>
                                  <Button className="w-[50%]">Delete</Button>
                                </div>
                              </div>
                            </Popover.Content>
                          </Popover.Portal>
                        </Popover.Root>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <NoFriendsScreen />
            )}

            <PotentialFriendsSection />
          </Tabs.Content>

          <Tabs.Content value="new-friends">
            <div className="p-12">
              <div className="flex space-x-6 overflow-x-auto py-4">
                {Array.from({length: 7}).map((_, idx) => (
                  <div
                    key={idx}
                    className="min-w-[15rem] flex flex-col items-center bg-paper shadow-md relative rounded-2xl p-4 space-y-5"
                  >
                    <img
                      src={header}
                      alt="Profile header"
                      className="absolute top-0 left-0"
                    />

                    <Avatar src={avatar} className="w-20 h-auto z-10" />

                    <div className="flex flex-col text-center">
                      <span className="font-bold text-xl">Omar Aliev</span>

                      <span className="text-paper-contrast/60 text-sm">
                        Frontend developer
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center -space-x-2">
                        <Avatar src={avatar} className="w-5 h-auto" />
                        <Avatar src={avatar} className="w-5 h-auto" />
                        <Avatar src={avatar} className="w-5 h-auto" />
                      </div>

                      <span className="text-paper-contrast text-xs text-paper-contrast/50">
                        3 common friends
                      </span>
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Button className="w-[50%] text-xs">Cancel</Button>
                      <Button className="w-[50%] text-xs">Accept</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};

const NoFriendsScreen: React.FC = () => (
  <div className="flex flex-col justify-center items-center space-y-2 p-32">
    <H3>You don't have friends</H3>

    <span className="text-paper-contrast/40">
      Let’s try to find friends to build connections
    </span>
  </div>
);

const PotentialFriendsSection: React.FC = () => (
  <div className="flex flex-col space-y-8 p-14">
    <H4>You may know these people</H4>

    <div className="flex space-x-6 overflow-x-auto py-4">
      {Array.from({length: 7}).map((_, idx) => (
        <div
          key={idx}
          className="min-w-[15rem] flex flex-col items-center bg-paper shadow-md relative rounded-2xl p-4 space-y-5"
        >
          <img
            src={header}
            alt="Profile header"
            className="absolute top-0 left-0"
          />

          <Avatar src={avatar} className="w-20 h-auto z-10" />

          <div className="flex flex-col text-center">
            <span className="font-bold text-xl">Omar Aliev</span>

            <span className="text-paper-contrast/60 text-sm">
              Frontend developer
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-2">
              <Avatar src={avatar} className="w-5 h-auto" />
              <Avatar src={avatar} className="w-5 h-auto" />
              <Avatar src={avatar} className="w-5 h-auto" />
            </div>

            <span className="text-paper-contrast text-xs text-paper-contrast/50">
              3 common friends
            </span>
          </div>

          <Button className="inline-flex space-x-2">
            <div className="flex items-center justify-center border border-accent-contrast rounded-full">
              <BsPlus className="w-5 h-auto fill-accent-contrast" />
            </div>

            <span>Add friend</span>
          </Button>
        </div>
      ))}
    </div>
  </div>
);
