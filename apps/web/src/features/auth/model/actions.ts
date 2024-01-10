import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {api} from "@shared/api";
import {
  CheckIfEmailAvailableParams,
  CheckIfEmailAvailableResponse,
  GetCredentialsParams,
  GetCredentialsResponse,
  LoginParams,
  LoginResponse,
  LogoutParams,
  LogoutResponse,
  RegisterParams,
  RegisterResponse,
  ResendVerificationLinkParams,
  ResendVerificationLinkResponse,
} from "@shared/api/auth";
import {Credentials} from "@shared/lib/types";

const prefix = "auth";

export type FetchCredentialsReq = GetCredentialsParams;
export type FetchCredentialsRes = GetCredentialsResponse;

export const fetchCredentials = createAsyncThunk<
  FetchCredentialsRes,
  FetchCredentialsReq
>(`${prefix}/fetchCredentials`, async () => {
  const {data} = await api.auth.getCredentials();

  return data;
});

export type RegisterReq = RegisterParams;
export type RegisterRes = RegisterResponse;

export const register = createAsyncThunk<RegisterRes, RegisterReq>(
  `${prefix}/register`,
  async (payload) => {
    const {data} = await api.auth.register(payload);

    return data;
  },
);

export type LoginReq = LoginParams;
export type LoginRes = LoginResponse;

export const login = createAsyncThunk<RegisterRes, RegisterReq>(
  `${prefix}/login`,
  async (payload) => {
    const {data} = await api.auth.login(payload);

    return data;
  },
);

export type CheckIfEmailAvailableReq = CheckIfEmailAvailableParams;
export type CheckIfEmailAvailableRes = CheckIfEmailAvailableResponse;

export const checkIfEmailAvailable = createAsyncThunk<
  CheckIfEmailAvailableRes,
  CheckIfEmailAvailableReq
>(`${prefix}/checkIfEmailAvailable`, async (payload) => {
  const {data} = await api.auth.checkIfEmailAvailable(payload);

  return data;
});

export type ResendVerificationLinkReq = ResendVerificationLinkParams;
export type ResendVerificationLinkRes = ResendVerificationLinkResponse;

export const resendVerificationLink = createAsyncThunk<
  ResendVerificationLinkRes,
  ResendVerificationLinkReq
>(`${prefix}/resendVerificationLink`, async () => {
  const {data} = await api.auth.resendVerificationLink();

  return data;
});

export type LogoutReq = LogoutParams;
export type LogoutRes = LogoutResponse;

export const logout = createAsyncThunk<LogoutRes, LogoutReq>(
  `${prefix}/logout`,
  async () => {
    const {data} = await api.auth.logout();

    return data;
  },
);

export const setCredentials = createAction<Credentials>(
  `${prefix}/setCrEDENTIALS`,
);
