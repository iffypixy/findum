import {events} from "@shared/api/chats";
import {queryClient} from "@shared/lib/query";
import {Chat, ChatMessage, TODO} from "@shared/lib/types";
import {useWsListener} from "@shared/lib/ws";

import {privateQueryKeys, projectQueryKeys} from "../queries";

export const useChatListeners = () => {
  useWsListener<{
    chat: Chat;
    message: ChatMessage;
  }>(events.client.MESSAGE_SENT, ({chat, message}) => {
    const result = queryClient.getQueryData([
      "chats",
      chat.id,
      "messages",
    ]) as TODO;

    queryClient.setQueryData(["chats", chat.id, "messages"], {
      messages: result ? [...result.messages, message] : [message],
    });

    const privates = queryClient.getQueryData(
      privateQueryKeys.list.queryKey,
    ) as TODO;
    const projects = queryClient.getQueryData(
      projectQueryKeys.list.queryKey,
    ) as TODO;

    console.log(privates, projects);

    if (privates && (chat as TODO).privateChat) {
      const isInList = !!privates.chats.some((c: TODO) => c.id === chat.id);

      if (isInList) {
        queryClient.setQueryData(privateQueryKeys.list.queryKey, {
          chats: privates.chats.map((c: TODO) =>
            c.id === chat.id ? {...c, lastMessage: message} : c,
          ),
        });
      } else {
        queryClient.setQueryData(privateQueryKeys.list.queryKey, {
          chats: [...privates.chats, {...chat, lastMessage: message}],
        });
      }
    } else if (projects && (chat as TODO).projectChat) {
      const isInList = !!projects.chats.some((c: TODO) => c.id === chat.id);

      if (isInList) {
        queryClient.setQueryData(projectQueryKeys.list.queryKey, {
          chats: projects.chats.map((c: TODO) =>
            c.id === chat.id ? {...c, lastMessage: message} : c,
          ),
        });
      } else {
        queryClient.setQueryData(projectQueryKeys.list.queryKey, {
          chats: [...projects.chats, {...chat, lastMessage: message}],
        });
      }
    }
  });
};
