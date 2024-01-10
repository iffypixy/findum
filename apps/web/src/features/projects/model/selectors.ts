import {RootState} from "@shared/lib/store";

const state = (s: RootState) => s.projects;

export const all = (s: RootState) => state(s).all;
export const featured = (s: RootState) => state(s).featured;
export const founder = (s: RootState) => state(s).founder;
export const member = (s: RootState) => state(s).member;
export const total = (s: RootState) => state(s).total;
