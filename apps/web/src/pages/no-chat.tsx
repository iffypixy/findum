import {useEffect, useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {twMerge} from "tailwind-merge";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import {Avatar, ContentTemplate} from "@shared/ui";
import {chatsModel} from "@features/chats";
import {useDispatch} from "@shared/lib/store";
import {dayjs} from "@shared/lib/dayjs";
import {navigate} from "wouter/use-location";

type Tab = "private" | "rooms";

export const NoChatPage: React.FC = () => {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState<Tab>("private");

  const {t} = useTranslation();

  const projectChats = useSelector(chatsModel.selectors.project);
  const privateChats = useSelector(chatsModel.selectors.cprivate);

  useEffect(() => {
    if (!privateChats) dispatch(chatsModel.actions.fetchPrivateChats());
    if (!projectChats) dispatch(chatsModel.actions.fetchProjectChats());
  }, []);

  return (
    <ContentTemplate>
      <Tabs.Root
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as Tab);
        }}
        className="h-[100%] flex flex-col"
      >
        <Tabs.List className={cx("px-8 transition-[height]")}>
          <Tabs.Trigger
            value="private"
            className={cx("bg-paper rounded-t-lg px-10 py-2", {
              "bg-paper-brand": currentTab === "private",
            })}
          >
            {t("common.private")}
          </Tabs.Trigger>

          <Tabs.Trigger
            value="rooms"
            className={cx("bg-paper rounded-t-lg px-10 py-2", {
              "bg-paper-brand": currentTab === "rooms",
            })}
          >
            {t("common.projects")}
          </Tabs.Trigger>
        </Tabs.List>

        <div className="flex h-[100%]">
          <div className="w-[40%] bg-[#F1F5F9] flex h-[100%] border-r-[#ccc] border">
            <Tabs.Content value="private" className="flex-1 overflow-y-auto">
              <div className="w-[100%] h-[100%] flex">
                <div
                  className={twMerge(
                    cx("w-[100%] h-[100%] overflow-y-auto transition-width"),
                  )}
                >
                  {privateChats?.length === 0 && (
                    <div className="flex w-[100%] h-[75%] justify-center items-center">
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
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6 cursor-pointer"
                          role="presentation"
                          onClick={() => {
                            navigate(`/chat/private/${chat.partner.id}`);
                          }}
                        >
                          <div className="flex flex-1 space-x-4">
                            <Avatar src={chat.partner.avatar} />

                            <div className="flex flex-col justify-between flex-1">
                              <span className="text-lg font-bold">
                                {chat.partner.firstName} {chat.partner.lastName}
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
                      ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="rooms" className="flex-1 overflow-y-auto">
              <div className="w-[100%] h-[100%] flex">
                <div
                  className={twMerge(
                    cx("w-[100%] h-[100%] overflow-y-auto transition-width"),
                  )}
                >
                  {projectChats?.length === 0 && (
                    <div className="flex w-[100%] h-[75%] justify-center items-center">
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
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6 cursor-pointer"
                          role="presentation"
                          onClick={() => {
                            navigate(`/chat/project/${chat.project.id}`);
                          }}
                        >
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
                      ))}
                </div>
              </div>
            </Tabs.Content>
          </div>

          <div className="w-[60%] h-[100%] bg-[#F1F5F9] flex justify-center items-center">
            <span className="text-lg font-semibold text-paper-contrast/60">
              Select chat
            </span>
          </div>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};
