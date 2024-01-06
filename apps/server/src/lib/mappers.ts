import {Profile, Location, Prisma} from "@prisma/client";

export type CompleteUser = Prisma.UserGetPayload<{
  include: {
    location: true;
    profile: true;
  };
}>;

const user = (u: CompleteUser) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  avatar: u.avatar,
  profile: u.profile && profile(u.profile),
  location: u.location && location(u.location),
});

const profile = (p: Profile) => ({
  role1: p.roles[0],
  role2: p.roles[1],
  role3: p.roles[2],
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
  profile: u.profile && profile(u.profile),
  location: u.location && location(u.location),
});

export const mappers = {user, profile, location, credentials};
