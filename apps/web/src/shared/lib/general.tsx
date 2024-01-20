import {authModel} from "@features/auth";
import {ProjectRequest, api} from "@shared/api";
import {PropsWithChildren, useEffect} from "react";
import {useSelector} from "react-redux";
import {create} from "zustand";
import {ProjectTask} from "./types";

interface GeneralStore {
  friendRequests: number;
  projectRequests: ProjectRequest[];
  tasks: ProjectTask[];
  addFriendRequests: (requests: number) => void;
  setProjectRequests: (requests: ProjectRequest[]) => void;
  setTasks: (tasks: ProjectTask[]) => void;
}

export const useGeneralStore = create<GeneralStore>((set) => ({
  friendRequests: 0,
  projectRequests: [],
  tasks: [],
  addFriendRequests: (requests: number) =>
    set((store) => ({
      ...store,
      friendRequests: store.friendRequests + requests,
    })),
  setProjectRequests: (requests: ProjectRequest[]) =>
    set({projectRequests: requests}),
  setTasks: (tasks: ProjectTask[]) => set({tasks}),
}));

export const General: React.FC<PropsWithChildren> = ({children}) => {
  const isAuthenticated = useSelector(authModel.selectors.isAuthenticated);

  const {setProjectRequests, addFriendRequests, setTasks} = useGeneralStore(
    (s) => s,
  );

  useEffect(() => {
    if (isAuthenticated)
      api.getOverview().then(({data}) => {
        setProjectRequests(data.projectRequests);
        addFriendRequests(data.friendRequests);
        setTasks(data.tasks);
      });
  }, [isAuthenticated]);

  return <>{children}</>;
};
