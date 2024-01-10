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
}
