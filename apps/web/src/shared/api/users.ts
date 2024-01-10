import {request} from "@shared/lib/request";
import {UserProfile} from "@shared/lib/types";

export interface GetUserParams {
  id: string;
}

export interface GetUserResponse {
  user: UserProfile;
}

export const getUser = (params: GetUserParams) =>
  request<GetUserResponse>({
    url: `/api/users/${params.id}`,
  });
