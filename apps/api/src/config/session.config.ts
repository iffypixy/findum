import {registerAs} from "@nestjs/config";

export const session = registerAs("session", () => {
  const env = process.env;

  return {
    secret: env.SESSION_SECRET,
  };
});
