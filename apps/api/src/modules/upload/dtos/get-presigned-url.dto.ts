import {IsString} from "class-validator";

export class GetPresignedUrlDto {
  @IsString()
  contentType: string;
}
