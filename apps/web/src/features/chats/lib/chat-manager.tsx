import {PropsWithChildren} from "react";

import {useWsListener} from "@shared/lib/ws";
import {Chat, ChatMessage} from "@shared/lib/types";

import {events} from "./events";

export const ChatManager: React.FC<PropsWithChildren> = ({children}) => {
  useWsListener<{message: ChatMessage; chat: Chat}>(
    events.MESSAGE_RECEIVED,
    () => {},
  );

  return <>{children}</>;
};
