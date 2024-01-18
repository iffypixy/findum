export interface PropsWithClassName {
  className?: string;
}

export type Nullable<T> = T | null;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

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

export interface Project {
  id: string;
  name: string;
  avatar: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  founder: User;
  location: Location;
  members: ProjectMember[];
  cards: ProjectCard[];
  isFounder: boolean;
  isMember: boolean;
  chat: Chat;
  tasks: ProjectTask[];
  requests: {
    id: string;
    member: ProjectMember;
    user: User;
  }[];
  slots: {
    total: number;
    occupied: number;
  };
}

export interface ProjectMember {
  id: string;
  project: Project;
  role: string;
  requirements: string;
  benefits: string;
  user: User;
  isOccupied: boolean;
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

export type Fetchable<T> = {
  data: T;
  isFetching: boolean;
};

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
