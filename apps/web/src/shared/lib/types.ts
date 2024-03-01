export interface PropsWithClassName {
  className?: string;
}

export type Nullable<T> = T | null;

export type Nullish<T> = T | null | undefined;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface Location {
  country: string;
  city: string;
}

export interface Profile {
  cv: string;
}

export interface Credentials {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: Location;
  profile: Profile;
  avatar: string;
  isVerified: boolean;
}

export interface ProjectCard {
  id: string;
  project: Project;
  slots: number;
  members: ProjectMember[];
}

export interface BaseProject {
  id: string;
  name: string;
  avatar: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  founder: User;
  location: Location;
  slots: number;
}

export interface FounderProject extends BaseProject {
  newRequests: number;
}

export interface MemberProject extends BaseProject {
  newTasks: number;
}

export type Project = FounderProject | MemberProject;

export type SpecificProject = Project & {
  members: ProjectMember[];
  requests: ProjectRequest[];
  tasks: ProjectTask[];
};

export type ProjectSheet = Project & {
  members: string[];
};

export interface ProjectMember {
  id: string;
  project: Project;
  role: string;
  requirements: string;
  benefits: string;
  user: User;
  isOccupied: boolean;
  cardId: string;
  createdAt: Date;
}

export interface ProjectRequest {
  id: string;
  member: ProjectMember;
  user: User;
  isSeen: boolean;
}

export interface Review {
  id: string;
  author: User;
  project: Project;
  description: string;
  rating: "LIKE" | "DISLIKE";
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  member: ProjectMember;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface MyProjectTask extends ProjectTask {
  isSeen: boolean;
}

export enum TaskStatus {
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface User {
  id: string;
  location: Location;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
}

export enum Relationship {
  FRIENDS = "FRIENDS",
  NONE = "NONE",
  REQUEST_SENT = "FRIEND_REQUEST_SENT",
  REQUEST_RECEIVED = "FRIEND_REQUEST_RECEIVED",
}

export interface Chat {
  id: string;
  lastMessage: ChatMessage;
}

export interface ProjectChat extends Chat {
  project: Project;
}

export interface PrivateChat extends Chat {
  partner: User;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: User;
  createdAt: Date;
}

export interface UserHistory {
  id: string;
  user: User;
  project: Project;
  role: string;
  startDate: Date;
  endDate?: Date;
}

export interface UserProfile extends User {
  relationship: Relationship;
  reviews: Review[];
  highlights: Record<string, number>;
  history: UserHistory[];
  profile: Profile;
}

export interface Notification {
  project: Project;
  text: string;
  date: Date;
}

export type Id = string;

export type TODO = any;
