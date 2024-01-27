import {io} from "socket.io-client";
import {WsResponse} from "@findum/ws";

import {WsListener} from "./types";
import {WS_TIMEOUT} from "./constants";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(BACKEND_URL, {
  withCredentials: true,
});

export const ws = {
  emit: <R = void, P = any>(event: string, payload?: P) =>
    new Promise<R>((resolve, reject) => {
      socket
        .timeout(WS_TIMEOUT)
        .emit(event, payload, (error: Error, response: WsResponse<R>) => {
          if (error)
            reject("Something went wrong with a WebSocket event emission.");

          if (response.ok) resolve(response.payload);
          else reject(response.msg);
        });
    }),
  on: <T>(event: string, listener: WsListener<T>) => {
    socket.on(event, listener);
  },
  off: (events: string[]) => {
    events.forEach((event) => {
      socket.off(event);
    });
  },
  disable: <T>(event: string, listener: WsListener<T>) => {
    socket.off(event, listener);
  },
};
