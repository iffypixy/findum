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

  @Get("private")
  async getPrivateChats(@Session() session: SessionWithData) {
    const chats = await this.prisma.chat.findMany({
      where: {
        privateChat: {
          OR: [{user1Id: session.userId}, {user2Id: session.userId}],
        },
      },
      include: {
        privateChat: {
          include: {
            user1: true,
            user2: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return {
      chats: chats.map((chat) => ({
        ...chat,
        lastMessage: chat.messages[0],
        partner:
          chat.privateChat.user1Id === session.userId
            ? chat.privateChat.user2
            : chat.privateChat.user1,
      })),
    };
  }

  @Get("project")
  async getProjectChats(@Session() session: SessionWithData) {
    const chats = await this.prisma.chat.findMany({
      where: {
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
        projectChat: {
          include: {
            project: true,
          },
        },
      },
    });

    return {
      chats: chats.map((chat) => ({
        ...chat,
        projectChat: undefined,
        lastMessage: chat.messages[0],
        project: chat.projectChat.project,
      })),
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
        OR: [
          {
            privateChat: {
              OR: [{user1Id: session.userId}, {user2Id: session.userId}],
            },
          },
          {
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
        ],
      },
      include: {
        projectChat: true,
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

  @Get("private/:partnerId")
  async getPrivateChat(
    @Param("partnerId") partnerId: string,
    @Session() session: SessionWithData,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: partnerId,
      },
    });

    if (!user) throw new NotFoundException("Partner not found");

    let chat = await this.prisma.chat.findFirst({
      where: {
        privateChat: {
          OR: [
            {user1Id: partnerId, user2Id: session.userId},
            {user1Id: session.userId, user2Id: partnerId},
          ],
        },
      },
    });

    if (!chat) {
      chat = await this.prisma.chat.create({
        data: {},
      });

      await this.prisma.privateChat.create({
        data: {
          user1Id: session.userId,
          user2Id: partnerId,
          chatId: chat.id,
        },
      });

      return {
        chat: {
          id: chat.id,
          partner: user,
        },
      };
    }

    return {
      chat: {
        id: chat.id,
        partner: user,
      },
    };
  }

  @Get("project/:projectId")
  async getProjectChat(
    @Param("projectId") projectId: string,
    @Session() session: SessionWithData,
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        projectChat: {
          project: {
            id: projectId,
            OR: [
              {
                members: {
                  some: {
                    userId: session.userId,
                  },
                },
              },
              {
                founderId: session.userId,
              },
            ],
          },
        },
      },
      include: {
        projectChat: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!chat) throw new NotFoundException("Project chat not found");

    return {
      chat: {
        id: chat.id,
        project: chat.projectChat.project,
      },
    };
  }
}
