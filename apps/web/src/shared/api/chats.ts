import {GenericDto, request} from "@shared/lib/request";
import {ChatMessage, Id, PrivateChat, ProjectChat} from "@shared/lib/types";
import {ws} from "@shared/lib/ws/request";

export const events = {
  server: {
    SEND_MESSAGE: "send-message",
  },
  client: {
    MESSAGE_SENT: "message-sent",
  },
};

export type GetPrivateChatsParams = void;

export interface GetPrivateChatsResponse {
  chats: PrivateChat[];
}

export const getPrivateChats = () =>
  request<GetPrivateChatsResponse>({
    url: "/api/chats/private",
  });

export type GetProjectChatsParams = void;

export interface GetProjectChatsResponse {
  chats: ProjectChat[];
}

export const getProjectChats = () =>
  request<GetProjectChatsResponse>({
    url: "/api/chats/project",
  });

export type GetChatMessagesDto = GenericDto<
  {
    chatId: Id;
    limit: number;
    page: number;
  },
  {
    messages: ChatMessage[];
  }
>;

export const getChatMessages = (req: GetChatMessagesDto["req"]) =>
  request<GetChatMessagesDto["res"]>({
    url: `/api/chats/${req.chatId}/messages`,
  });

export interface SendMessageReq {
  chatId: string;
  text: string;
}

export const sendMessage = (req: SendMessageReq) =>
  ws.emit(events.server.SEND_MESSAGE, req);

export type GetPrivateChatDto = GenericDto<
  {
    partnerId: Id;
  },
  {
    chat: PrivateChat;
  }
>;

export const getPrivateChat = (req: GetPrivateChatDto["req"]) =>
  request<GetPrivateChatDto["res"]>({
    url: `/api/chats/private/${req.partnerId}`,
  });

export type GetProjectChatDto = GenericDto<
  {
    projectId: Id;
  },
  {
    chat: ProjectChat;
  }
>;

export const getProjectChat = (req: GetProjectChatDto["req"]) =>
  request<GetProjectChatDto["res"]>({
    url: `/api/chats/project/${req.projectId}`,
  });
