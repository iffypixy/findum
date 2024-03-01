import {GenericDto, request} from "@shared/lib/request";
import {Credentials, Location} from "@shared/lib/types";

export type EditProfileDto = GenericDto<
  {
    firstName?: string;
    lastName?: string;
    location?: Partial<Location>;
    avatar?: string;
    cv?: string;
  },
  {
    credentials: Credentials;
  }
>;

export const editProfile = (req: EditProfileDto["req"]) =>
  request<EditProfileDto["res"]>({
    url: "/api/profile/edit",
    method: "PUT",
    data: req,
  });

export type ChangePasswordDto = GenericDto<
  {
    currentPassword: string;
    newPassword: string;
  },
  {
    credentials: Credentials;
  }
>;

export const changePassword = (req: ChangePasswordDto["req"]) =>
  request<ChangePasswordDto["res"]>({
    url: "/api/profile/password/change",
    method: "PUT",
    data: req,
  });

export enum ProfileProgressType {
  CV = "cv",
  AVATAR = "avatar",
  PROJECTS = "projects",
}

export type GetProgressDto = GenericDto<
  void,
  {
    progress: ProfileProgressType[];
  }
>;

export const getProgress = () =>
  request<GetProgressDto["res"]>({
    url: "/api/profile/progress",
  });
