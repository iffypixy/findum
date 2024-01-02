import {createAsyncThunk} from "@reduxjs/toolkit";

import {
  CreateProjectData,
  GetProjectsData,
  GetProjectsResponse,
  Project,
  api,
} from "@shared/api";
import {RootState} from "@shared/lib/store";

const prefix = "projects";

export interface FetchAllProjectsReq extends GetProjectsData {}
export interface FetchAllProjectsRes extends GetProjectsResponse {}

export const fetchAllProjects = createAsyncThunk<
  FetchAllProjectsRes,
  FetchAllProjectsReq
>(`${prefix}/fetchAllProjects`, async (options) => {
  const {data} = await api.getProjects(options);

  return data;
});

export interface FetchFeaturedProjectsReq extends GetProjectsData {}
export interface FetchFeaturedProjectsRes extends GetProjectsResponse {}

export const fetchFeaturedProjects = createAsyncThunk<
  FetchFeaturedProjectsRes,
  void
>(`${prefix}/fetchFeaturedProjects`, async () => {
  const {data} = await api.getProjects({size: 6, page: 1});

  return data;
});

export interface FetchOwnedProjectsReq extends GetProjectsData {}
export interface FetchOwnedProjectsRes extends GetProjectsResponse {}

export const fetchOwnedProjects = createAsyncThunk(
  `${prefix}/fetchOwnedProjects`,
  async (_, thunk) => {
    const state = thunk.getState() as RootState;

    const {data} = await api.getProjectsByFounderId({
      founderId: state.auth.credentials!.id,
    });

    return data.content;
  },
);

export interface FetchMemberProjectsReq extends GetProjectsData {}
export interface FetchMemberProjectsRes extends GetProjectsResponse {}

export const fetchMemberProjects = createAsyncThunk(
  `${prefix}/fetchMemberProjects`,
  async (_, thunk) => {
    const state = thunk.getState() as RootState;

    const {data} = await api.getProjectsByMemberId({
      memberId: state.auth.credentials!.id,
    });

    return data;
  },
);

interface CreateProjectReq extends CreateProjectData {}

export const createProject = createAsyncThunk<Project, CreateProjectReq>(
  `${prefix}/createProject`,
  async (req) => {
    const {data} = await api.createProject(req);

    return data;
  },
);

export const fetchTotalAmountOfProjects = createAsyncThunk(
  `${prefix}/fetchTotalAmountOfProjects`,
  async () => {
    const {data} = await api.getTotalAmountOfProjects();

    return data;
  },
);
