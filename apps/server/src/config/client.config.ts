import {registerAs} from "@nestjs/config";

export const client = registerAs("client", () => {
  const env = process.env;

  return {
    origin: env.CLIENT_ORIGIN,
  };
});
