import {PropsWithChildren, useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {twMerge} from "tailwind-merge";
import {useLocation} from "wouter";

import {Avatar, ContentTemplate, Link} from "@shared/ui";
import {dayjs} from "@shared/lib/dayjs";

import {usePrivateChats, useProjectChats} from "../queries";

enum Tab {
  PRIVATE = "private",
  PROJECT = "project",
}

export const ChatTemplate: React.FC<PropsWithChildren> = ({children}) => {
  const [location] = useLocation();

  const selectedTab = location.includes("private")
    ? Tab.PRIVATE
    : location.includes("project")
    ? Tab.PROJECT
    : null;

  const [currentTab, setCurrentTab] = useState<Tab>(selectedTab || Tab.PRIVATE);

  const [{chats: projectChats}] = useProjectChats();
  const [{chats: privateChats}] = usePrivateChats();

  const tabs = [
    {
      id: Tab.PRIVATE,
      label: "Private",
    },
    {
      id: Tab.PROJECT,
      label: "Project",
    },
  ];

  const anyProjectChats = projectChats && projectChats.length;
  const anyPrivateChats = privateChats && privateChats.length;

  return (
    <ContentTemplate preserveNoScroll>
      <Tabs.Root
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as Tab);
        }}
        className="w-full h-full flex flex-col"
      >
        <Tabs.List className={cx("transition-[height]")}>
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cx("bg-paper rounded-t-xl px-10 py-2", {
                "bg-paper-brand": currentTab === tab.id,
              })}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="w-full h-full flex rounded-xl rounded-tl-none overflow-hidden">
          <div className="w-[40%] bg-[#F1F5F9] flex h-[100%] border-r border-r-[#ccc] border">
            <Tabs.Content
              value={Tab.PRIVATE}
              className="flex-1 overflow-y-auto"
            >
              <div className="w-[100%] h-[100%] flex">
                <div
                  className={twMerge(
                    cx("w-[100%] h-[100%] overflow-y-auto transition-width"),
                  )}
                >
                  {!anyPrivateChats && (
                    <div className="flex w-[100%] h-[100%] justify-center items-center">
                      <span className="text-lg font-semibold text-paper-contrast/60">
                        No private chats yet
                      </span>
                    </div>
                  )}

                  {privateChats &&
                    [...privateChats]
                      .sort(
                        (a, b) =>
                          +new Date(b.lastMessage?.createdAt || 0) -
                          +new Date(a.lastMessage?.createdAt || 0),
                      )
                      .map((chat, idx) => (
                        <Link
                          key={idx}
                          href={`/chats/private/${chat.partner.id}`}
                        >
                          <div className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6 cursor-pointer">
                            <div className="flex flex-1 space-x-4">
                              <Avatar src={chat.partner.avatar} />

                              <div className="flex flex-col justify-between flex-1">
                                <span className="text-lg font-bold">
                                  {chat.partner.firstName}{" "}
                                  {chat.partner.lastName}
                                </span>

                                <span className="text-sm">
                                  {chat.lastMessage?.text}
                                </span>
                              </div>
                            </div>

                            <div className="flex">
                              <span className="text-paper-contrast/40">
                                {dayjs(chat.lastMessage?.createdAt).format(
                                  "HH:mm",
                                )}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content
              value={Tab.PROJECT}
              className="flex-1 overflow-y-auto"
            >
              <div className="w-[100%] h-[100%] flex">
                <div
                  className={twMerge(
                    cx("w-[100%] h-[100%] overflow-y-auto transition-width"),
                  )}
                >
                  {!anyProjectChats && (
                    <div className="flex w-[100%] h-[100%] justify-center items-center">
                      <span className="text-lg font-semibold text-paper-contrast/60">
                        No project chats yet
                      </span>
                    </div>
                  )}

                  {projectChats &&
                    [...projectChats]
                      .sort(
                        (a, b) =>
                          +new Date(b.lastMessage?.createdAt || 0) -
                          +new Date(a.lastMessage?.createdAt || 0),
                      )
                      .map((chat, idx) => (
                        <Link
                          key={idx}
                          href={`/chats/project/${chat.project.id}`}
                        >
                          <div className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6 cursor-pointer">
                            <div className="flex flex-1 space-x-4">
                              <Avatar src={chat.project.avatar} />

                              <div className="flex flex-col justify-between flex-1">
                                <span className="text-lg font-bold">
                                  {chat.project.name}
                                </span>

                                <span className="text-sm">
                                  {chat.lastMessage?.text}
                                </span>
                              </div>
                            </div>

                            <div className="flex">
                              <span className="text-paper-contrast/40">
                                {dayjs(chat.lastMessage?.createdAt).format(
                                  "HH:mm",
                                )}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                </div>
              </div>
            </Tabs.Content>
          </div>

          <div className="w-[60%] h-[100%] bg-[#F1F5F9] flex justify-center items-center">
            {children}
          </div>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};
