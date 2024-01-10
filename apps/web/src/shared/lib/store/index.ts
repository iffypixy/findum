import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {useDispatch as useRootDispatch} from "react-redux";

import {projectsModel} from "@features/projects";
import {authModel} from "@features/auth";
import {chatsModel} from "@features/chats";
import {notificationsModel} from "@features/notifications";

const rootReducer = combineReducers({
  projects: projectsModel.reducer,
  auth: authModel.reducer,
  chats: chatsModel.reducer,
  notifications: notificationsModel.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useDispatch = (): RootDispatch => useRootDispatch<RootDispatch>();
