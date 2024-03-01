import {GenericDto, request} from "@shared/lib/request";
import {
  Id,
  Location,
  Project,
  ProjectCard,
  ProjectMember,
  ProjectSheet,
  ProjectTask,
  Review,
  SpecificProject,
  TaskPriority,
  TaskStatus,
} from "@shared/lib/types";

export interface GetFeaturedProjectCardsResponse {
  cards: ProjectCard[];
}

export const getFeaturedProjectCards = () =>
  request<GetFeaturedProjectCardsResponse>({
    url: "/api/projects/cards/featured",
  });

export type GetCardsDto = GenericDto<
  {
    limit: number;
    page: number;
    search: string;
  },
  {
    cards: ProjectCard[];
  }
>;

export const getCards = (req: GetCardsDto["req"]) =>
  request<GetCardsDto["res"]>({
    url: "/api/projects/cards",
    params: req,
  });

export interface GetProjectsAsFounderResponse {
  projects: ProjectSheet[];
}

export const getProjectsAsFounder = () =>
  request<GetProjectsAsFounderResponse>({
    url: "/api/projects/founder",
  });

export interface GetProjectsAsMemberResponse {
  projects: ProjectSheet[];
}

export const getProjectsAsMember = () =>
  request<GetProjectsAsMemberResponse>({
    url: "/api/projects/member",
  });

export type SendProjectRequestDto = GenericDto<
  {
    projectId: string;
    cardId: string;
    memberId: string;
  },
  void
>;

export const sendProjectRequest = (req: SendProjectRequestDto["req"]) =>
  request<SendProjectRequestDto["res"]>({
    url: `/api/projects/${req.projectId}/cards/${req.cardId}/members/${req.memberId}/requests`,
    method: "POST",
  });

export type GetProjectDto = GenericDto<
  {
    id: Id;
  },
  {
    project: SpecificProject;
  }
>;

export const getProject = (req: GetProjectDto["req"]) =>
  request<GetProjectDto["res"]>({
    url: `/api/projects/${req.id}`,
  });

export type CreateProjectDto = GenericDto<
  {
    name: string;
    avatar?: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    location: Location;
  },
  {
    project: Project;
  }
>;

export const createProject = (req: CreateProjectDto["req"]) =>
  request<CreateProjectDto["res"]>({
    url: "/api/projects",
    method: "POST",
    data: req,
  });

export type EditProjectDto = GenericDto<
  {
    id: string;
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    avatar?: string;
    location?: Partial<Location>;
  },
  {
    project: Project;
  }
>;

export const editProject = (req: EditProjectDto["req"]) =>
  request<EditProjectDto["res"]>({
    url: `/api/projects/${req.id}/edit`,
    method: "PUT",
    data: req,
  });

export interface CreateProjectCardParams {
  projectId: string;
  slots: number;
}

export interface CreateProjectCardResponse {
  paymentUrl: string;
}

export const createProjectCard = (params: CreateProjectCardParams) =>
  request<CreateProjectCardResponse>({
    url: `/api/projects/${params.projectId}/cards`,
    method: "POST",
    data: params,
  });

export interface AddCardSlotsParams {
  projectId: string;
  cardId: string;
  slots: number;
}

export interface AddCardSlotsResponse {
  paymentUrl: string;
}

export const addCardSlots = (params: AddCardSlotsParams) =>
  request<AddCardSlotsResponse>({
    url: `/api/projects/${params.projectId}/cards/${params.cardId}/slots`,
    method: "PUT",
    data: {
      slots: params.slots,
    },
  });

export type CreateProjectMemberDto = GenericDto<
  {
    projectId: Id;
    role: string;
    requirements: string;
    benefits: string;
  },
  {
    member: ProjectMember;
  }
>;

export const createProjectMember = (req: CreateProjectMemberDto["req"]) =>
  request<CreateProjectMemberDto["res"]>({
    url: `/api/projects/${req.projectId}/members`,
    method: "POST",
    data: {
      role: req.role,
      requirements: req.requirements,
      benefits: req.benefits,
    },
  });

