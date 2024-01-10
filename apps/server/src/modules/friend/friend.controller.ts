import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Session,
} from "@nestjs/common";
import {SessionWithData} from "express-session";
import {Relationship} from "@prisma/client";

import {PrismaService} from "@lib/prisma";
import {mappers} from "@lib/mappers";

import * as dtos from "./dtos";
import {SocketService} from "@lib/socket";

@Controller("friends")
export class FriendController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ws: SocketService,
  ) {}

  @Post("requests/send")
  async sendFriendRequest(
    @Body() dto: dtos.SendFriendRequestDto,
    @Session() session: SessionWithData,
  ) {
    const recipient = await this.prisma.user.findFirst({
      where: {
        id: dto.recipientId,
      },
    });

    if (!recipient) throw new NotFoundException("Recipient not found");

    let relationship = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {
            user1Id: session.userId,
            user2Id: recipient.id,
          },
          {
            user1Id: recipient.id,
            user2Id: session.userId,
          },
        ],
      },
    });

    if (!relationship) {
      relationship = await this.prisma.relationship.create({
        data: {
          user1Id: session.userId,
          user2Id: recipient.id,
          status: "FRIEND_REQ_1_2",
        },
      });
    } else {
      if (relationship.status === "FRIENDS")
        throw new BadRequestException("You are already friends");
      else if (relationship.status === "FRIEND_REQ_1_2") {
        if (relationship.user1Id === session.userId)
          throw new BadRequestException(
            "You have already sent a friend request to this user",
          );
        else if (relationship.user1Id === recipient.id) {
          relationship = await this.prisma.relationship.update({
            where: {
              id: relationship.id,
            },
            data: {
              status: "FRIENDS",
            },
          });
        }
      } else if (relationship.status === "FRIEND_REQ_2_1") {
        if (relationship.user1Id === recipient.id)
          throw new BadRequestException(
            "You have already sent a friend request to this user",
          );
        else if (relationship.user1Id === session.id) {
          relationship = await this.prisma.relationship.update({
            where: {
              id: relationship.id,
            },
            data: {
              status: "FRIENDS",
            },
          });
        }
      } else if (relationship.status === "NONE") {
        let status: Relationship["status"];

        if (session.userId === relationship.user1Id) status = "FRIEND_REQ_1_2";
        else if (session.userId === relationship.user2Id)
          status = "FRIEND_REQ_2_1";

        relationship = await this.prisma.relationship.update({
          where: {
            id: relationship.id,
          },
          data: {
            status,
          },
        });
      }
    }

    this.ws.server
      .to(this.ws.getSocketsByUserId(recipient.id).map((s) => s.id))
      .emit("friend-request-sent", {
        user: session.user,
      });

    return {
      relationship: mappers.relationship({
        self: session.userId,
        relationship,
      }),
    };
  }

  @Post("requests/accept")
  async acceptFriendRequest(
    @Body() dto: dtos.AcceptFriendRequestDto,
    @Session() session: SessionWithData,
  ) {
    const sender = await this.prisma.user.findFirst({
      where: {
        id: dto.senderId,
      },
    });

    if (!sender) throw new NotFoundException("Sender not found");

    let relationship = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {
            user1Id: sender.id,
            user2Id: session.userId,
            status: "FRIEND_REQ_1_2",
          },
          {
            user1Id: session.userId,
            user2Id: sender.id,
            status: "FRIEND_REQ_2_1",
          },
        ],
      },
    });

    if (!relationship)
      throw new BadRequestException(
        "You haven't received a friend request from this user",
      );

    relationship = await this.prisma.relationship.update({
      where: {
        id: relationship.id,
      },
      data: {
        status: "FRIENDS",
      },
    });

    this.ws.server
      .to(this.ws.getSocketsByUserId(sender.id).map((s) => s.id))
      .emit("friend-request-accepted", {
        user: session.user,
      });

    return {
      relationship: mappers.relationship({
        self: session.userId,
        relationship,
      }),
    };
  }

  @Post("requests/reject")
  async rejectFriendRequest(
    @Body() dto: dtos.RejectFriendRequestDto,
    @Session() session: SessionWithData,
  ) {
    const sender = await this.prisma.user.findFirst({
      where: {
        id: dto.senderId,
      },
    });

    if (!sender) throw new NotFoundException("Sender not found");

    let relationship = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {
            user1Id: sender.id,
            user2Id: session.userId,
            status: "FRIEND_REQ_1_2",
          },
          {
            user1Id: session.userId,
            user2Id: sender.id,
            status: "FRIEND_REQ_2_1",
          },
        ],
      },
    });

    if (!relationship)
      throw new BadRequestException(
        "You haven't received a friend request from this user",
      );

    relationship = await this.prisma.relationship.update({
      where: {
        id: relationship.id,
      },
      data: {
        status: "NONE",
      },
    });

    this.ws.server
      .to(this.ws.getSocketsByUserId(sender.id).map((s) => s.id))
      .emit("friend-request-rejected", {
        user: session.user,
      });

    return {
      relationship: mappers.relationship({
        self: session.userId,
        relationship,
      }),
    };
  }

  @Delete("remove")
  async removeFriend(
    @Body() dto: dtos.RemoveFriendDto,
    @Session() session: SessionWithData,
  ) {
    const friend = await this.prisma.user.findFirst({
      where: {
        id: dto.friendId,
      },
    });

    if (!friend) throw new NotFoundException("Friend not found");

    let relationship = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {
            user1Id: friend.id,
            user2Id: session.userId,
            status: "FRIENDS",
          },
          {
            user1Id: session.userId,
            user2Id: friend.id,
            status: "FRIENDS",
          },
        ],
      },
    });

    if (!relationship) throw new BadRequestException("You are not friends");

    relationship = await this.prisma.relationship.update({
      where: {
        id: relationship.id,
      },
      data: {
        status: "NONE",
      },
    });

    this.ws.server
      .to(this.ws.getSocketsByUserId(friend.id).map((s) => s.id))
      .emit("friend-removed", {
        user: session.user,
      });

    return {
      relationship: mappers.relationship({
        self: session.userId,
        relationship,
      }),
    };
  }

  @Get("/")
  async getMyFriends(@Session() session: SessionWithData) {
    const relationships = await this.prisma.relationship.findMany({
      where: {
        OR: [
          {user1Id: session.userId, status: "FRIENDS"},
          {user2Id: session.userId, status: "FRIENDS"},
        ],
      },
      include: {
        user1: {
          include: {
            profile: true,
            location: true,
          },
        },
        user2: {
          include: {
            profile: true,
            location: true,
          },
        },
      },
    });

    const friends = relationships.map((r) => {
      if (session.userId === r.user1Id) return r.user2;
      else return r.user1;
    });

    return {
      friends: friends.map(mappers.completeUser),
    };
  }

  @Get("requests")
  async getFriendRequests(@Session() session: SessionWithData) {
    const relationships = await this.prisma.relationship.findMany({
      where: {
        OR: [
          {user1Id: session.userId, status: "FRIEND_REQ_2_1"},
          {user2Id: session.userId, status: "FRIEND_REQ_1_2"},
        ],
      },
      include: {
        user1: {
          include: {
            profile: true,
            location: true,
          },
        },
        user2: {
          include: {
            profile: true,
            location: true,
          },
        },
      },
    });

    const friendRequests = relationships.map((r) => {
      if (session.userId === r.user1Id) return r.user2;
      else return r.user1;
    });

    return {
      friendRequests: friendRequests.map(mappers.completeUser),
    };
  }

  @Get("potential")
  async getPotentialFriends(@Session() session: SessionWithData) {
    const users = await this.prisma.user.findMany({
      where: {
        location: {
          city: session.user.location.city,
        },
        id: {
          not: session.userId,
        },
        OR: [
          {
            relationshipsAsUser1: {
              none: {
                user2Id: session.userId,
              },
            },
          },
          {
            relationshipsAsUser2: {
              none: {
                user1Id: session.userId,
              },
            },
          },
        ],
      },
      include: {
        profile: true,
        location: true,
      },
    });

    return {
      potentialFriends: users.map(mappers.completeUser),
    };
  }
}
