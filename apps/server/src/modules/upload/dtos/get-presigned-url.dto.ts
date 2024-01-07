import {IsIn} from "class-validator";

import {mimes} from "@lib/mimes";

export class GetPresignedUrlDto {
  @IsIn(mimes.image)
  contentType: string;
}
