import {Injectable, CanActivate, ExecutionContext} from "@nestjs/common";
import {Request} from "express";

import {PrismaService} from "@lib/prisma";

@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const userId = request.session.userId;

    if (userId) {
      const count = await this.prisma.user.count({
        where: {
          id: request.session.userId,
        },
      });

      return count > 0;
    }

    return false;
  }
}
