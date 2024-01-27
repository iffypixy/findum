import {Controller, Get, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";

import {PAYMENT_TYPES, robokassa} from "@lib/robokassa";
import {PrismaService} from "@lib/prisma";

@Controller("payment")
export class PaymentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("callback")
  async handleResultUrlRequest(@Req() req: Request, @Res() res: Response) {
    robokassa.handleResultUrlRequest(req, res, async (values, data) => {
      if (data.type === PAYMENT_TYPES.PROJECT_CARD) {
        await this.prisma.projectCard.create({
          data: {
            projectId: data.projectId,
            slots: data.slots,
          },
        });
      } else if (data.type === PAYMENT_TYPES.PROJECT_CARD_SLOTS) {
        await this.prisma.projectCard.update({
          where: {
            id: data.cardId,
          },
          data: {
            slots: data.slots,
          },
        });
      }
    });
  }
}
