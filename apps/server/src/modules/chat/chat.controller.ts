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
    let chats = await this.prisma.chat.findMany({
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

    chats = chats.map((c) => ({
      ...c,
      partner:
        c.privateChat.user1Id === session.userId
          ? c.privateChat.user2
          : c.privateChat.user1,
      lastMessage: c.messages[0],
    }));

    return {
      chats,
    };
  }

  @Get("project")
  async getProjectChats(@Session() session: SessionWithData) {
    let chats = await this.prisma.chat.findMany({
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

    chats = chats.map((c) => ({
      ...c,
      lastMessage: c.messages[0],
      project: c.projectChat.project,
      projectChat: undefined,
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

    const messages = (await this.prisma.chatMessage.findMany({
      where: {
        chatId: id,
      },
      include: {
        sender: true,
      },
    })) as any;

    // if (chat.projectChat?.projectId) {
    //   for (let i = 0; i < messages.length; i++) {
    //     const member = await this.prisma.projectMember.findFirst({
    //       where: {
    //         userId: messages[i].senderId,
    //         projectId: chat.projectChat?.projectId,
    //       },
    //     });

    //     messages[i].role = member.role;
    //   }
    // }

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
      // @ts-ignore
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
          lastMessage: null,
          messages: [],
        },
      };
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        chatId: chat.id,
      },
      include: {
        sender: true,
      },
      take: 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      chat: {
        id: chat.id,
        partner: user,
        lastMessage: messages[0],
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

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        chatId: chat.id,
      },
      include: {
        sender: true,
      },
    });

    return {
      chat: {
        id: chat.id,
        project: chat.projectChat.project,
        messages,
      },
    };
  }
}
