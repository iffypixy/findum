import {useEffect, useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {IoIosExpand, IoIosContract} from "react-icons/io";
import {twMerge} from "tailwind-merge";
import {useParams} from "wouter";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {nanoid} from "@reduxjs/toolkit";

import {Avatar, ContentTemplate, TextField} from "@shared/ui";
import {api} from "@shared/api";
import {ChatMessage, Nullable, PrivateChat} from "@shared/lib/types";
import {chatsModel} from "@features/chats";
import {useDispatch} from "@shared/lib/store";
import {dayjs} from "@shared/lib/dayjs";
import {authModel} from "@features/auth";
import {setPrivateChats, setProjectChats} from "@features/chats/model/actions";
import {ws} from "@shared/lib/ws";
import {navigate} from "wouter/use-location";

type Tab = "private" | "rooms";

export const PrivateChatPage: React.FC = () => {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const [currentTab, setCurrentTab] = useState<Tab>("private");

  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);

  const credentials = useSelector(authModel.selectors.credentials);

  const {partnerId} = useParams() as {partnerId: string};

  const projectChats = useSelector(chatsModel.selectors.project);
  const privateChats = useSelector(chatsModel.selectors.cprivate);

  const [chat, setChat] = useState<Nullable<PrivateChat>>(null);

  const [messages, setMessages] = useState<Nullable<ChatMessage[]>>(null);

  useEffect(() => {
    api.chats.getPrivateChat({partnerId}).then(({data}) => {
      setChat(data.chat);

      api.chats
        .getChatMessages({id: data.chat.id, limit: 500, page: 1})
        .then(({data}) => setMessages(data.messages));
    });
  }, [partnerId]);

  useEffect(() => {
    if (!privateChats) dispatch(chatsModel.actions.fetchPrivateChats());
    if (!projectChats) dispatch(chatsModel.actions.fetchProjectChats());
  }, []);

  useEffect(() => {
    if (chat) {
      ws.on("message-sent", ({chat: c, message}) => {
        const isProject = !!c.project;
        const isPrivate = !!c.partner;

        if (isProject)
          dispatch(
            setProjectChats(
              projectChats?.map((ch) =>
                ch.id === c.id ? {...ch, lastMessage: message} : ch,
              ) || [{...c, lastMessage: message}],
            ),
          );

        if (isPrivate)
          dispatch(
            setPrivateChats(
              privateChats?.map((ch) =>
                ch.id === c.id ? {...ch, lastMessage: message} : ch,
              ) || [{...c, lastMessage: message}],
            ),
          );

        if (chat.id === c.id) {
          setMessages((messages) => {
            return messages ? [...messages, message] : [message];
          });
        }
      });
    }

    return () => {
      ws.off(["message-sent"]);
    };
  }, [chat]);

  useEffect(() => {
    const element = document.getElementById("msgs-list");

    element && element.scrollTo(0, element.scrollHeight);
  }, [messages]);

  if (!chat) return null;

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

        <div className="flex h-[100%] w-[100%] overflow-y-auto">
          <div
            className="w-[40%] bg-[#F1F5F9] flex h-[100%] border-r-[#ccc] border"
            style={{
              width: fullscreenEnabled ? "0%" : "40%",
            }}
          >
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
                          role="presentation"
                          onClick={() =>
                            navigate(`/chat/private/${chat.partner.id}`)
                          }
                          style={{
                            background:
                              chat.partner.id === partnerId
                                ? "#DDD"
                                : "initial",
                          }}
                          className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6 cursor-pointer"
                        >
                          <div className="flex flex-1 items-center space-x-4 overflow-hidden">
                            <Avatar src={chat.partner.avatar} />

                            <div className="flex flex-col justify-between flex-1 w-[100%] whitespace-nowrap text-ellipsis overflow-hidden">
                              <span className="text-lg font-bold">
                                {chat.partner.firstName} {chat.partner.lastName}
                              </span>

                              {chat.lastMessage && (
                                <span className="text-sm">
                                  {chat.lastMessage?.text}
                                </span>
                              )}
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
                          role="presentation"
                          onClick={() =>
                            navigate(`/chat/project/${chat.project.id}`)
                          }
                          className="flex items-center justify-between bg-paper-brand/75 border-b border-paper-contrast/25 p-6 cursor-pointer"
                        >
                          <div className="flex flex-1 items-center space-x-4 overflow-hidden">
                            <Avatar src={chat.project.avatar} />

                            <div className="flex flex-col justify-between flex-1 w-[100%] whitespace-nowrap text-ellipsis overflow-hidden">
                              <span className="text-lg font-bold">
                                {chat.project.name}
                              </span>

                              {chat.lastMessage && (
                                <span className="text-sm">
                                  {chat.lastMessage?.text}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex">
                            {chat.lastMessage && (
                              <span className="text-paper-contrast/40">
                                {dayjs(chat.lastMessage?.createdAt).format(
                                  "HH:mm",
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </Tabs.Content>
          </div>

          <div
            className={twMerge(
              cx(
                "w-[60%] flex flex-col overflow-y-auto transition-width bg-[#F1F5F9]",
                {
                  "w-[100%]": fullscreenEnabled,
                },
              ),
            )}
          >
            <div className="flex items-center justify-between bg-[#CBD2E4] p-6">
              <div
                role="presentation"
                onClick={() => {
                  navigate(`/profiles/${chat.partner.id}`);
                }}
                className="flex items-center space-x-4 cursor-pointer"
              >
                <Avatar src={chat.partner.avatar} />

                <div className="flex flex-col space-y-1">
                  <span className="text-paper-contrast font-semibold">
                    {chat.partner.firstName} {chat.partner.lastName}
                  </span>

                  <span className="text-sm text-paper-contrast/40"></span>
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

                {/* <Popover.Root>
                  <Popover.Trigger>
                    <BiDotsVerticalRounded className="w-6 h-auto" />
                  </Popover.Trigger>

                  <Popover.Portal>
                    <Popover.Content align="end" side="bottom" sideOffset={20}>
                      <div className="flex flex-col bg-paper text-sm rounded-xl overflow-hidden shadow-md">
                        <button className="py-4 px-8">Clear messages</button>

                        <div className="w-[100%] h-[1px] bg-paper-contrast/25" />

                        <button className="py-4 px-8">Show data</button>

                        <div className="w-[100%] h-[1px] bg-paper-contrast/25" />

                        <button className="py-4 px-8">Unmute</button>
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root> */}
              </div>
            </div>

            <div
              className="flex flex-col flex-1 p-6 space-y-6 overflow-y-auto"
              id="msgs-list"
            >
              {messages?.map((msg) => (
                <div
                  key={msg.id}
                  className="flex w-[45%]"
                  style={{
                    marginLeft:
                      msg.sender.id === credentials.data?.id
                        ? "auto"
                        : "initial",
                    justifyContent:
                      msg.sender.id === credentials.data?.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div
                    className="inline-flex rounded-lg space-y-1 p-3 flex-col break-words max-w-[100%]"
                    style={{
                      background:
                        msg.sender.id === credentials.data?.id
                          ? "#CBCFFF"
                          : "#FFFFFF",
                    }}
                  >
                    <div className="flex justify-between items-center space-x-8">
                      <span className="text-paper-contrast/60">
                        {msg.sender.firstName}
                      </span>

                      <span className="text-paper-contrast/60 text-sm">
                        {dayjs(msg.createdAt).format("HH:mm")}
                      </span>
                    </div>

                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6 bg-[#CBD2E4] p-6">
              {/* <button>
                <RiAttachment2 className="w-8 h-auto" />
              </button> */}

              <TextField
                borderless
                className="flex-1 bg-white rounded-xl h-[3rem]"
                placeholder="Message"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    api.chats.sendMessage({
                      chatId: chat.id,
                      text: e.currentTarget.value,
                    });

                    const msg = {
                      id: nanoid(),
                      text: e.currentTarget.value,
                      sender: credentials.data!,
                      createdAt: new Date(),
                    };

                    setMessages(messages ? [...messages, msg] : [msg]);

                    if (privateChats)
                      dispatch(
                        setPrivateChats(
                          [...privateChats].map((c) =>
                            c.id === chat.id ? {...c, lastMessage: msg} : c,
                          ),
                        ),
                      );

                    const exist = privateChats?.some((c) => c.id === chat.id);

                    if (!exist)
                      dispatch(
                        setPrivateChats([
                          ...privateChats!,
                          {...chat, lastMessage: msg},
                        ]),
                      );

                    e.currentTarget.value = "";
                  }
                }}
              />

              {/* <button>
                <BiSmile className="w-8 h-auto" />
              </button> */}
            </div>
          </div>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};
