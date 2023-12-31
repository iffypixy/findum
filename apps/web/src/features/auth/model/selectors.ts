import {RootState} from "@shared/lib/store";

const state = (s: RootState) => s.auth;

export const credentials = (s: RootState) => state(s).credentials;
export const authenticated = (s: RootState) => state(s).authenticated;
