import {GenericDto, request} from "@shared/lib/request";
import {Id, UserProfile} from "@shared/lib/types";

export type GetUserDto = GenericDto<
  {
    id: Id;
  },
  {
    user: UserProfile;
  }
>;

export const getUser = (req: GetUserDto["req"]) =>
  request<GetUserDto["res"]>({
    url: `/api/users/${req.id}`,
  });
