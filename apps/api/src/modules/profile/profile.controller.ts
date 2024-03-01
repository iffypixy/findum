import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

  @Get("progress")
  async getProfileProgress(@Session() session: SessionWithData) {
    enum PROFILE_PART {
      CV = "cv",
      AVATAR = "avatar",
      PROJECTS = "projects",
    }

    const progress: PROFILE_PART[] = [];

    const profile = await this.prisma.profile.findFirst({
      where: {
        userId: session.userId,
      },
    });

    if (!profile?.cv) progress.push(PROFILE_PART.CV);

    const initialPfp =
      "https://storage.yandexcloud.net/s3metaorta/photo_2024-01-09%2017.01.19.jpeg";

    if (!session.user.avatar || session.user.avatar === initialPfp)
      progress.push(PROFILE_PART.AVATAR);

    const projectsAsFounder = await this.prisma.project.count({
      where: {
        founderId: session.userId,
      },
    });

    if (projectsAsFounder === 0) {
      const projectsAsMember = await this.prisma.projectMember.count({
        where: {
          userId: session.userId,
        },
      });

      if (projectsAsMember === 0) {
        const requests = await this.prisma.projectRequest.count({
          where: {
            userId: session.userId,
          },
        });

        if (requests === 0) progress.push(PROFILE_PART.PROJECTS);
      }
    }

    return {progress};
  }
}
