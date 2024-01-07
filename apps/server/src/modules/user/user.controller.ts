import {mappers} from "@lib/mappers";
import {PrismaService} from "@lib/prisma";
import {Controller, Get, NotFoundException, Param} from "@nestjs/common";

@Controller("users")
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(":id")
  async getUser(@Param("id") id: string) {
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

    const members = (
      await this.prisma.projectMember.findMany({
        where: {
          userId: user.id,
        },
        select: {
          role: true,
        },
      })
    ).map((member) => member.role);

    const roles = members.reduce<Record<string, number>>((roles, role) => {
      const amount = roles[role] || 0;

      roles[role] = amount + 1;

      return roles;
    }, {});

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

    return {
      user: {
        ...mappers.completeUser(user),
        reviews: reviews.map(mappers.review),
        roles,
      },
    };
  }
}
