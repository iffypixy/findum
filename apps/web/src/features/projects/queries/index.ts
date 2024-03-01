import {useMutation, useQuery} from "@tanstack/react-query";

import {api} from "@shared/api";
import {
  AcceptProjectRequestDto,
  AcceptProjectTaskDto,
  ChangeProjectTaskStatusDto,
  CreateProjectDto,
  CreateProjectMemberDto,
  CreateProjectTaskDto,
  EditProjectDto,
  GetCardsDto,
  GetProjectDto,
  LeaveFeedbackDto,
  LeaveProjectDto,
  RejectProjectRequestDto,
  RemoveProjectMemberDto,
  SendProjectRequestDto,
} from "@shared/api/projects";

export const useFounderProjects = () => {
  const result = useQuery({
    queryKey: ["projects", "founder", "list"],
    queryFn: async () => {
      const res = await api.projects.getProjectsAsFounder();

      return res.data;
    },
  });

  const projects = result.data?.projects;

  return [{projects}, result] as const;
};

export const useMemberProjects = () => {
  const result = useQuery({
    queryKey: ["projects", "member", "list"],
    queryFn: async () => {
      const res = await api.projects.getProjectsAsMember();

      return res.data;
    },
  });

  const projects = result.data?.projects;

  return [{projects}, result] as const;
};

export const useFeaturedProjectCards = () => {
  const result = useQuery({
    queryKey: ["projects", "cards", "featured", "list"],
    queryFn: async () => {
      const res = await api.projects.getFeaturedProjectCards();

      return res.data;
    },
  });

  const projectCards = result.data?.cards;

  return [{projectCards}, result] as const;
};

export const useSearchedProjectCards = (req: GetCardsDto["req"]) => {
  const result = useQuery({
    queryKey: ["projects", "cards", "searched", "list"],
    queryFn: async () => {
      const res = await api.projects.getCards(req);

      return res.data;
    },
  });

  const projectCards = result.data?.cards;

  return [{projectCards}, result] as const;
};

export const useProject = (req: GetProjectDto["req"]) => {
  const result = useQuery({
    queryKey: ["projects", "detail", req.id],
    queryFn: async () => {
      const res = await api.projects.getProject(req);

      return res.data;
    },
  });

  const project = result.data?.project;

  return [{project}, result] as const;
};

export const useAcceptRequest = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationFn: async (req: AcceptProjectRequestDto["req"]) => {
      const res = await api.projects.acceptProjectRequest(req);

      return res.data;
    },
  });

  return {acceptRequest: mutateAsync, ...mutation};
};

export const useRejectRequest = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationFn: async (req: RejectProjectRequestDto["req"]) => {
      const res = await api.projects.rejectProjectRequest(req);

      return res.data;
    },
  });

  return {rejectRequest: mutateAsync, ...mutation};
};

export const useTotalProjectCount = () => {
  const result = useQuery({
    queryKey: ["projects", "count"],
    queryFn: async () => {
      const res = await api.projects.getTotalNumberOfProjects();

      return res.data;
    },
  });

  const totalProjectCount = result.data?.total;

  return [{totalProjectCount}, result];
};

export const useSendProjectRequest = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "send-request"],
    mutationFn: async (req: SendProjectRequestDto["req"]) => {
      const res = await api.projects.sendProjectRequest(req);

      return res.data;
    },
  });

  return {sendProjectRequest: mutateAsync, ...mutation};
};

export const useLeaveFeedback = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "leave-feedback"],
    mutationFn: async (req: LeaveFeedbackDto["req"]) => {
      const res = await api.projects.leaveFeedback(req);

      return res.data;
    },
  });

  return {leaveFeedback: mutateAsync, ...mutation};
};

export const useCreateTask = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "create-task"],
    mutationFn: async (req: CreateProjectTaskDto["req"]) => {
      const res = await api.projects.createProjectTask(req);

      return res.data;
    },
  });

  return {createTask: mutateAsync, ...mutation};
};

export const useLeaveProject = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "leave-project"],
    mutationFn: async (req: LeaveProjectDto["req"]) => {
      const res = await api.projects.leaveProject(req);

      return res.data;
    },
  });

  return {leaveProject: mutateAsync, ...mutation};
};

export const useRemoveMember = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "remove-member"],
    mutationFn: async (req: RemoveProjectMemberDto["req"]) => {
      const res = await api.projects.removeProjectMember(req);

      return res.data;
    },
  });

  return {removeMember: mutateAsync, ...mutation};
};

export const useChangeTaskStatus = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "tasks", "change-status"],
    mutationFn: async (req: ChangeProjectTaskStatusDto["req"]) => {
      const res = await api.projects.changeProjectTaskStatus(req);

      return res.data;
    },
  });

  return {changeTaskStatus: mutateAsync, ...mutation};
};

export const useAcceptTask = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "tasks", "accept"],
    mutationFn: async (req: AcceptProjectTaskDto["req"]) => {
      const res = await api.projects.acceptProjectTask(req);

      return res.data;
    },
  });

  return {acceptTask: mutateAsync, ...mutation};
};

export const useEditProject = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "edit"],
    mutationFn: async (req: EditProjectDto["req"]) => {
      const res = await api.projects.editProject(req);

      return res.data;
    },
  });

  return {editProject: mutateAsync, ...mutation};
};

export const useCreateProject = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "create"],
    mutationFn: async (req: CreateProjectDto["req"]) => {
      const res = await api.projects.createProject(req);

      return res.data;
    },
  });

  return {createProject: mutateAsync, ...mutation};
};

export const useCreateMember = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["projects", "create-member"],
    mutationFn: async (req: CreateProjectMemberDto["req"]) => {
      const res = await api.projects.createProjectMember(req);

      return res.data;
    },
  });

  return {createMember: mutateAsync, ...mutation};
};
