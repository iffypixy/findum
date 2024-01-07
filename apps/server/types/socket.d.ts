import {SessionWithData} from "express-session";
import {Socket} from "socket.io";

declare module "socket.io" {
  export interface SocketWithData extends Socket {
    session: SessionWithData;
  }
}
