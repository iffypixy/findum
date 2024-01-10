import {request} from "@shared/lib/request";
import {Relationship, User} from "@shared/lib/types";

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

export interface SendFriendRequestParams {
  recipientId: string;
}

export interface SendFriendRequestResponse {
  relationship: Relationship;
}

export const sendFriendRequest = (params: SendFriendRequestParams) =>
  request<SendFriendRequestResponse>({
    url: "/api/friends/requests/send",
    method: "POST",
    data: {
      recipientId: params.recipientId,
    },
  });

export interface AcceptFriendRequestParams {
  senderId: string;
}

export interface AcceptFriendRequestResponse {
  relationship: Relationship;
}

export const acceptFriendRequest = (params: AcceptFriendRequestParams) =>
  request<AcceptFriendRequestResponse>({
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

export const rejectFriendRequest = (params: RejectFriendRequestParams) =>
  request<RejectFriendRequestResponse>({
    url: "/api/friends/requests/reject",
    method: "POST",
    data: {
      senderId: params.senderId,
    },
  });

export interface RemoveFriendParams {
  friendId: string;
}

export interface RemoveFriendResponse {
  relationship: Relationship;
}

export const removeFriend = (params: RemoveFriendParams) =>
  request<RemoveFriendResponse>({
    url: "/api/friends/remove",
    method: "DELETE",
    data: {
      friendId: params.friendId,
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
