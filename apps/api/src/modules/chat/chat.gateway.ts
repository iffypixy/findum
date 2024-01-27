import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import {Server, Socket, SocketWithData} from "socket.io";
import {NotFoundException} from "@nestjs/common";

import {PrismaService} from "@lib/prisma";

import * as dtos from "./dtos";

const events = {
  server: {
    SEND_MESSAGE: "send-message",
  },
  client: {
    MESSAGE_SENT: "message-sent",
  },
};

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  private readonly server: Server;

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
    return sockets.filter((socket) => socket.request.session.user.id === id);
  }

  @SubscribeMessage(events.server.SEND_MESSAGE)
  async sendMessage(
    @MessageBody() dto: dtos.SendMessageDto,
    @ConnectedSocket() socket: SocketWithData,
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: dto.chatId,
      },
      include: {
        privateChat: {
          include: {
            user1: true,
            user2: true,
          },
        },
        projectChat: {
          include: {
            project: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!chat) throw new NotFoundException("Chat not found");

    const message = await this.prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        text: dto.text,
        senderId: socket.request.session.userId,
      },
      include: {
        sender: true,
      },
    });

    const c = {
      id: chat.id,
    };

    const sockets: Socket[] = [];

    if (chat.privateChat) {
      // @ts-ignore
      c.partner =
        chat.privateChat.user1Id === socket.request.session.userId
          ? chat.privateChat.user2
          : chat.privateChat.user1;

      // @ts-ignore
      sockets.push(...this.getSocketsByUserId(c.partner.id));
    } else {
      // @ts-ignore
      c.project = chat.projectChat.project;

      const sockets = chat.projectChat.project.members
        .map((m) => this.getSocketsByUserId(m.userId))
        .flat();

      sockets.push(...sockets);
    }

    // @ts-ignore
    socket.to(sockets.map((s) => s.id)).emit(events.client.MESSAGE_SENT, {
      chat: c,
      message,
    });

    return {
      message,
    };
  }

  // @SubscribeMessage("read-message")
  // async readMessage(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody("messageIds") messageIds: string[],
  //   @MessageBody("chatId") chatId: string,
  // ) {
  //   for (let i = 0; i < messageIds.length; i++) {
  //     await this.prisma.chatMessage.update({
  //       where: {
  //         id: messageIds[i],
  //         chatId,
  //       },
  //       data: {
  //         isRead: true,
  //       },
  //     });
  //   }
  // }
}
