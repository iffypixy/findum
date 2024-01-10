import {PropsWithChildren, useEffect} from "react";

import {notificationsModel} from "@features/notifications";

import {ws} from "./ws";
import {useDispatch} from "../store";
import {setPrivateChats, setProjectChats} from "@features/chats/model/actions";
import {useSelector} from "react-redux";
import {chatsModel} from "@features/chats";
import toast from "react-hot-toast";
import {navigate} from "wouter/use-location";

export const NOTIFICATION_EVENTS = {
  TASK_ACCEPTED: "task-accepted",
  TASK_ASSIGNED: "task-assigned",
  REQUEST_ACCEPTED: "request-accepted",
  REQUEST_DECLINED: "request-declined",
  REVIEW_GIVEN: "review-given",
  KICKED_FROM_PROJECT: "kicked-from-project",
  PROJECT_REQUEST_SENT: "project-request-sent",
};

export const SocketManager: React.FC<PropsWithChildren> = ({children}) => {
  const dispatch = useDispatch();

  const projectChats = useSelector(chatsModel.selectors.project);
  const privateChats = useSelector(chatsModel.selectors.cprivate);

  useEffect(() => {
    ws.on(NOTIFICATION_EVENTS.KICKED_FROM_PROJECT, ({project}) => {
      dispatch(
        notificationsModel.actions.addNotification({
          date: new Date(),
          project,
          text: "You were kicked from the project",
        }),
      );
    });

    ws.on(NOTIFICATION_EVENTS.PROJECT_REQUEST_SENT, ({project}) => {
      console.log(project);

      dispatch(
        notificationsModel.actions.addNotification({
          date: new Date(),
          project,
          text: "You received a project request",
        }),
      );
    });

    ws.on(NOTIFICATION_EVENTS.REQUEST_ACCEPTED, ({project}) => {
      dispatch(
        notificationsModel.actions.addNotification({
          date: new Date(),
          project,
          text: "You are accepted to the project",
        }),
      );
    });

    ws.on(NOTIFICATION_EVENTS.REQUEST_DECLINED, ({project}) => {
      dispatch(
        notificationsModel.actions.addNotification({
          date: new Date(),
          project,
          text: "Your project request is rejected",
        }),
      );
    });

    ws.on("message-sent", ({chat, message}) => {
      const isProject = !!chat.project;
      const isPrivate = !!chat.partner;

      if (isProject)
        dispatch(
          setProjectChats(
            projectChats?.map((c) =>
              c.id === chat.id ? {...c, lastMessage: message} : c,
            ) || [{...chat, lastMessage: message}],
          ),
        );

      if (isPrivate)
        dispatch(
          setPrivateChats(
            privateChats?.map((c) =>
              c.id === chat.id ? {...c, lastMessage: message} : c,
            ) || [{...chat, lastMessage: message}],
          ),
        );
    });

    ws.on("friend-request-sent", ({user}) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-paper-brand shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div
              role="presentation"
              className="flex items-start cursor-pointer"
              onClick={() => {
                navigate(`/profiles/${user.id}`);
              }}
            >
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  sent you a friend request
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    });

    ws.on("friend-request-accepted", ({user}) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-paper-brand shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div
              role="presentation"
              className="flex items-start cursor-pointer"
              onClick={() => {
                navigate(`/profiles/${user.id}`);
              }}
            >
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  accepted your friend request
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    });

    ws.on("friend-request-rejected", ({user}) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-paper-brand shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div
              role="presentation"
              className="flex items-start cursor-pointer"
              onClick={() => {
                navigate(`/profiles/${user.id}`);
              }}
            >
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  rejected your friend request
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    });

    ws.on("friend-removed", ({user}) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-paper-brand shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div
              role="presentation"
              className="flex items-start cursor-pointer"
              onClick={() => {
                navigate(`/profiles/${user.id}`);
              }}
            >
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  removed you from friends
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    });

    return () => {
      ws.off([
        NOTIFICATION_EVENTS.REQUEST_ACCEPTED,
        NOTIFICATION_EVENTS.REQUEST_DECLINED,
        NOTIFICATION_EVENTS.KICKED_FROM_PROJECT,
        NOTIFICATION_EVENTS.PROJECT_REQUEST_SENT,
        "message-sent",
      ]);
    };
  }, []);

  return <>{children}</>;
};
