import {
  BadRequestException,
  Body,
  Controller,
  Put,
  Session,
} from "@nestjs/common";
import {SessionWithData} from "express-session";
import * as bcrypt from "bcryptjs";
import {Prisma} from "@prisma/client";

import {PrismaService} from "@lib/prisma";

import * as dtos from "./dtos";

@Controller("profile")
export class ProfileController {
  constructor(private readonly prisma: PrismaService) {}

  @Put("edit")
  async editProfile(
    @Session() session: SessionWithData,
    @Body() dto: dtos.EditProfileDto,
  ) {
    const dataProfile: Prisma.ProfileUpdateInput = {};

    if (dto.cv) dataProfile.cv = dto.cv;

    await this.prisma.profile.update({
      where: {
        userId: session.userId,
      },
      data: dataProfile,
    });

    const dataUser: Prisma.UserUpdateInput = {};

    if (dto.firstName) dataUser.firstName = dto.firstName;
    if (dto.lastName) dataUser.lastName = dto.lastName;
    if (dto.avatar) dataUser.avatar = dto.avatar;

    if (dto.location) {
      const locdata = {
        country: dto.location.country || session.user.location.country,
        city: dto.location.city || session.user.location.city,
      };

      let location = await this.prisma.location.findFirst({
        where: locdata,
      });

      if (!location) {
        location = await this.prisma.location.create({
          data: locdata,
        });
      }

      dataUser.location = {
        connect: location,
      };
    }

    const updated = await this.prisma.user.update({
      where: {
        id: session.userId,
      },
      data: dataUser,
      include: {
        location: true,
        profile: true,
      },
    });

    session.user = updated;

    return {
      credentials: updated,
    };
  }

  @Put("password/change")
  async changePassword(
    @Session() session: SessionWithData,
    @Body() dto: dtos.ChangePasswordDto,
  ) {
    const isCurrentPasswordCorrect = await bcrypt.compare(
      dto.currentPassword,
      session.user.password,
    );

    if (!isCurrentPasswordCorrect)
      throw new BadRequestException("Your current password is not correct");

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.newPassword, salt);

    const updated = await this.prisma.user.update({
      where: {
        id: session.userId,
      },
      data: {
        password: hash,
      },
      include: {
        location: true,
        profile: true,
      },
    });

    session.user = updated;

    return {
      credentials: updated,
    };
  }
}
