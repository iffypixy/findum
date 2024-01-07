import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  region: "ru-central1",
  credentials: new AWS.Credentials({
    accessKeyId: process.env.S3_PUBLIC_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  }),
});

export const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint("storage.yandexcloud.net"),
});
