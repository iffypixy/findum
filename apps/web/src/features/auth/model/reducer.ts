import {PayloadAction, createReducer} from "@reduxjs/toolkit";

import {Credentials, Fetchable, Nullable} from "@shared/lib/types";

import * as actions from "./actions";

interface AuthState {
  credentials: Fetchable<Nullable<Credentials>>;
  isAuthenticated: boolean;
}

export const reducer = createReducer<AuthState>(
  {
    credentials: {
      data: null,
      isFetching: true,
    },
    isAuthenticated: false,
  },
  (builder) =>
    builder
      .addCase(actions.fetchCredentials.pending.type, (state) => {
        state.credentials.isFetching = true;
      })
      .addCase(
        actions.fetchCredentials.fulfilled.type,
        (state, action: PayloadAction<actions.FetchCredentialsRes>) => {
          state.credentials.data = action.payload.credentials;
          state.credentials.isFetching = false;

          state.isAuthenticated = true;
        },
      )
      .addCase(actions.fetchCredentials.rejected.type, (state) => {
        state.credentials.isFetching = false;
      })
      .addCase(
        actions.register.fulfilled.type,
        (state, action: PayloadAction<actions.RegisterRes>) => {
          state.credentials.data = action.payload.credentials;
        },
      )
      .addCase(actions.logout.fulfilled.type, (state) => {
        state.credentials.data = null;
        state.isAuthenticated = false;
      })
      .addCase(
        actions.setCredentials.type,
        (state, action: PayloadAction<Credentials>) => {
          state.credentials.data = action.payload;
        },
      )
      .addCase(
        actions.setIsAuthetnicated.type,
        (state, action: PayloadAction<boolean>) => {
          state.isAuthenticated = action.payload;
        },
      )
      .addCase(
        actions.login.fulfilled.type,
        (state, action: PayloadAction<actions.LoginRes>) => {
          state.credentials.data = action.payload.credentials;
          state.isAuthenticated = true;
        },
      ),
);
