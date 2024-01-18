import {mappers} from "@lib/mappers";
import {PrismaService} from "@lib/prisma";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Session,
} from "@nestjs/common";
import {SessionWithData} from "express-session";

@Controller("users")
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(":id")
  async getUser(@Param("id") id: string, @Session() session: SessionWithData) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        location: true,
        profile: true,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    const members = await this.prisma.projectMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const roles = members
      .map((m) => m.role)
      .reduce<Record<string, number>>((roles, role) => {
        const amount = roles[role] || 0;

        roles[role] = amount + 1;

        return roles;
      }, {});

    const highlights = Object.entries(roles)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}) as Record<string, number>;

    const reviews = await this.prisma.review.findMany({
      where: {
        member: {
          userId: user.id,
        },
      },
      include: {
        project: {
          include: {
            founder: true,
          },
        },
      },
    });

    const relationship = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {user1Id: session.userId, user2Id: user.id},
          {user1Id: user.id, user2Id: session.userId},
        ],
      },
    });

    const history = await this.prisma.userHistory.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
        user: true,
      },
    });

    return {
      user: {
        ...mappers.completeUser(user),
        reviews: reviews.map(mappers.review),
        highlights,
        history,
        relationship: mappers.relationship({
          self: session.userId,
          relationship,
        }),
      },
    };
  }
}
