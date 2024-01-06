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
    }
  }
}

export {};
