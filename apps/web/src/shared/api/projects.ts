import {request} from "@shared/lib/request";
import {
  Location,
  Project,
  ProjectCard,
  ProjectMember,
  ProjectTask,
  Review,
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

export interface GetCardsParams {
  limit: number;
  page: number;
  location?: Partial<Location>;
  role?: string;
}

export interface GetCardsResponse {
  cards: ProjectCard[];
}

export const getCards = (params: GetCardsParams) =>
  request<GetCardsResponse>({
    url: "/api/projects/cards",
    params,
  });

export interface GetProjectsAsFounderResponse {
  projects: Project[];
}

export const getProjectsAsFounder = () =>
  request<GetProjectsAsFounderResponse>({
    url: "/api/projects/founder",
  });

export interface GetProjectsAsMemberResponse {
  projects: Project[];
}

export const getProjectsAsMember = () =>
  request<GetProjectsAsMemberResponse>({
    url: "/api/projects/member",
  });

export interface SendProjectRequestParams {
  projectId: string;
  cardId: string;
  memberId: string;
}

export type SendProjectRequestResponse = void;

export const sendProjectRequest = (params: SendProjectRequestParams) =>
  request<SendProjectRequestResponse>({
    url: `/api/projects/${params.projectId}/cards/${params.cardId}/members/${params.memberId}/requests`,
    method: "POST",
  });

export interface GetProjectParams {
  id: string;
}

export interface GetProjectResponse {
  project: Project;
}

export const getProject = (params: GetProjectParams) =>
  request<GetProjectResponse>({
    url: `/api/projects/${params.id}`,
  });

export interface CreateProjectParams {
  name: string;
  avatar?: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: Location;
}

export interface CreateProjectResponse {
  project: Project;
}

export const createProject = (params: CreateProjectParams) =>
  request<CreateProjectResponse>({
    url: "/api/projects",
    method: "POST",
    data: params,
  });

export interface EditProjectParams {
  id: string;
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  avatar?: string;
  location?: Partial<Location>;
}

export interface EditProjectResponse {
  project: Project;
}

export const editProject = (params: EditProjectParams) =>
  request<EditProjectResponse>({
    url: `/api/projects/${params.id}/edit`,
    method: "PUT",
    data: params,
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

export interface CreateProjectMemberParams {
  projectId: string;
  cardId: string;
  role: string;
  requirements: string;
  benefits: string;
}

export interface CreateProjectMemberResponse {
  member: ProjectMember;
}

export const createProjectMember = (params: CreateProjectMemberParams) =>
  request<CreateProjectMemberResponse>({
    url: `/api/projects/${params.projectId}/cards/${params.cardId}/members`,
    method: "POST",
    data: {
      role: params.role,
      requirements: params.requirements,
      benefits: params.benefits,
    },
  });

export interface AcceptProjectRequestParams {
  projectId: string;
  requestId: string;
}

export interface AcceptProjectRequestResponse {
  member: ProjectMember;
}

export const acceptProjectRequest = (params: AcceptProjectRequestParams) =>
  request<AcceptProjectRequestResponse>({
    url: `/api/projects/${params.projectId}/requests/${params.requestId}/accept`,
    method: "POST",
  });

export interface DeclineProjectRequestParams {
  projectId: string;
  requestId: string;
}

export type DeclineProjectRequestResponse = void;

export const declineProjectRequest = (params: DeclineProjectRequestParams) =>
  request<DeclineProjectRequestResponse>({
    url: `/api/projects/${params.projectId}/requests/${params.requestId}/decline`,
    method: "DELETE",
  });

export interface RemoveProjectMemberParams {
  projectId: string;
  memberId: string;
}

export type RemoveProjectMemberResponse = void;

export const removeProjectMember = (params: RemoveProjectMemberParams) =>
  request<RemoveProjectMemberResponse>({
    url: `/api/projects/${params.projectId}/members/${params.memberId}`,
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

export const leaveFeedback = (params: LeaveFeedbackParams) =>
  request<LeaveFeedbackResponse>({
    url: `/api/projects/${params.projectId}/members/${params.memberId}/reviews`,
    method: "POST",
    data: {
      like: params.like,
      description: params.description,
    },
  });

export interface CreateProjectTaskParams {
  projectId: string;
  memberId: string;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
}

export interface CreateProjectTaskResponse {
  task: ProjectTask;
}

export const createProjectTask = (params: CreateProjectTaskParams) =>
  request<CreateProjectTaskResponse>({
    url: `/api/projects/${params.projectId}/members/${params.memberId}/tasks`,
    method: "POST",
    data: {
      title: params.title,
      description: params.description,
      deadline: params.deadline,
      priority: params.priority,
    },
  });

export interface AcceptProjectTaskParams {
  projectId: string;
  taskId: string;
}

export type AcceptProjectTaskResponse = void;

export const acceptProjectTask = (params: AcceptProjectTaskParams) =>
  request<AcceptProjectTaskResponse>({
    url: `/api/projects/${params.projectId}/tasks/${params.taskId}`,
    method: "DELETE",
  });

export interface ChangeProjectTaskStatusParams {
  projectId: string;
  taskId: string;
  status: TaskStatus;
}

export interface ChangeProjectTaskStatusResponse {
  task: ProjectTask;
}

export const changeProjectTaskStatus = (
  params: ChangeProjectTaskStatusParams,
) =>
  request<ChangeProjectTaskStatusResponse>({
    url: `/api/projects/${params.projectId}/tasks/${params.taskId}`,
    method: "PUT",
    data: {
      status: params.status,
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

export interface LeaveProjectParams {
  id: string;
}

export type LeaveProjectResponse = void;

export const leaveProject = (params: LeaveProjectParams) =>
  request<LeaveProjectResponse>({
    url: `/api/projects/${params.id}/leave`,
    method: "DELETE",
  });
