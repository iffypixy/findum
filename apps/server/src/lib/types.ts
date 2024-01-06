import {Prisma} from "@prisma/client";

export type Nullish = null | undefined;

export type Maybe<T> = T | Nullish;

export type CompleteUser = Prisma.UserGetPayload<{
  include: {
    location: true;
    profile: true;
  };
}>;
