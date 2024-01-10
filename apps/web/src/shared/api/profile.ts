import {request} from "@shared/lib/request";
import {Credentials, Location} from "@shared/lib/types";

export interface EditProfileParams {
  firstName?: string;
  lastName?: string;
  location?: Partial<Location>;
  avatar?: string;
  cv?: string;
}

export interface EditProfileResponse {
  credentials: Credentials;
}

export const editProfile = (params: EditProfileParams) =>
  request<EditProfileResponse>({
    url: "/api/profile/edit",
    method: "PUT",
    data: params,
  });

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  credentials: Credentials;
}

export const changePassword = (params: ChangePasswordParams) =>
  request<ChangePasswordResponse>({
    url: "/api/profile/password/change",
    method: "PUT",
    data: params,
  });
