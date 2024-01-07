import {Body, Controller, Get, Session} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {SessionWithData} from "express-session";
import {nanoid} from "nanoid";

import {s3} from "@lib/s3";

import * as dtos from "./dtos";

@Controller("upload")
export class UploadController {
  constructor(private readonly config: ConfigService) {}

  @Get("presigned")
  async getPresignedUrl(
    @Session() session: SessionWithData,
    @Body() dto: dtos.GetPresignedUrlDto,
  ) {
    const key = `${session.userId}/${nanoid()}`;

    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: this.config.get<string>("s3.bucketName"),
      ContentType: dto.contentType,
      Expires: 60 * 5,
      key,
    });

    return {
      url,
    };
  }
}
