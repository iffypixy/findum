import {RootState} from "@shared/lib/store";

const state = (s: RootState) => s.projects;

export const all = (s: RootState) => state(s).all;
export const featured = (s: RootState) => state(s).featured;
export const owned = (s: RootState) => state(s).owned;
export const member = (s: RootState) => state(s).member;
export const total = (s: RootState) => state(s).total;
