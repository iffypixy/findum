import {PropsWithChildren} from "react";

import {Project} from "@shared/lib/types";
import {useWsListener} from "@shared/lib/ws";

import {events} from "./events";
import {useNotificationStore} from "../store";

export const NotificationManager: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {addNotification} = useNotificationStore();

  useWsListener<{
    project: Project;
  }>(events.PROJECT_REQUEST_RECEIVED, ({project}) => {
    addNotification({
      title: project.name,
      description: "You received a project request!",
      picture: project.avatar,
      date: new Date(),
    });
  });

  return <>{children}</>;
};
