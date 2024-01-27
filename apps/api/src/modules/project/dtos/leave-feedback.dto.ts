import {IsBoolean, IsString} from "class-validator";

export class LeaveFeedbackDto {
  @IsBoolean()
  like: boolean;

  @IsString()
  description: string;
}
