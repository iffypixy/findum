import {Injectable} from "@nestjs/common";
import {Server, Socket} from "socket.io";

@Injectable()
export class SocketService {
  public server: Server = null;

  public getSockets(id: string, options?: {room: string}): Socket[] {
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

    return sockets.filter((socket) => socket.request.session.userId === id);
  }

  public getSocketIds(id: string) {
    const global = this.server.of("/");

    const sockets = Array.from(global.sockets.values());

    return sockets
      .filter((socket) => socket.request.session.userId === id)
      .map((s) => s.id);
  }
}
