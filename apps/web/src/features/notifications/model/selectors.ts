import {RootState} from "@shared/lib/store";

export const notifications = (state: RootState) =>
  state.notifications.notifications;
