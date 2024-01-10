import {Project, User} from "@shared/lib/types";
import * as auth from "./auth";
import * as chats from "./chats";
import * as friends from "./friends";
import * as profile from "./profile";
import * as projects from "./projects";
import * as upload from "./upload";
import * as users from "./users";

import {request} from "@shared/lib/request";

export interface SearchParams {
  query: string;
}

export interface SearchResponse {
  users: User[];
  projects: Project[];
}

const search = (params: SearchParams) =>
  request<SearchResponse>({
    url: "/api/search",
    params,
  });

export const api = {
  search,
  auth,
  chats,
  friends,
  profile,
  projects,
  upload,
  users,
};
