import {RootState} from "@shared/lib/store";

const state = (s: RootState) => s.chats;

export const cprivate = (s: RootState) => state(s).private;

export const project = (s: RootState) => state(s).project;
