import {request} from "@shared/lib/request";
import {Credentials, Location} from "@shared/lib/types";

export type GetCredentialsParams = void;

export interface GetCredentialsResponse {
  credentials: Credentials;
}

export const getCredentials = () =>
  request<GetCredentialsResponse>({
    url: "/api/auth/credentials",
  });

export interface RegisterParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  location: Location;
}

export interface RegisterResponse {
  credentials: Credentials;
}

export const register = (params: RegisterParams) =>
  request<RegisterResponse>({
    url: "/api/auth/register",
    method: "POST",
    data: params,
  });

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  credentials: Credentials;
}

export const login = (params: LoginParams) =>
  request<LoginResponse>({
    url: "/api/auth/login",
    method: "POST",
    data: params,
  });

export type LogoutParams = void;

export type LogoutResponse = void;

export const logout = (params: LogoutParams) =>
  request<LogoutResponse>({
    url: "/api/auth/logout",
    method: "POST",
    data: params,
  });

export interface CheckIfEmailAvailableParams {
  email: string;
}

export interface CheckIfEmailAvailableResponse {
  isAvailable: boolean;
}

export const checkIfEmailAvailable = (params: CheckIfEmailAvailableParams) =>
  request<CheckIfEmailAvailableResponse>({
    url: "/api/auth/available/email",
    params,
  });

export type ResendVerificationLinkParams = void;

export type ResendVerificationLinkResponse = void;

export const resendVerificationLink = () =>
  request<ResendVerificationLinkResponse>({
    url: "/api/auth/verification/resend",
  });

export interface SendRecoveryParams {
  email: string;
}

export const sendRecovery = (params: SendRecoveryParams) =>
  request({
    method: "POST",
    url: "/api/auth/recovery/send",
    data: params,
  });

export interface ResetPasswordParams {
  password: string;
  code: string;
}

export interface ResetPasswordResponse {
  credentials: Credentials;
}

export const resetPassword = (params: ResetPasswordParams) =>
  request<ResetPasswordResponse>({
    method: "POST",
    url: "/api/auth/recovery/reset",
    data: params,
  });
