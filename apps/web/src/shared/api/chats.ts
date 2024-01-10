import {request} from "@shared/lib/request";
import {ChatMessage, PrivateChat, ProjectChat} from "@shared/lib/types";
import {ws} from "@shared/lib/ws/ws";

const events = {
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

export interface GetChatMessagesParams {
  id: string;
  limit: number;
  page: number;
}

export interface GetChatMessagesResponse {
  messages: ChatMessage[];
}

export const getChatMessages = (params: GetChatMessagesParams) =>
  request<GetChatMessagesResponse>({
    url: `/api/chats/${params.id}/messages`,
  });

export interface SendMessageParams {
  chatId: string;
  text: string;
}

export const sendMessage = (params: SendMessageParams) =>
  ws.emit(events.server.SEND_MESSAGE, params);

export interface GetPrivateChatParams {
  partnerId: string;
}

export interface GetPrivateChatResponse {
  chat: PrivateChat;
}

export const getPrivateChat = (params: GetPrivateChatParams) =>
  request<GetPrivateChatResponse>({
    url: `/api/chats/private/${params.partnerId}`,
  });

export interface GetProjectChatParams {
  projectId: string;
}

export interface GetProjectChatResponse {
  chat: ProjectChat;
}

export const getProjectChat = (params: GetProjectChatParams) =>
  request<GetProjectChatResponse>({
    url: `/api/chats/project/${params.projectId}`,
  });
