import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {api} from "@shared/api";
import {
  GetProjectChatsParams,
  GetProjectChatsResponse,
  GetPrivateChatsParams,
  GetPrivateChatsResponse,
} from "@shared/api/chats";
import {PrivateChat, ProjectChat} from "@shared/lib/types";

const prefix = "chats";

export type FetchPrivateChatsReq = GetPrivateChatsParams;
export type FetchPrivateChatsRes = GetPrivateChatsResponse;

export const fetchPrivateChats = createAsyncThunk<
  FetchPrivateChatsRes,
  FetchPrivateChatsReq
>(`${prefix}/fetchPrivateChats`, async () => {
  const {data} = await api.chats.getPrivateChats();

  return data;
});

export type FetchProjectChatsReq = GetProjectChatsParams;
export type FetchProjectChatsRes = GetProjectChatsResponse;

export const fetchProjectChats = createAsyncThunk<
  FetchProjectChatsRes,
  FetchProjectChatsReq
>(`${prefix}/fetchProjectChats`, async () => {
  const {data} = await api.chats.getProjectChats();

  return data;
});

export const setProjectChats = createAction<ProjectChat[]>(
  `${prefix}/setProjectChats`,
);

export const setPrivateChats = createAction<PrivateChat[]>(
  `${prefix}/setPrivateChats`,
);
