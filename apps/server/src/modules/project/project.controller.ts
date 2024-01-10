import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Session,
} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {SessionWithData} from "express-session";
import {Prisma} from "@prisma/client";

import {mappers} from "@lib/mappers";
import {PrismaService} from "@lib/prisma";
import {PAYMENT_TYPES, robokassa} from "@lib/robokassa";
import {SocketService} from "@lib/socket";
import {NOTIFICATION_EVENTS} from "@lib/notifications";

import * as dtos from "./dtos";
import {MAXIMUM_CARD_SLOTS} from "./project.constants";

@Controller("projects")
export class ProjectController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly ws: SocketService,
    private readonly socketioService: SocketService,
  ) {}

  @Get("total")
  async getTotalNumberOfProjects() {
    const total = await this.prisma.project.count();

    return {
      total,
    };
  }

  @Get("cards/featured")
  async getFeaturedProjectCards() {
    const cards = await this.prisma.projectCard.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        members: {
          include: {
            user: true,
          },
        },
        project: {
          include: {
            founder: true,
          },
        },
      },
    });

    return {
      cards: cards.map((c) => ({
        ...mappers.projectCard(c),
        project: {
          ...mappers.projectCard(c).project,
          founder: c.project.founder,
        },
      })),
    };
  }

  @Get("cards")
  async getCards(@Query() dto: dtos.GetCardsDto) {
    const where: Prisma.ProjectCardWhereInput = {};

    if (dto.location) {
      where.project = {
        location: {},
      };

      if (dto.location.city) where.project.location.city = dto.location.city;

      if (dto.location.country)
        where.project.location.country = dto.location.country;
    }

    where.members = {
      some: {
        role: {
          contains: dto.role,
        },
      },
    };

    const cards = await this.prisma.projectCard.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: +dto.limit,
      skip: (+dto.page - 1) * +dto.limit,
      include: {
        members: {
          include: {
            user: true,
          },
        },
        project: {
          include: {
            founder: true,
          },
        },
      },
    });

    return {
      cards: cards.map((c) => ({
        ...mappers.projectCard(c),
        project: {
          ...mappers.projectCard(c).project,
          founder: c.project.founder,
        },
      })),
    };
  }

  @Get("founder")
  async getProjectsAsOwner(@Session() session: SessionWithData) {
    const projects = await this.prisma.project.findMany({
      where: {
        founderId: session.userId,
      },
      include: {
        requests: {
          select: {
            id: true,
          },
        },
        members: {
          include: {
            user: true,
          },
          take: 2,
        },
      },
    });

    return {
      projects: projects.map((p) => ({
        ...mappers.project(p),
        requests: p.requests.length,
        members: p.members.map(mappers.projectMember),
      })),
    };
  }

  @Get("member")
  async getProjectsAsMember(@Session() session: SessionWithData) {
    const projects = await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: session.userId,
          },
        },
      },
    });

    return {
      projects: projects.map(mappers.project),
    };
  }

  @Post(":projectId/cards/:cardId/members/:memberId/requests")
  async sendProjectRequest(
    @Session() session: SessionWithData,
    @Param("projectId") projectId: string,
    @Param("cardId") cardId: string,
    @Param("memberId") memberId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const card = await this.prisma.projectCard.findFirst({
      where: {
        id: cardId,
      },
    });

    if (!card) throw new NotFoundException("Project card not found");

    const member = await this.prisma.projectMember.findFirst({
      where: {
        id: memberId,
        cardId: card.id,
      },
      include: {
        project: true,
      },
    });

    if (!member) throw new NotFoundException("Card slot not found");

    const isFounder = session.userId === member.project.founderId;

    if (isFounder)
      throw new BadRequestException(
        "You are a founder of this project; you can't make a project request",
      );

    if (member.isOccupied)
      throw new BadRequestException("This spot is already occupied");

    const alreadyMadeRequest = await this.prisma.projectRequest
      .findFirst({
        where: {
          userId: session.userId,
          memberId: member.id,
          projectId: member.projectId,
        },
        select: {
          id: true,
        },
      })
      .then((r) => Boolean(r));

    if (alreadyMadeRequest)
      throw new BadRequestException(
        "You have already made a request to this card slot",
      );

    await this.prisma.projectRequest.create({
      data: {
        memberId: member.id,
        projectId: card.projectId,
        userId: session.userId,
      },
    });

    this.ws.server
      .to(
        this.socketioService
          .getSocketsByUserId(member.project.founderId)
          .map((s) => s.id),
      )
      .emit(NOTIFICATION_EVENTS.PROJECT_REQUEST_SENT, {
        project,
      });
  }

  @Get(":id")
  async getProject(
    @Param("id") id: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        members: {
          include: {
            user: true,
            card: true,
          },
        },
        cards: {
          include: {
            members: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
        founder: true,
        location: true,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const slotsInTotal = (
      await this.prisma.projectCard.findMany({
        where: {
          projectId: project.id,
        },
        select: {
          slots: true,
        },
      })
    ).reduce((prev, value) => {
      return value.slots + prev;
    }, 0);

    const slotsOccupied = await this.prisma.projectMember.count({
      where: {
        projectId: project.id,
        isOccupied: true,
      },
    });

    const isFounder = session.userId === project.founder.id;

    if (isFounder) {
      const requests = await this.prisma.projectRequest.findMany({
        where: {
          projectId: project.id,
        },
        include: {
          user: true,
          member: true,
        },
      });

      const tasks = await this.prisma.projectTask.findMany({
        where: {
          projectId: project.id,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });

      const chat = await this.prisma.chat.findFirst({
        where: {
          projectChat: {
            projectId: project.id,
          },
        },
      });

      return {
        project: {
          ...project,
          requests,
          tasks,
          isFounder: true,
          chat,
          slots: {
            total: slotsInTotal,
            occupied: slotsOccupied,
          },
        },
      };
    }

    const isMember = project.members.some((m) => m.user?.id === session.userId);

    if (isMember) {
      const tasks = await this.prisma.projectTask.findMany({
        where: {
          member: {
            userId: session.userId,
          },
          projectId: project.id,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });

      const chat = await this.prisma.chat.findFirst({
        where: {
          projectChat: {
            projectId: project.id,
          },
        },
      });

      return {
        project: {
          ...project,
          tasks,
          isMember: true,
          chat,
          slots: {
            total: slotsInTotal,
            occupied: slotsOccupied,
          },
        },
      };
    }

    return {
      project: {
        ...project,
        slots: {
          total: slotsInTotal,
          occupied: slotsOccupied,
        },
      },
    };
  }

  @Post("/")
  async createProject(
    @Body() dto: dtos.CreateProjectDto,
    @Session() session: SessionWithData,
  ) {
    let location = await this.prisma.location.findFirst({
      where: {
        country: dto.location.country,
        city: dto.location.city,
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

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        avatar:
          dto.avatar ||
          "https://storage.yandexcloud.net/s3metaorta/photo_2024-01-09%2017.01.19.jpeg",
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        founderId: session.userId,
        locationId: location.id,
      },
    });

    const chat = await this.prisma.chat.create({
      data: {},
    });

    await this.prisma.projectChat.create({
      data: {
        chatId: chat.id,
        projectId: project.id,
      },
    });

    return {
      project: {
        ...project,
        chat,
      },
    };
  }

  @Put(":id/edit")
  async editProject(
    @Param("id") id: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.EditProjectDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        founderId: session.userId,
      },
      include: {
        location: true,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const data: Prisma.ProjectUpdateInput = {};

    if (dto.name) data.name = dto.name;
    if (dto.avatar) data.avatar = dto.avatar;
    if (dto.description) data.description = dto.description;
    if (dto.startDate) data.startDate = dto.startDate;
    if (dto.endDate) data.endDate = dto.endDate;
    if (dto.location) {
      const locdata = {
        country: dto.location.country || project.location.country,
        city: dto.location.city || project.location.city,
      };

      let location = await this.prisma.location.findFirst({
        where: locdata,
      });

      if (!location) {
        location = await this.prisma.location.create({
          data: locdata,
        });
      }

      data.location = {
        connect: location,
      };
    }

    const updated = await this.prisma.project.update({
      where: {
        id: project.id,
      },
      data,
    });

    return {
      project: updated,
    };
  }

  @Post(":id/cards")
  async createCard(
    @Param("id") id: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.CreateCardDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        cards: {
          select: {
            id: true,
          },
        },
        founder: true,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException(
        "You can't create a card for a project you are not a founder of",
      );

    const calculatePrice = () => {
      const map = [0, 2100, 5000, 10000];

      return map[project.cards.length];
    };

    const priceForCard = calculatePrice();

    const SLOT_PRICE = 2000;
    const priceForSlots = dto.slots * SLOT_PRICE;

    const price = priceForCard + priceForSlots;

    const paymentUrl = robokassa.generatePaymentUrl(
      price,
      `Payment for a card in the "${project.name}" project with ${dto.slots} slot(s)`,
      {
        email: project.founder.email,
        outSumCurrency: "KZT",
        isTest: true,
        userData: {
          projectId: project.id,
          slots: dto.slots,
          type: PAYMENT_TYPES.PROJECT_CARD,
        },
      },
    );

    await this.prisma.projectCard.create({
      data: {
        projectId: project.id,
        slots: dto.slots,
      },
    });

    return {
      paymentUrl,
    };
  }

  @Put(":projectId/cards/:cardId/slots")
  async addSlots(
    @Param("projectId") projectId: string,
    @Param("cardId") cardId: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.AddSlotsDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        founder: true,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const card = await this.prisma.projectCard.findFirst({
      where: {
        id: cardId,
        projectId: project.id,
      },
    });

    if (!card) throw new NotFoundException("Project card not found");

    const isFull = card.slots === MAXIMUM_CARD_SLOTS;

    if (isFull)
      throw new BadRequestException(
        "You have maximum amount of slots in your card",
      );

    const remainingSlots = MAXIMUM_CARD_SLOTS - card.slots;

    if (dto.slots > remainingSlots)
      throw new BadRequestException(
        "You exceeded the amount of slots you can add",
      );

    const calculatePrice = () => {
      const SLOT_PRICE = 2000;

      return dto.slots * SLOT_PRICE;
    };

    const price = calculatePrice();

    const paymentUrl = robokassa.generatePaymentUrl(
      price,
      `Payment for ${dto.slots} slot(s) in the "${project.name}" project`,
      {
        email: project.founder.email,
        outSumCurrency: "KZT",
        isTest: true,
        userData: {
          cardId: card.id,
          slots: card.slots + dto.slots,
          type: PAYMENT_TYPES.PROJECT_CARD_SLOTS,
        },
      },
    );

    await this.prisma.projectCard.update({
      where: {
        id: card.id,
      },
      data: {
        slots: card.slots + dto.slots,
      },
    });

    return {
      paymentUrl,
    };
  }

  @Post(":projectId/cards/:cardId/members")
  async createMember(
    @Param("projectId") projectId: string,
    @Param("cardId") cardId: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.CreateMemberDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const card = await this.prisma.projectCard.findFirst({
      where: {
        id: cardId,
        projectId: project.id,
      },
    });

    if (!card) throw new NotFoundException("Project card not found");

    const members = await this.prisma.projectMember.count({
      where: {
        projectId: project.id,
        cardId: card.id,
      },
    });

    const slotAvailable = card.slots > members;

    if (!slotAvailable)
      throw new BadRequestException(
        "You have no slots available in this project card",
      );

    const member = await this.prisma.projectMember.create({
      data: {
        role: dto.role,
        requirements: dto.requirements,
        benefits: dto.benefits,
        cardId: card.id,
        projectId: project.id,
        isOccupied: false,
        userId: null,
      },
    });

    return {
      member,
    };
  }

  @Post(":projectId/requests/:requestId/accept")
  async acceptProjectRequest(
    @Param("projectId") projectId: string,
    @Param("requestId") requestId: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const request = await this.prisma.projectRequest.findFirst({
      where: {
        id: requestId,
        projectId: project.id,
      },
      include: {
        member: true,
      },
    });

    if (!request) throw new NotFoundException("Project request not found");

    if (request.member.isOccupied)
      throw new BadRequestException("This project member is already occupied");

    const member = await this.prisma.projectMember.update({
      where: {
        id: request.memberId,
      },
      data: {
        userId: request.userId,
        isOccupied: true,
      },
    });

    await this.prisma.projectRequest.delete({
      where: {
        id: request.id,
      },
    });

    this.ws.server
      .to(
        this.socketioService
          .getSocketsByUserId(request.userId)
          .map((s) => s.id),
      )
      .emit(NOTIFICATION_EVENTS.REQUEST_ACCEPTED, {
        project,
      });

    return {
      member,
    };
  }

  @Delete(":projectId/requests/:requestId/decline")
  async declineProjectRequest(
    @Param("projectId") projectId: string,
    @Param("requestId") requestId: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder) throw new BadRequestException("You have no permission");

    const request = await this.prisma.projectRequest.findFirst({
      where: {
        id: requestId,
        projectId: project.id,
      },
      include: {
        member: true,
      },
    });

    if (!request) throw new NotFoundException("Project request not found");

    const userId = request.userId;

    await this.prisma.projectRequest.delete({
      where: {
        id: request.id,
      },
    });

    this.ws.server
      .to(this.socketioService.getSocketsByUserId(userId).map((s) => s.id))
      .emit(NOTIFICATION_EVENTS.REQUEST_DECLINED, {
        project,
      });
  }

  @Delete(":projectId/members/:memberId")
  async removeMember(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const member = await this.prisma.projectMember.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!member) throw new NotFoundException("Project member not found");

    await this.prisma.projectMember.update({
      where: {
        id: memberId,
      },
      data: {
        isOccupied: false,
        userId: null,
      },
    });

    this.ws.server
      .to(
        this.socketioService.getSocketsByUserId(member.userId).map((s) => s.id),
      )
      .emit(NOTIFICATION_EVENTS.KICKED_FROM_PROJECT, {
        project,
      });
  }

  @Post(":projectId/members/:memberId/reviews")
  async leaveFeedback(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.LeaveFeedbackDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const member = await this.prisma.projectMember.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!member) throw new NotFoundException("Project member not found");

    const review = await this.prisma.review.create({
      data: {
        rating: dto.like ? "LIKE" : "DISLIKE",
        description: dto.description,
        memberId: member.id,
        projectId: project.id,
      },
    });

    this.ws.server
      .to(
        this.socketioService.getSocketsByUserId(member.userId).map((s) => s.id),
      )
      .emit(NOTIFICATION_EVENTS.REVIEW_GIVEN, {
        review,
      });

    return {
      review,
    };
  }

  @Post(":projectId/members/:memberId/tasks")
  async createTask(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @Body() dto: dtos.CreateTaskDto,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const member = await this.prisma.projectMember.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!member) throw new NotFoundException("Project member not found");

    const task = await this.prisma.projectTask.create({
      data: {
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline,
        priority: dto.priority,
        status: "ASSIGNED",
        memberId: member.id,
        projectId: project.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    this.ws.server
      .to(
        this.socketioService.getSocketsByUserId(member.userId).map((s) => s.id),
      )
      .emit(NOTIFICATION_EVENTS.TASK_ASSIGNED, {project});

    return {
      task,
    };
  }

  @Delete(":projectId/tasks/:taskId")
  async acceptTask(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const isFounder = project.founderId === session.userId;

    if (!isFounder)
      throw new BadRequestException("You can't add slots to this card");

    const task = await this.prisma.projectTask.findFirst({
      where: {
        id: taskId,
      },
      include: {
        member: true,
      },
    });

    if (!task) throw new NotFoundException("Project task not found");

    await this.prisma.projectTask.delete({
      where: {
        id: task.id,
      },
    });

    this.ws.server
      .to(
        this.socketioService
          .getSocketsByUserId(task.member.userId)
          .map((s) => s.id),
      )
      .emit(NOTIFICATION_EVENTS.TASK_ACCEPTED, {
        task,
      });
  }

  @Put(":projectId/tasks/:taskId")
  async changeTaskStatus(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
    @Session() session: SessionWithData,
    @Body() dto: dtos.ChangeTaskStatusDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const task = await this.prisma.projectTask.findFirst({
      where: {
        id: taskId,
        member: {
          userId: session.userId,
        },
      },
    });

    if (!task) throw new NotFoundException("Task not found");

    const updated = await this.prisma.projectTask.update({
      where: {
        id: task.id,
      },
      data: {
        status: dto.status,
      },
    });

    return {
      task: updated,
    };
  }

  @Delete(":projectId/leave")
  async leaveProject(
    @Param("projectId") projectId: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new NotFoundException("Project not found");

    const member = await this.prisma.projectMember.findFirst({
      where: {
        projectId: project.id,
        userId: session.userId,
      },
    });

    if (!member)
      throw new BadRequestException("You are not a member of this project");

    await this.prisma.projectMember.update({
      where: {
        id: member.id,
      },
      data: {
        isOccupied: false,
        userId: null,
      },
    });
  }
}
