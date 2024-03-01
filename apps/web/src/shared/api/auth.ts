import {GenericDto, request} from "@shared/lib/request";
import {Credentials, Location} from "@shared/lib/types";

export type GetCredentialsParams = void;

export interface GetCredentialsResponse {
  credentials: Credentials;
}

export type GetCredentialsDto = GenericDto<
  void,
  {
    credentials: Credentials;
  }
>;

export const getCredentials = () =>
  request<GetCredentialsDto["res"]>({
    url: "/api/auth/credentials",
  });

export type RegisterDto = GenericDto<
  {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    location: Location;
  },
  {
    credentials: Credentials;
  }
>;

export const register = (req: RegisterDto["req"]) =>
  request<RegisterDto["res"]>({
    url: "/api/auth/register",
    method: "POST",
    data: req,
  });

export type LoginDto = GenericDto<
  {
    email: string;
    password: string;
  },
  {
    credentials: Credentials;
  }
>;

export const login = (req: LoginDto["req"]) =>
  request<LoginDto["res"]>({
    url: "/api/auth/login",
    method: "POST",
    data: req,
  });

export type LogoutDto = GenericDto<void, void>;

export const logout = (req: LogoutDto["req"]) =>
  request<LogoutDto["res"]>({
    url: "/api/auth/logout",
    method: "POST",
    data: req,
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

export type ResetPasswordDto = GenericDto<
  {
    password: string;
    code: string;
  },
  {
    credentials: Credentials;
  }
>;

export const resetPassword = (req: ResetPasswordDto["req"]) =>
  request<ResetPasswordDto["res"]>({
    method: "POST",
    url: "/api/auth/recovery/reset",
    data: req,
  });
