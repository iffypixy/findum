import {PayloadAction, createReducer} from "@reduxjs/toolkit";

import {Fetchable, Nullable, Project, ProjectCard} from "@shared/lib/types";

import * as actions from "./actions";

interface ProjectsState {
  featured: Fetchable<Nullable<ProjectCard[]>>;
  all: Fetchable<Nullable<ProjectCard[]>>;
  founder: Fetchable<Nullable<Project[]>>;
  member: Fetchable<Nullable<Project[]>>;
  total: Fetchable<Nullable<number>>;
}

export const reducer = createReducer<ProjectsState>(
  {
    featured: {
      data: null,
      isFetching: false,
    },
    all: {
      data: null,
      isFetching: false,
    },
    founder: {
      data: null,
      isFetching: false,
    },
    member: {
      data: null,
      isFetching: false,
    },
    total: {
      data: null,
      isFetching: false,
    },
  },
  (builder) =>
    builder
      .addCase(
        actions.fetchFeaturedProjectCards.fulfilled.type,
        (
          state,
          action: PayloadAction<actions.FetchFeaturedProjectCardsRes>,
        ) => {
          state.featured.data = action.payload.cards;
        },
      )
      .addCase(
        actions.fetchProjectCards.fulfilled.type,
        (state, action: PayloadAction<actions.FetchProjectCardsRes>) => {
          state.all.data = action.payload.cards;
        },
      )
      .addCase(
        actions.fetchProjectsAsFounder.fulfilled.type,
        (state, action: PayloadAction<actions.FetchProjectsAsFounderRes>) => {
          state.founder.data = action.payload.projects;
        },
      )
      .addCase(
        actions.fetchProjectsAsMember.fulfilled.type,
        (state, action: PayloadAction<actions.FetchProjectsAsMemberRes>) => {
          state.member.data = action.payload.projects;
        },
      )
      .addCase(
        actions.fetchTotalAmountOfProjects.fulfilled.type,
        (
          state,
          action: PayloadAction<actions.FetchTotalAmountOfProjectsRes>,
        ) => {
          state.total.data = action.payload.total;
        },
      ),
);
