import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import {SocketWithData} from "socket.io";

import {PrismaService} from "@lib/prisma";

import * as dtos from "./dtos";
import {NotFoundException} from "@nestjs/common";

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

  @SubscribeMessage(events.server.SEND_MESSAGE)
  async sendMessage(
    @MessageBody() dto: dtos.SendMessageDto,
    @ConnectedSocket() socket: SocketWithData,
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: dto.chatId,
      },
    });

    if (!chat) throw new NotFoundException("Chat not found");

    const message = await this.prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        text: dto.text,
        senderId: socket.session.userId,
      },
    });

    socket.to(chat.id).emit(events.client.MESSAGE_SENT, message);

    return {
      message,
    };
  }
}
