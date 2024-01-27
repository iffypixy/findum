import "express-session";

import {Maybe, CompleteUser} from "@lib/types";

declare module "express-session" {
  interface SessionData {
    user: Maybe<CompleteUser>;
    userId: Maybe<CompleteUser["id"]>;
  }

  export type SessionWithData = Session & SessionData;
}