export type AcceptProjectRequestDto = GenericDto<
  {projectId: Id; requestId: Id},
  {member: ProjectMember}
>;

export const acceptProjectRequest = (req: AcceptProjectRequestDto["req"]) =>
  request<AcceptProjectRequestDto["res"]>({
    url: `/api/projects/${req.projectId}/requests/${req.requestId}/accept`,
    method: "POST",
  });

export type RejectProjectRequestDto = GenericDto<
  {
    projectId: Id;
    requestId: Id;
  },
  void
>;

export const rejectProjectRequest = (req: RejectProjectRequestDto["req"]) =>
  request<RejectProjectRequestDto["res"]>({
    url: `/api/projects/${req.projectId}/requests/${req.requestId}/reject`,
    method: "DELETE",
  });

export type RemoveProjectMemberDto = GenericDto<
  {
    projectId: Id;
    memberId: Id;
  },
  void
>;

export const removeProjectMember = (req: RemoveProjectMemberDto["req"]) =>
  request<RemoveProjectMemberDto["res"]>({
    url: `/api/projects/${req.projectId}/members/${req.memberId}`,
    method: "DELETE",
  });

export interface LeaveFeedbackParams {
  projectId: string;
  memberId: string;
  like: boolean;
  description: string;
}

export interface LeaveFeedbackResponse {
  review: Review;
}

export type LeaveFeedbackDto = GenericDto<
  {
    projectId: Id;
    memberId: Id;
    like: boolean;
    description: string;
  },
  {
    review: Review;
  }
>;

export const leaveFeedback = (req: LeaveFeedbackDto["req"]) =>
  request<LeaveFeedbackDto["res"]>({
    url: `/api/projects/${req.projectId}/members/${req.memberId}/reviews`,
    method: "POST",
    data: {
      like: req.like,
      description: req.description,
    },
  });

export type CreateProjectTaskDto = GenericDto<
  {
    projectId: Id;
    memberId: Id;
    title: string;
    description: string;
    deadline: Date;
    priority: TaskPriority;
  },
  {
    task: ProjectTask;
  }
>;

export const createProjectTask = (req: CreateProjectTaskDto["req"]) =>
  request<CreateProjectTaskDto["res"]>({
    url: `/api/projects/${req.projectId}/members/${req.memberId}/tasks`,
    method: "POST",
    data: {
      title: req.title,
      description: req.description,
      deadline: req.deadline,
      priority: req.priority,
    },
  });

export type AcceptProjectTaskDto = GenericDto<
  {
    projectId: Id;
    taskId: Id;
  },
  void
>;

export const acceptProjectTask = (req: AcceptProjectTaskDto["req"]) =>
  request<AcceptProjectTaskDto["res"]>({
    url: `/api/projects/${req.projectId}/tasks/${req.taskId}`,
    method: "DELETE",
  });

export type ChangeProjectTaskStatusDto = GenericDto<
  {
    projectId: Id;
    taskId: Id;
    status: TaskStatus;
  },
  {
    task: ProjectTask;
  }
>;

export const changeProjectTaskStatus = (
  req: ChangeProjectTaskStatusDto["req"],
) =>
  request<ChangeProjectTaskStatusDto["res"]>({
    url: `/api/projects/${req.projectId}/tasks/${req.taskId}`,
    method: "PUT",
    data: {
      status: req.status,
    },
  });

export type GetTotalAmountOfProjectsParams = void;

export interface GetTotalAmountOfProjectsResponse {
  total: number;
}

export const getTotalNumberOfProjects = () =>
  request<GetTotalAmountOfProjectsResponse>({
    url: "/api/projects/total",
  });

export type LeaveProjectDto = GenericDto<
  {
    id: Id;
  },
  void
>;

export const leaveProject = (req: LeaveProjectDto["req"]) =>
  request<LeaveProjectDto["res"]>({
    url: `/api/projects/${req.id}/leave`,
    method: "DELETE",
  });
