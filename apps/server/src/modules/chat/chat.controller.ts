import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Session,
} from "@nestjs/common";
import {SessionWithData} from "express-session";

import {PrismaService} from "@lib/prisma";

@Controller("chats")
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("/")
  async getChats(@Session() session: SessionWithData) {
    let chats = await this.prisma.chat.findMany({
      where: {
        privateChat: {
          OR: [{user1Id: session.userId}, {user2Id: session.userId}],
        },
        projectChat: {
          project: {
            OR: [
              {founderId: session.userId},
              {
                members: {
                  some: {
                    userId: session.userId,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    chats = chats.map((c) => ({
      ...c,
      lastMessage: c.messages[0],
    }));

    return {
      chats,
    };
  }

  @Get(":id/messages")
  async getMessages(
    @Param("id") id: string,
    @Session() session: SessionWithData,
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
        privateChat: {
          OR: [{user1Id: session.userId}, {user2Id: session.userId}],
        },
        projectChat: {
          project: {
            OR: [
              {founderId: session.userId},
              {
                members: {
                  some: {
                    userId: session.userId,
                  },
                },
              },
            ],
          },
        },
      },
    });

    if (!chat) throw new NotFoundException("Chat not found");

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        chatId: id,
      },
      include: {
        sender: true,
      },
    });

    return {
      messages,
    };
  }
}
