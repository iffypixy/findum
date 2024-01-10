import {Injectable} from "@nestjs/common";
import {Server, Socket} from "socket.io";

@Injectable()
export class SocketService {
  public server: Server = null;

  public getSocketsByUserId(id: string, options?: {room: string}): Socket[] {
    const global = this.server.of("/");

    let sockets = Array.from(global.sockets.values());

    const room = options && options.room;

    if (room) {
      const iterable = global.adapter.rooms.get(room);

      if (iterable) {
        const ids = Array.from(iterable);

        sockets = ids.map((id) => this.server.of("/").sockets.get(id));
      }
    }

    // @ts-ignore
    return sockets.filter((socket) => socket.request.session.userId === id);
  }
}
