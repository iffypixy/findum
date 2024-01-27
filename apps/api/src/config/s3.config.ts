import {registerAs} from "@nestjs/config";

export const s3 = registerAs("s3", () => {
  const env = process.env;

  return {
    bucketName: env.S3_BUCKET_NAME,
    publicKey: env.S3_PUBLIC_KEY,
    secretKey: env.S3_SECRET_KEY,
  };
});
