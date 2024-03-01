import {GenericDto, request} from "@shared/lib/request";
import {Id, Relationship, User} from "@shared/lib/types";

export type GetMyFriendsParams = void;

export interface GetMyFriendsResponse {
  friends: User[];
}

export const getMyFriends = () =>
  request<GetMyFriendsResponse>({
    url: "/api/friends",
  });

export type GetFriendRequestsParams = void;

export interface GetFriendRequestsResponse {
  friendRequests: User[];
}

export const getFriendRequests = () =>
  request<GetFriendRequestsResponse>({
    url: "/api/friends/requests",
  });

export type SendFriendRequestDto = GenericDto<
  {recipientId: Id},
  {relationship: Relationship}
>;

export const sendFriendRequest = (req: SendFriendRequestDto["req"]) =>
  request<SendFriendRequestDto["res"]>({
    url: "/api/friends/requests/send",
    method: "POST",
    data: {
      recipientId: req.recipientId,
    },
  });

export type AcceptFriendRequestDto = GenericDto<
  {
    senderId: Id;
  },
  {
    relationship: Relationship;
  }
>;

export const acceptFriendRequest = (params: AcceptFriendRequestDto["req"]) =>
  request<AcceptFriendRequestDto["res"]>({
    url: "/api/friends/requests/accept",
    method: "POST",
    data: {
      senderId: params.senderId,
    },
  });

export interface RejectFriendRequestParams {
  senderId: string;
}

export interface RejectFriendRequestResponse {
  relationship: Relationship;
}

export type RejectFriendRequestDto = GenericDto<
  {senderId: Id},
  {relationship: Relationship}
>;

export const rejectFriendRequest = (req: RejectFriendRequestDto["req"]) =>
  request<RejectFriendRequestResponse>({
    url: "/api/friends/requests/reject",
    method: "POST",
    data: {
      senderId: req.senderId,
    },
  });

export type RemoveFriendDto = GenericDto<
  {
    friendId: Id;
  },
  {
    relationship: Relationship;
  }
>;

export const removeFriend = (req: RemoveFriendDto["req"]) =>
  request<RemoveFriendDto["res"]>({
    url: "/api/friends/remove",
    method: "DELETE",
    data: {
      friendId: req.friendId,
    },
  });

export type GetPotentialFriendsParams = void;

export interface GetPotentialFriendsResponse {
  potentialFriends: User[];
}

export const getPotentialFriends = () =>
  request<GetPotentialFriendsResponse>({
    url: "/api/friends/potential",
  });
