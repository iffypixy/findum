import {Controller, Get, Query, Session} from "@nestjs/common";
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
    @Query() dto: dtos.GetPresignedUrlDto,
  ) {
    const type = dto.contentType.slice(dto.contentType.indexOf("/") + 1);

    const key = `${session.userId}/${nanoid()}.${type}`;

    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: this.config.get<string>("s3.bucketName"),
      ContentType: dto.contentType,
      Expires: 60 * 5,
      Key: key,
    });

    return {
      url,
      key,
    };
  }
}
