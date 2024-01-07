import {OnGatewayInit, WebSocketGateway} from "@nestjs/websockets";
import {NextFunction, Request, Response} from "express";
import {Server} from "socket.io";

import {session} from "@lib/session";
import {SocketService} from "@lib/socket";

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.server = server;

    server.use((socket, next: NextFunction) => {
      session(socket.request as Request, {} as Response, next);
    });
  }
}
