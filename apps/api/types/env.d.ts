declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DATABASE_URL: string;
      SESSION_SECRET: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      CLIENT_ORIGIN: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      ROBOKASSA_MERCHANT_LOGIN: string;
      ROBOKASSA_PASSWORD1: string;
      ROBOKASSA_PASSWORD2: string;
      ROBOKASSA_TEST_MODE: string;
      ROBOKASSA_RESULT_URL_REQUEST_METHOD: "POST" | "GET";
      S3_BUCKET_NAME: string;
      S3_PUBLIC_KEY: string;
      S3_SECRET_KEY: string;
    }
  }
}

export {};
