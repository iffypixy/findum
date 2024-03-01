import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import {Server, SocketWithData} from "socket.io";
import {NotFoundException} from "@nestjs/common";

import {PrismaService} from "@lib/prisma";
import {SocketService} from "@lib/socket";

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: SocketService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

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

    if (chat.privateChat) {
      const partner =
        chat.privateChat.user1Id === socket.request.session.userId
          ? chat.privateChat.user2
          : chat.privateChat.user1;

      socket
        .to(this.service.getSocketIds(partner.id))
        .emit(events.client.MESSAGE_SENT, {
          message,
          chat,
        });
    } else if (chat.projectChat) {
      const members = await this.prisma.projectMember.findMany({
        where: {
          projectId: chat.projectChat.projectId,
        },
        select: {
          id: true,
        },
      });

      members.forEach((member) => {
        socket
          .to(this.service.getSocketIds(member.id))
          .emit(events.client.MESSAGE_SENT, {
            message,
            chat,
          });
      });
    }

    return {
      message,
    };
  }
}
