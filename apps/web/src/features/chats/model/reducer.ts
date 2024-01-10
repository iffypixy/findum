import {PayloadAction, createReducer} from "@reduxjs/toolkit";

import {
  ChatMessage,
  Nullable,
  PrivateChat,
  ProjectChat,
} from "@shared/lib/types";

import * as actions from "./actions";

interface ChatsState {
  private: Nullable<PrivateChat[]>;
  project: Nullable<ProjectChat[]>;
  messages: Record<string, ChatMessage[]>;
}

export const reducer = createReducer<ChatsState>(
  {
    private: null,
    project: null,
    messages: {},
  },
  (builder) =>
    builder
      .addCase(
        actions.fetchPrivateChats.fulfilled.type,
        (state, action: PayloadAction<actions.FetchPrivateChatsRes>) => {
          state.private = action.payload.chats;
        },
      )
      .addCase(
        actions.fetchProjectChats.fulfilled.type,
        (state, action: PayloadAction<actions.FetchProjectChatsRes>) => {
          state.project = action.payload.chats;
        },
      )
      .addCase(
        actions.setPrivateChats.type,
        (state, action: PayloadAction<PrivateChat[]>) => {
          state.private = action.payload;
        },
      )
      .addCase(
        actions.setProjectChats.type,
        (state, action: PayloadAction<ProjectChat[]>) => {
          state.project = action.payload;
        },
      ),
);
