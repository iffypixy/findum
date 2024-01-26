import {useEffect} from "react";

import {WsListener} from "./types";
import {ws} from "./request";

export const useWsListener = <T,>(event: string, listener: WsListener<T>) => {
  useEffect(() => {
    ws.on(event, listener);

    return () => {
      ws.disable(event, listener);
    };
  }, [event, listener]);
};
