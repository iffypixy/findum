import {PayloadAction, createReducer} from "@reduxjs/toolkit";

import {Notification} from "@shared/lib/types";

import * as actions from "./actions";

export interface NotificationsStore {
  notifications: Notification[];
  notRead: boolean;
}

export const reducer = createReducer<NotificationsStore>(
  {
    notifications: [],
    notRead: false,
  },
  (builder) => {
    builder
      .addCase(
        actions.addNotification.type,
        (state, action: PayloadAction<Notification>) => {
          state.notifications.push(action.payload);
          state.notRead = true;
        },
      )
      .addCase(
        actions.setNotRead.type,
        (state, action: PayloadAction<boolean>) => {
          state.notRead = action.payload;
        },
      );
  },
);
