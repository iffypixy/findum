import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {api} from "@shared/api";

const prefix = "auth";

export const fetchCredentials = createAsyncThunk(
  `${prefix}/fetchCredentials`,
  async () => {
    const {data} = await api.getMe();

    return data;
  },
);

export const setAuthenticated = createAction<boolean>(
  `${prefix}/setAuthenticated`,
);

export const setToken = createAction<string>(`${prefix}/setToken`);
