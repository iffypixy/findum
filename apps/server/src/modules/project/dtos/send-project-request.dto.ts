import {IsString} from "class-validator";

export class SendProjectRequestDto {
  @IsString()
  cardId: string;

  @IsString()
  memberId: string;
}
