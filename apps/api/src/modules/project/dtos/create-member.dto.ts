import {IsString} from "class-validator";

export class CreateMemberDto {
  @IsString()
  role: string;

  @IsString()
  requirements: string;

  @IsString()
  benefits: string;
}
