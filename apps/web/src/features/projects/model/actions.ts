import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "@shared/api";
import {
  CreateProjectParams,
  CreateProjectResponse,
  GetCardsParams,
  GetCardsResponse,
  GetFeaturedProjectCardsResponse,
  GetProjectsAsFounderResponse,
  GetProjectsAsMemberResponse,
  GetTotalAmountOfProjectsResponse,
} from "@shared/api/projects";

const prefix = "projects";

export type FetchFeaturedProjectCardsRes = GetFeaturedProjectCardsResponse;
export type FetchFeaturedProjectCardsReq = void;

export const fetchFeaturedProjectCards = createAsyncThunk<
  FetchFeaturedProjectCardsRes,
  FetchFeaturedProjectCardsReq
>(`${prefix}/fetchFeaturedProjectCards`, async () => {
  const {data} = await api.projects.getFeaturedProjectCards();

  return data;
});

export type FetchProjectCardsReq = GetCardsParams;
export type FetchProjectCardsRes = GetCardsResponse;

export const fetchProjectCards = createAsyncThunk<
  FetchProjectCardsRes,
  FetchProjectCardsReq
>(`${prefix}/fetchProjectCards`, async (payload) => {
  const {data} = await api.projects.getCards(payload);

  return data;
});

export type FetchProjectsAsFounderReq = void;
export type FetchProjectsAsFounderRes = GetProjectsAsFounderResponse;

export const fetchProjectsAsFounder = createAsyncThunk<
  FetchProjectsAsFounderRes,
  FetchProjectsAsFounderReq
>(`${prefix}/fetchProjectsAsFounder`, async () => {
  const {data} = await api.projects.getProjectsAsFounder();

  return data;
});

export type FetchProjectsAsMemberReq = void;
export type FetchProjectsAsMemberRes = GetProjectsAsMemberResponse;

export const fetchProjectsAsMember = createAsyncThunk<
  FetchProjectsAsMemberRes,
  FetchProjectsAsMemberReq
>(`${prefix}/fetchProjectsAsMember`, async () => {
  const {data} = await api.projects.getProjectsAsMember();

  return data;
});

export type FetchTotalAmountOfProjectsReq = void;
export type FetchTotalAmountOfProjectsRes = GetTotalAmountOfProjectsResponse;

export const fetchTotalAmountOfProjects = createAsyncThunk(
  `${prefix}/fetchTotalAmountOfProjects`,
  async () => {
    const {data} = await api.projects.getTotalNumberOfProjects();

    return data;
  },
);

export type CreateProjectReq = CreateProjectParams;
export type CreateProjectRes = CreateProjectResponse;

export const createProject = createAsyncThunk<
  CreateProjectRes,
  CreateProjectReq
>(`${prefix}/createProject`, async (payload) => {
  const {data} = await api.projects.createProject(payload);

  return data;
});
