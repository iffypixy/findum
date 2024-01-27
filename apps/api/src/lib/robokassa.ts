import {RobokassaHelper} from "node-robokassa";
import * as dotenv from "dotenv";

dotenv.config();

console.log(process.env.ROBOKASSA_PASSWORD1, process.env.ROBOKASSA_PASSWORD2);

export const robokassa = new RobokassaHelper({
  merchantLogin: process.env.ROBOKASSA_MERCHANT_LOGIN,
  hashingAlgorithm: "sha256",
  password1: process.env.ROBOKASSA_PASSWORD1,
  password2: process.env.ROBOKASSA_PASSWORD2,
  testMode: true,
  resultUrlRequestMethod: "GET",
});

export const PAYMENT_TYPES = {
  PROJECT_CARD: "project-card",
  PROJECT_CARD_SLOTS: "project-card-slots",
};
