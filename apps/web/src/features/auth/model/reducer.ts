import {PayloadAction, createReducer} from "@reduxjs/toolkit";

import {Nullable} from "@shared/lib/types";

import * as actions from "./actions";

export interface Credentials {
  id: number;
  firstName: string;
  lastName: string;
  location: string;
  city: string;
  friends: any[];
}

interface AuthState {
  credentials: Nullable<Credentials>;
  authenticated: boolean;
  token: Nullable<string>;
}

export const reducer = createReducer<AuthState>(
  {
    credentials: null,
    authenticated: false,
    token: null,
  },
  (builder) =>
    builder
      .addCase(
        actions.fetchCredentials.fulfilled.type,
        (state, action: PayloadAction<Credentials>) => {
          state.credentials = action.payload;
          state.authenticated = true;
        },
      )
      .addCase(
        actions.setAuthenticated.type,
        (state, action: PayloadAction<boolean>) => {
          state.authenticated = action.payload;
        },
      )
      .addCase(
        actions.setToken.type,
        (state, action: PayloadAction<string>) => {
          state.token = action.payload;
        },
      ),
);
