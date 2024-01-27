import {Request} from "express";

export const getBaseUrl = (req: Request) =>
  `${req.protocol}://${req.get("host")}`;
