import {create} from "zustand";

interface Notification {
  title: string;
  description: string;
  picture: string;
  date: Date;
}

interface NotificationStore {
  list: Notification[];
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  list: [],
  addNotification: (n) =>
    set((s) => ({
      list: [...s.list, n],
    })),
}));
