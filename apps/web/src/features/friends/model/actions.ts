import {createAsyncThunk} from "@reduxjs/toolkit";

import {api} from "@shared/api";
import {
  AcceptFriendRequestParams,
  AcceptFriendRequestResponse,
  GetFriendRequestsParams,
  GetFriendRequestsResponse,
  GetMyFriendsParams,
  GetMyFriendsResponse,
  GetPotentialFriendsParams,
  GetPotentialFriendsResponse,
  RejectFriendRequestParams,
  RejectFriendRequestResponse,
  RemoveFriendParams,
  RemoveFriendResponse,
  SendFriendRequestParams,
  SendFriendRequestResponse,
} from "@shared/api/friends";

const prefix = "friends";

export type FetchPotentialFriendsReq = GetPotentialFriendsParams;
export type FetchPotentialFriendsRes = GetPotentialFriendsResponse;

export const fetchPotentialFriends = createAsyncThunk<
  FetchPotentialFriendsRes,
  FetchPotentialFriendsReq
>(`${prefix}/fetchPotentialFriends`, async () => {
  const {data} = await api.friends.getPotentialFriends();

  return data;
});

export type FetchMyFriendsReq = GetMyFriendsParams;
export type FetchMyFriendsRes = GetMyFriendsResponse;

export const fetchMyFriends = createAsyncThunk<
  FetchMyFriendsRes,
  FetchMyFriendsReq
>(`${prefix}/fetchMyFriends`, async () => {
  const {data} = await api.friends.getMyFriends();

  return data;
});

export type FetchFriendRequestsReq = GetFriendRequestsParams;
export type FetchFriendRequestsRes = GetFriendRequestsResponse;

export const fetchFriendRequests = createAsyncThunk<
  FetchFriendRequestsRes,
  FetchFriendRequestsReq
>(`${prefix}/fetchFriendRequests`, async () => {
  const {data} = await api.friends.getFriendRequests();

  return data;
});

export type SendFriendRequestReq = SendFriendRequestParams;
export type SendFriendRequestRes = SendFriendRequestResponse;

export const sendFriendRequest = createAsyncThunk<
  SendFriendRequestRes,
  SendFriendRequestReq
>(`${prefix}/sendFriendRequest`, async (payload) => {
  const {data} = await api.friends.sendFriendRequest(payload);

  return data;
});

export type AcceptFriendRequestReq = AcceptFriendRequestParams;
export type AcceptFriendRequestRes = AcceptFriendRequestResponse;

export const acceptFriendRequest = createAsyncThunk<
  AcceptFriendRequestRes,
  AcceptFriendRequestReq
>(`${prefix}/acceptFriendRequest`, async (payload) => {
  const {data} = await api.friends.acceptFriendRequest(payload);

  return data;
});

export type RejectFriendRequestReq = RejectFriendRequestParams;
export type RejectFriendRequestRes = RejectFriendRequestResponse;

export const rejectFriendRequest = createAsyncThunk<
  RejectFriendRequestRes,
  RejectFriendRequestReq
>(`${prefix}/rejectFriendRequest`, async (payload) => {
  const {data} = await api.friends.rejectFriendRequest(payload);

  return data;
});

export type RemoveFriendReq = RemoveFriendParams;
export type RemoveFriendRes = RemoveFriendResponse;

export const removeFriend = createAsyncThunk<RemoveFriendRes, RemoveFriendReq>(
  `${prefix}/removeFriend`,
  async (payload) => {
    const {data} = await api.friends.removeFriend(payload);

    return data;
  },
);
