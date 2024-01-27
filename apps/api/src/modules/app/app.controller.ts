import {Controller, Get, Query, Session} from "@nestjs/common";

import {PrismaService} from "@lib/prisma";
import {SessionWithData} from "express-session";

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("search")
  async search(
    @Query("query") query: string,
    @Session() session: SessionWithData,
  ) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: session.userId,
        },
        OR: [
          {
            firstName: {
              contains: query,
            },
          },
          {
            lastName: {
              contains: query,
            },
          },
        ],
      },
      take: 5,
    });

    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
        ],
      },
      take: 5,
    });

    return {users, projects};
  }

  @Get("overview")
  async getOverview(@Session() session: SessionWithData) {
    const projectRequests = await this.prisma.projectRequest.findMany({
      where: {
        project: {
          founderId: session.userId,
        },
      },
      include: {
        project: true,
      },
    });

    const tasks = await this.prisma.projectTask.findMany({
      where: {
        member: {
          userId: session.userId,
        },
        status: {
          not: "DONE",
        },
      },
      include: {
        project: true,
      },
    });

    const friendRequests = await this.prisma.relationship.count({
      where: {
        OR: [
          {status: "FRIEND_REQ_1_2", user2Id: session.userId},
          {
            status: "FRIEND_REQ_2_1",
            user1Id: session.userId,
          },
        ],
      },
    });

    return {projectRequests, friendRequests, tasks};
  }
}
