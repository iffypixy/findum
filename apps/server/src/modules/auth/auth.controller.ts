import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Session,
  UseGuards,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import {Request} from "express";
import {SessionWithData} from "express-session";
import {nanoid} from "nanoid";

import {PrismaService} from "@lib/prisma";
import {mappers} from "@lib/mappers";
import {emtransporter} from "@lib/email";
import {RedisService} from "@lib/redis";
import * as url from "@lib/url";

import * as dtos from "./dtos";
import {IsAuthenticated} from "./guards";

const VERIFICATION_EXPIRY = 1800;

@Controller("auth")
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @HttpCode(201)
  @Post("register")
  async register(
    @Body() dto: dtos.RegisterDto,
    @Session() session: SessionWithData,
    @Req() req: Request,
  ) {
    const isEmailTaken = await this.prisma.user
      .findFirst({
        where: {
          email: dto.email,
        },
        select: {
          id: true,
        },
      })
      .then((r) => Boolean(r));

    if (isEmailTaken)
      throw new BadRequestException("Email you provided is already taken");

    let location = await this.prisma.location.findFirst({
      where: {
        country: dto.location.country,
        AND: {
          city: dto.location.city,
        },
      },
    });

    if (!location) {
      location = await this.prisma.location.create({
        data: {
          country: dto.location.country,
          city: dto.location.city,
        },
      });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hash,
        avatar: dto.avatar,
        isVerified: false,
        location: {
          connect: location,
        },
      },
    });

    const profile = await this.prisma.profile.create({
      data: {
        roles: [dto.profile.role1, dto.profile.role2, dto.profile.role3],
        userId: user.id,
      },
    });

    const verificationId = nanoid();

    await this.redis.set(verificationId, user.id);
    await this.redis.expire(verificationId, VERIFICATION_EXPIRY);

    const baseUrl = url.getBaseUrl(req);
    const verificationUrl = `${baseUrl}/auth/verify/${verificationId}`;

    emtransporter.sendMail({
      to: dto.email,
      subject: "Welcome to MetaOrta!",
      text: `Confirm your registration via this link: ${verificationUrl}`,
    });

    session.user = {...user, profile, location};
    session.userId = user.id;

    return {
      credentials: mappers.credentials({
        ...user,
        profile,
        location,
      }),
    };
  }

  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: dtos.LoginDto, @Session() session: SessionWithData) {
    const exception = new BadRequestException("Invalid credentials");

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
      include: {
        location: true,
        profile: true,
      },
    });

    if (!user) throw exception;

    const doPasswordsMatch = await bcrypt.compare(dto.password, user.password);

    if (!doPasswordsMatch) throw exception;

    session.user = user;
    session.userId = user.id;

    return {
      credentials: mappers.credentials(user),
    };
  }

  @Get("verify/:id")
  async verifyEmail(@Param("id") id: string) {
    const userId = await this.redis.get(id);

    const exception = new BadRequestException("Invalid verification id");

    if (!userId) throw exception;

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw exception;

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });
  }

  @UseGuards(IsAuthenticated)
  @Get("credentials")
  async getCredentials(@Session() session: SessionWithData) {
    return {
      credentials: mappers.credentials(session.user),
    };
  }

  @UseGuards(IsAuthenticated)
  @HttpCode(204)
  @Post("logout")
  logout(@Session() session: SessionWithData) {
    session.user = null;
    session.userId = null;
  }

  @Get("available/email")
  async checkIfEmailAvailable(@Query("email") email: string) {
    const isEmailTaken = await this.prisma.user
      .findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      })
      .then((r) => Boolean(r));

    return {
      isAvailable: !isEmailTaken,
    };
  }

  @UseGuards(IsAuthenticated)
  @Post("verification/resend")
  async resendVerificationLink(
    @Session() session: SessionWithData,
    @Req() req: Request,
  ) {
    const id = nanoid();

    await this.redis.set(id, session.userId);
    await this.redis.expire(id, VERIFICATION_EXPIRY);

    const baseUrl = url.getBaseUrl(req);
    const verificationUrl = `${baseUrl}/auth/verify/${id}`;

    emtransporter.sendMail({
      to: session.user.email,
      subject: "Welcome to MetaOrta!",
      text: `Confirm your registration via this link: ${verificationUrl}`,
    });
  }
}
