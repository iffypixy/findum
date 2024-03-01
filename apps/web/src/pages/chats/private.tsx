import {useParams} from "wouter";
import {nanoid} from "nanoid";

import {Avatar, Link, TextField} from "@shared/ui";
import {Id, TODO} from "@shared/lib/types";
import {dayjs} from "@shared/lib/dayjs";
import {useCredentials} from "@features/auth";
import {
  ChatTemplate,
  privateQueryKeys,
  sendMessage,
  useChatListeners,
  useChatMessages,
  usePrivateChat,
} from "@features/chats";
import {queryClient} from "@shared/lib/query";

export const PrivateChatPage: React.FC = () => {
  const [{credentials}] = useCredentials();

  const {partnerId} = useParams() as {partnerId: Id};

  const [{chat}] = usePrivateChat({partnerId});

  const [{messages}] = useChatMessages({
    chatId: chat?.id,
    limit: Infinity,
    page: 0,
  });

  useChatListeners();

  if (!chat) return null;

  return (
    <ChatTemplate>
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between bg-[#CBCFFF] p-6">
          <Link href={`/users/${chat.partner.id}`}>
            <div className="flex items-center space-x-4 cursor-pointer">
              <Avatar src={chat.partner.avatar} />

              <div className="flex flex-col space-y-1">
                <span className="text-paper-contrast font-semibold">
                  {chat.partner.firstName} {chat.partner.lastName}
                </span>

                <span className="text-sm text-paper-contrast/40"></span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-3"></div>
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
                  msg.sender.id === credentials?.id ? "auto" : "initial",
                justifyContent:
                  msg.sender.id === credentials?.id ? "flex-end" : "flex-start",
              }}
            >
              <div
                className="inline-flex rounded-lg space-y-1 p-3 flex-col break-words max-w-[100%]"
                style={{
                  background:
                    msg.sender.id === credentials?.id ? "#CBCFFF" : "#FFFFFF",
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

        <div className="flex items-center space-x-6 p-6">
          <TextField
            className="flex-1 bg-white rounded-xl h-[3rem]"
            placeholder="Message"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const text = event.currentTarget.value;

                if (!text) return;

                sendMessage({
                  chatId: chat.id,
                  text,
                });

                const message = {
                  id: nanoid(),
                  text: event.currentTarget.value,
                  sender: credentials,
                  createdAt: new Date(),
                };

                queryClient.setQueryData(["chats", chat.id, "messages"], {
                  messages: messages ? [...messages, message] : [message],
                });

                const {chats} = queryClient.getQueryData(
                  privateQueryKeys.list.queryKey,
                ) as TODO;

                const isChatInList = chats.some((c: TODO) => c.id === chat.id);

                if (isChatInList) {
                  queryClient.setQueryData(privateQueryKeys.list.queryKey, {
                    chats: chats.map((c: TODO) =>
                      c.id === chat.id ? {...c, lastMessage: message} : c,
                    ),
                  });
                } else {
                  queryClient.setQueryData(privateQueryKeys.list.queryKey, {
                    chats: [...chats, {...chat, lastMessage: message}],
                  });
                }

                event.currentTarget.value = "";
              }
            }}
          />
        </div>
      </div>
    </ChatTemplate>
  );
};
