import {Prisma} from "@prisma/client";

export type Nullish = null | undefined;

export type Maybe<T> = T | Nullish;

export type CompleteUser = Prisma.UserGetPayload<{
  include: {
    location: true;
    profile: true;
  };
}>;

export type CompleteReview = Prisma.ReviewGetPayload<{
  include: {
    project: {
      include: {
        founder: true;
      };
    };
  };
}>;

export type CompleteProjectCard = Prisma.ProjectCardGetPayload<{
  include: {
    members: {
      include: {
        user: true;
      };
    };
    project: {
      include: {
        founder: true;
      };
    };
  };
}>;

export type CompleteProject = Prisma.ProjectGetPayload<{
  include: {
    founder: true;
    members: {
      include: {
        user: true;
      };
    };
  };
}>;

export type CompleteProjectMember = Prisma.ProjectMemberGetPayload<{
  include: {
    user: true;
  };
}>;
