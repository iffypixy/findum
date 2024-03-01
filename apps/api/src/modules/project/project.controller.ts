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
import {MAXIMUM_CARD_SLOTS} from "./project.constants";

import * as dtos from "./dtos";

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
    const currentDate = new Date();
    const deadline = new Date(new Date().setDate(currentDate.getDate() - 7));

    const cards = await this.prisma.projectCard.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        members: {
          some: {
            isOccupied: false,
            createdAt: {
              gte: deadline,
            },
          },
        },
      },
      take: 6,
      include: {
        members: {
          include: {
            user: true,
            project: true,
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

    if (dto.search) {
      where.OR = [
        {
          project: {
            name: {
              startsWith: dto.search,
              mode: "insensitive",
            },
          },
        },
        {
          members: {
            some: {
              role: {
                startsWith: dto.search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    const currentDate = new Date();
    const deadline = new Date(new Date().setDate(currentDate.getDate() - 7));

    where.members = {
      some: {
        role: {
          contains: dto.role,
        },
        isOccupied: false,
        createdAt: {
          gte: deadline,
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
            project: true,
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
      cards: cards
        .map((c) => ({
          ...c,
          members: c.members.filter((m) => !m.isOccupied),
        }))
        .map((c) => ({
          ...mappers.projectCard(c),
          project: {
            ...mappers.projectCard(c).project,
            founder: c.project.founder,
          },
          members: c.members,
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
        founder: true,
      },
    });

    return {
      projects: projects.map((p) => ({
        ...mappers.project(p),
        founder: p.founder,
        requests: p.requests.length,
        members: p.members
          .filter((m) => m.isOccupied)
          .map((m) => m.user.avatar),
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
      include: {
        founder: true,
        members: {
          include: {
            project: true,
          },
        },
      },
    });

    const tasks = {};

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      tasks[project.id] = await this.prisma.projectTask.count({
        where: {
          projectId: project.id,
          member: {
            userId: session.userId,
          },
          status: {
            not: "DONE",
          },
        },
      });
    }

    return {
      projects: projects.map((p) => ({
        ...mappers.project(p),
        tasks: tasks[p.id],
        founder: p.founder,
      })),
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

    const request = await this.prisma.projectRequest.create({
      data: {
        memberId: member.id,
        projectId: card.projectId,
        userId: session.userId,
      },
      include: {
        project: true,
      },
    });

    this.ws.server
      .to(this.socketioService.getSocketIds(member.project.founderId))
      .emit(NOTIFICATION_EVENTS.PROJECT_REQUEST_SENT, {
        project,
        request,
      });
  }

  @Get(":id")
  async getProject(
    @Param("id") id: string,
    @Session() session: SessionWithData,
  ) {
    const currentDate = new Date();
    const deadline = new Date(new Date().setDate(currentDate.getDate() - 7));

    const project = await this.prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        members: {
          where: {
            OR: [
              {
                createdAt: {
                  gte: deadline,
                },
              },
              {
                isOccupied: true,
              },
            ],
          },
          include: {
            user: true,
            card: true,
            project: true,
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
      },
    });

    const isFounder = session.userId === project.founder.id;

    if (isFounder) {
      const currentDate = new Date();
      const deadline = new Date(new Date().setDate(currentDate.getDate() - 12));

      const requests = await this.prisma.projectRequest.findMany({
        where: {
          projectId: project.id,
          createdAt: {
            gte: deadline,
          },
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
          slots: project.slots,
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

  @Post(":projectId/members")
  async createMember(
    @Param("projectId") projectId: string,
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
      throw new BadRequestException("You can't add members to this project");

    const cards = await this.prisma.projectCard.findMany({
      where: {
        projectId: project.id,
      },
    });

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      const count = await this.prisma.projectMember.count({
        where: {
          projectId: project.id,
          cardId: card.id,
        },
      });

      if (card.slots > count) {
        const member = await this.prisma.projectMember.create({
          data: {
            cardId: card.id,
            role: dto.role,
            requirements: dto.requirements,
            benefits: dto.benefits,
            isOccupied: false,
            projectId: project.id,
          },
        });

        await this.prisma.project.update({
          where: {
            id: project.id,
          },
          data: {
            slots: {
              decrement: 1,
            },
          },
        });

        return {member};
      }
    }

    const card = await this.prisma.projectCard.create({
      data: {
        slots: 4,
        projectId: project.id,
      },
    });

    const member = await this.prisma.projectMember.create({
      data: {
        cardId: card.id,
        role: dto.role,
        requirements: dto.requirements,
        benefits: dto.benefits,
        isOccupied: false,
        projectId: project.id,
      },
    });

    await this.prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        slots: {
          decrement: 1,
        },
      },
    });

    // const currentDate = new Date();

    // const deadline = new Date().setDate(currentDate.getDate() + 7);

    // schedule.scheduleJob(deadline, async () => {
    //   const projectMember = await this.prisma.projectMember.findFirst({
    //     where: {
    //       id: member.id,
    //     },
    //   });

    //   if (!projectMember.isOccupied) {

    //   }
    // });

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
      include: {
        user: true,
      },
    });

    await this.prisma.projectRequest.deleteMany({
      where: {
        projectId: project.id,
        memberId: request.memberId,
      },
    });

    await this.prisma.userHistory.create({
      data: {
        projectId: project.id,
        userId: request.userId,
        role: member.role,
        startDate: new Date(),
      },
    });

    this.ws.server
      .to(this.socketioService.getSocketIds(request.userId))
      .emit(NOTIFICATION_EVENTS.REQUEST_ACCEPTED, {
        project,
      });

    return {
      member,
    };
  }

  @Delete(":projectId/requests/:requestId/reject")
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
      .to(this.socketioService.getSocketIds(userId))
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

    const members = await this.prisma.projectMember.findMany({
      where: {
        id: memberId,
      },
    });

    if (!members.length) throw new NotFoundException("No member found");

    await this.prisma.projectMember.deleteMany({
      where: {
        id: {
          in: members.map((m) => m.id),
        },
      },
    });

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      await this.prisma.projectCard.update({
        where: {
          id: member.cardId,
        },
        data: {
          slots: {
            decrement: 1,
          },
        },
      });

      this.prisma.userHistory.updateMany({
        where: {
          userId: session.userId,
          projectId: member.projectId,
          role: member.role,
        },
        data: {
          endDate: new Date(),
        },
      });
    }

    // await this.prisma.projectMember.update({
    //   where: {
    //     id: memberId,
    //   },
    //   data: {
    //     isOccupied: false,
    //     userId: null,
    //   },
    // });

    this.ws.server
      .to(this.socketioService.getSocketIds(members[0].userId))
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
      .to(this.socketioService.getSocketIds(member.userId))
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
      .to(this.socketioService.getSocketIds(member.userId))
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
      .to(this.socketioService.getSocketIds(task.member.userId))
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

    const members = await this.prisma.projectMember.findMany({
      where: {
        projectId: project.id,
        userId: session.userId,
      },
    });

    await this.prisma.projectMember.deleteMany({
      where: {
        id: {
          in: members.map((m) => m.id),
        },
      },
    });

    await this.prisma.userHistory.updateMany({
      where: {
        userId: session.userId,
        projectId: project.id,
      },
      data: {
        endDate: new Date(),
      },
    });
  }

  @Post(":id/create-card")
  async createProjectWithCardsTemporarily(
    @Param("id") projectId: string,
    @Session() session: SessionWithData,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
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

    const card = await this.prisma.projectCard.create({
      data: {
        projectId: project.id,
        slots: 4,
      },
      include: {
        project: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return card;
  }
}
