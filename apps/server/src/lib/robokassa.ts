import {RobokassaHelper} from "node-robokassa";
import * as dotenv from "dotenv";

dotenv.config();

export const robokassa = new RobokassaHelper({
  merchantLogin: process.env.ROBOKASSA_MERCHANT_LOGIN,
  hashingAlgorithm: "md5",
  password1: process.env.ROBOKASSA_PASSWORD1,
  password2: process.env.ROBOKASSA_PASSWORD2,
  testMode: JSON.parse(process.env.ROBOKASSA_TEST_MODE),
  resultUrlRequestMethod: process.env.ROBOKASSA_RESULT_URL_REQUEST_METHOD,
});

export const PAYMENT_TYPES = {
  PROJECT_CARD: "project-card",
};
