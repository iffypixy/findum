import {PayloadAction, createReducer} from "@reduxjs/toolkit";

import {Project} from "@shared/api";
import {Nullable} from "@shared/lib/types";

import * as actions from "./actions";

interface ProjectsState {
  featured: Nullable<Project[]>;
  featuredFetching: boolean;
  all: Nullable<Project[]>;
  allFetching: boolean;
  owned: Nullable<Project[]>;
  ownedFetching: boolean;
  member: Nullable<Project[]>;
  memberFetching: boolean;
  total: Nullable<number>;
  totalFetching: boolean;
}

export const reducer = createReducer<ProjectsState>(
  {
    all: null,
    allFetching: false,
    featured: null,
    featuredFetching: false,
    owned: null,
    ownedFetching: false,
    member: null,
    memberFetching: false,
    total: null,
    totalFetching: false,
  },
  (builder) =>
    builder
      .addCase(actions.fetchAllProjects.pending.type, (state) => {
        state.allFetching = true;
      })
      .addCase(
        actions.fetchAllProjects.fulfilled.type,
        (state, action: PayloadAction<actions.FetchAllProjectsRes>) => {
          state.all = action.payload.content;
          state.allFetching = false;
        },
      )
      .addCase(actions.fetchAllProjects.rejected.type, (state) => {
        state.allFetching = false;
      })
      .addCase(actions.fetchFeaturedProjects.pending.type, (state) => {
        state.featuredFetching = true;
      })
      .addCase(
        actions.fetchFeaturedProjects.fulfilled.type,
        (state, action: PayloadAction<actions.FetchFeaturedProjectsRes>) => {
          state.featured = action.payload.content;
          state.featuredFetching = false;
        },
      )
      .addCase(actions.fetchFeaturedProjects.rejected.type, (state) => {
        state.featuredFetching = false;
      })
      .addCase(actions.fetchMemberProjects.pending.type, (state) => {
        state.memberFetching = true;
      })
      .addCase(
        actions.fetchMemberProjects.fulfilled.type,
        (state, action: PayloadAction<actions.FetchMemberProjectsRes>) => {
          state.member = action.payload.content;
          state.memberFetching = false;
        },
      )
      .addCase(actions.fetchMemberProjects.rejected.type, (state) => {
        state.memberFetching = false;
      })
      .addCase(actions.fetchOwnedProjects.pending.type, (state) => {
        state.ownedFetching = true;
      })
      .addCase(
        actions.fetchOwnedProjects.fulfilled.type,
        (state, action: PayloadAction<actions.FetchOwnedProjectsRes>) => {
          state.owned = action.payload.content;
          state.ownedFetching = false;
        },
      )
      .addCase(actions.fetchOwnedProjects.rejected.type, (state) => {
        state.ownedFetching = false;
      })
      .addCase(
        actions.fetchTotalAmountOfProjects.fulfilled.type,
        (state, action: PayloadAction<{count: number}>) => {
          state.total = action.payload.count;
        },
      ),
);
