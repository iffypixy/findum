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
  setFriendRequests: (requests: number) => void;
  setProjectRequests: (requests: ProjectRequest[]) => void;
  setTasks: (tasks: ProjectTask[]) => void;
}

export const useGeneralStore = create<GeneralStore>((set) => ({
  friendRequests: 0,
  projectRequests: [],
  tasks: [],
  setFriendRequests: (requests: number) => set({friendRequests: requests}),
  setProjectRequests: (requests: ProjectRequest[]) =>
    set({projectRequests: requests}),
  setTasks: (tasks: ProjectTask[]) => set({tasks}),
}));

export const General: React.FC<PropsWithChildren> = ({children}) => {
  const isAuthenticated = useSelector(authModel.selectors.isAuthenticated);

  const {setProjectRequests, setFriendRequests, setTasks} = useGeneralStore(
    (s) => s,
  );

  useEffect(() => {
    if (isAuthenticated)
      api.getOverview().then(({data}) => {
        setProjectRequests(data.projectRequests);
        setFriendRequests(data.friendRequests);
        setTasks(data.tasks);
      });
  }, [isAuthenticated]);

  return <>{children}</>;
};
