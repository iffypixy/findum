import {createQueryKeys} from "@lukemorales/query-key-factory";
import {useQuery} from "@tanstack/react-query";

import {api} from "@shared/api";
import {Id, PartialBy} from "@shared/lib/types";
import {
  GetChatMessagesDto,
  GetPrivateChatDto,
  GetProjectChatDto,
  SendMessageReq,
} from "@shared/api/chats";

export const useProjectChats = () => {
  const result = useQuery({
    ...projectQueryKeys.list,
    queryFn: async () => {
      const res = await api.chats.getProjectChats();

      return res.data;
    },
  });

  const chats = result.data?.chats;

  return [{chats}, result] as const;
};

export const usePrivateChats = () => {
  const result = useQuery({
    ...privateQueryKeys.list,
    queryFn: async () => {
      const res = await api.chats.getPrivateChats();

      return res.data;
    },
  });

  const chats = result.data?.chats;

  return [{chats}, result] as const;
};

export const usePrivateChat = (req: GetPrivateChatDto["req"]) => {
  const result = useQuery({
    ...privateQueryKeys.detail(req.partnerId),
    queryFn: async () => {
      const res = await api.chats.getPrivateChat(req);

      return res.data;
    },
  });

  const chat = result.data?.chat;

  return [{chat}, result] as const;
};

export const useProjectChat = (req: GetProjectChatDto["req"]) => {
  const result = useQuery({
    ...projectQueryKeys.detail(req.projectId),
    queryFn: async () => {
      const res = await api.chats.getProjectChat(req);

      return res.data;
    },
  });

  const chat = result.data?.chat;

  return [{chat}, result] as const;
};

export const useChatMessages = (
  req: PartialBy<GetChatMessagesDto["req"], "chatId">,
) => {
  const query = useQuery({
    queryKey: ["chats", req.chatId, "messages"],
    queryFn: async () => {
      const res = await api.chats.getChatMessages({
        ...req,
        chatId: req.chatId!,
      });

      return res.data;
    },
    enabled: !!req.chatId,
  });

  const messages = query.data?.messages;

  return [{messages}, query] as const;
};

export const sendMessage = (req: SendMessageReq) => api.chats.sendMessage(req);

export const projectQueryKeys = createQueryKeys("chats.project", {
  detail: (projectId: Id) => [projectId],
  list: ["list"],
});

export const privateQueryKeys = createQueryKeys("chats.private", {
  detail: (partnerId: Id) => [partnerId],
  list: ["list"],
});
