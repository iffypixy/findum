import {IsString} from "class-validator";

export class SendMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  text: string;
}
