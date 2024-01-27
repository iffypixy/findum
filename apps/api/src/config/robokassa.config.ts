import {registerAs} from "@nestjs/config";

export const robokassa = registerAs("robokassa", () => {
  const env = process.env;

  return {
    merchantLogin: env.ROBOKASSA_MERCHANT_LOGIN,
    password1: env.ROBOKASSA_PASSWORD1,
    password2: env.ROBOKASSA_PASSWORD2,
    testMode: JSON.parse(env.ROBOKASSA_TEST_MODE),
    resultUrlRequestMethod: env.ROBOKASSA_RESULT_URL_REQUEST_METHOD,
  };
});
