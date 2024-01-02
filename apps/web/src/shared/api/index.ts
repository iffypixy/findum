import {request} from "@shared/lib/request";
import {Nullable} from "@shared/lib/types";

const getRooms = () =>
  request({method: "GET", url: "/rooms-service/room/find"});

interface GetUserData {
  userId: string;
}

const getUser = (data: GetUserData) =>
  request({method: "GET", url: `/rooms-service/user/${data.userId}`});

export interface Credentials {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role1: string;
  role2: string;
  role3: string;
  id: string;
}

const getMe = () =>
  request<Credentials>({method: "GET", url: "/rooms-service/user/me"});

export interface GetProjectsData {
  page: number;
  size: number;
  city?: string;
  role?: string;
}

export interface GetProjectsResponse {
  content: {
    address: {id: number; country: string; city: string};
    cards: [];
    description: string;
    finishDay: [number, number, number];
    founder: {
      name: Nullable<string>;
      surname: Nullable<string>;
      id: number;
      imageUrl: Nullable<string>;
      address: Nullable<{id: number; country: string; city: string}>;
    };
    goal: string;
    id: number;
    imageUrl: Nullable<string>;
    name: string;
    premiumLevel: string;
    startDay: [number, number, number];
    tasks: [];
  }[];
}

const getProjects = (data: GetProjectsData) =>
  request<GetProjectsResponse>({
    method: "POST",
    url: "/rooms-service/room/find",
    data: {
      page: data.page,
      size: data.size,
      city: data.city,
      position: data.role,
    },
  });

interface GetProjectsByFounderIdData {
  founderId: number;
}

const getProjectsByFounderId = (data: GetProjectsByFounderIdData) =>
  request<GetProjectsResponse>({
    method: "POST",
    url: "/rooms-service/room/by-founder",
    params: {
      founderId: data.founderId,
    },
  });

interface GetProjectsByMemberIdData {
  memberId: number;
}

const getProjectsByMemberId = (data: GetProjectsByMemberIdData) =>
  request({
    method: "POST",
    url: "/rooms-service/room/by-member",
    params: {
      memberId: data.memberId,
    },
  });

export interface CreateProjectData {
  name: string;
  description: string;
  goal: string;
  startDay: Date;
  finishDay: Date;
  founderId: number;
  address: {
    country: string;
    city: string;
  };
}

export interface Project {
  id: number;
  name: string;
}

const createProject = (data: CreateProjectData) =>
  request<Project>({
    method: "POST",
    url: "/rooms-service/room",
    params: {founder_id: data.founderId},
    data,
  });

const getTotalAmountOfProjects = () =>
  request({method: "GET", url: "/rooms-service/room/count"});

export interface GetPotentialFriendsData {
  userId: number;
}

const getPotentialFriends = (data: GetPotentialFriendsData) =>
  request({
    method: "GET",
    url: `/rooms-service/user/friend/may-friend/${data.userId}`,
  });

export interface SendFriendRequestData {
  from: number;
  to: number;
}

const sendFriendRequest = (data: SendFriendRequestData) =>
  request({
    method: "PATCH",
    url: "/rooms-service/user/add-friend/request",
    params: {
      from: data.from,
      to: data.to,
    },
  });

export interface ConfirmFriendRequestData {
  from: number;
  to: number;
}

const confirmFriendRequest = (data: ConfirmFriendRequestData) =>
  request({
    method: "PATCH",
    url: "/rooms-service/user/add-friend/confirm",
    params: {
      from: data.from,
      to: data.to,
    },
  });

export interface UpdateMeData {
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
}

const updateMe = (data: UpdateMeData) =>
  request({
    method: "PUT",
    url: `/rooms-service/user/${data.userId}`,
    data: {
      name: data.firstName,
      surname: data.lastName,
      age: 18,
      address: {
        country: "Kazakhstan",
        city: data.city,
      },
    },
  });

export const api = {
  getRooms,
  getUser,
  getMe,
  getProjects,
  getProjectsByFounderId,
  getProjectsByMemberId,
  createProject,
  getTotalAmountOfProjects,
  getPotentialFriends,
  sendFriendRequest,
  confirmFriendRequest,
  updateMe,
};
