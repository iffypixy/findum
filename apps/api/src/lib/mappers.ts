import {Profile, Location, User, Project, Relationship} from "@prisma/client";

import {
  CompleteProject,
  CompleteProjectCard,
  CompleteProjectMember,
  CompleteReview,
  CompleteUser,
} from "./types";

const user = (u: User) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  avatar: u.avatar,
});

const completeUser = (u: CompleteUser) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  avatar: u.avatar,
  profile: profile(u.profile),
  location: location(u.location),
});

const profile = (p: Profile) => ({
  cv: p.cv,
});

const location = (l: Location) => ({
  city: l.city,
  country: l.country,
});

const credentials = (u: CompleteUser) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  avatar: u.avatar,
  isVerified: u.isVerified,
  profile: u.profile ? profile(u.profile) : null,
  location: u.location ? location(u.location) : null,
});

const project = (p: Project) => ({
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  description: p.description,
  startDate: p.startDate,
  endDate: p.endDate,
  slots: p.slots,
  createdAt: p.createdAt,
});

const review = (r: CompleteReview) => ({
  id: r.id,
  author: user(r.project.founder),
  project: project(r.project),
  description: r.description,
  rating: r.rating,
});

interface RelationshipDtoParams {
  self: string;
  relationship: Relationship;
}

type RelationshipStatusDto =
  | "NONE"
  | "FRIEND_REQUEST_SENT"
  | "FRIEND_REQUEST_RECEIVED"
  | "FRIENDS";

const relationship = ({
  self: s,
  relationship: r,
}: RelationshipDtoParams): RelationshipStatusDto => {
  if (!r) return "NONE";

  if (r.status === "NONE") return r.status;
  else if (r.status === "FRIEND_REQ_1_2") {
    if (s === r.user1Id) return "FRIEND_REQUEST_SENT";
    else if (s === r.user2Id) return "FRIEND_REQUEST_RECEIVED";
  } else if (r.status === "FRIEND_REQ_2_1") {
    if (s === r.user1Id) return "FRIEND_REQUEST_RECEIVED";
    else if (s === r.user2Id) return "FRIEND_REQUEST_SENT";
  } else if (r.status === "FRIENDS") return "FRIENDS";
};

const projectCard = (c: CompleteProjectCard) => ({
  id: c.id,
  project: project(c.project),
  members: c.members.map(projectMember),
  slots: c.slots,
  createdAt: c.createdAt,
});

const completeProject = (p: CompleteProject) => ({
  id: p.id,
  avatar: p.avatar,
  name: p.name,
  founder: user(p.founder),
  members: p.members.map(projectMember),
  description: p.description,
  startDate: p.startDate,
  endDate: p.endDate,
  createdAt: p.createdAt,
});

const projectMember = (m: CompleteProjectMember) => ({
  ...m,
  id: m.id,
  benefits: m.benefits,
  requirements: m.requirements,
  isOccupied: m.isOccupied,
  user: m.user && user(m.user),
  role: m.role,
  createdAt: m.createdAt,
});

export const mappers = {
  user,
  completeUser,
  profile,
  location,
  credentials,
  review,
  relationship,
  project,
  projectCard,
  projectMember,
  completeProject,
};
