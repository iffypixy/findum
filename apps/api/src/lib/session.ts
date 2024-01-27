import s from "express-session";
import Store from "connect-redis";
import Redis from "ioredis";
import * as dotenv from "dotenv";

dotenv.config();

const MONTH = 2629800000;

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
});

export const session = s({
  store: new Store({client: redis}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: MONTH,
    httpOnly: true,
  },
});
