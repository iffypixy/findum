import {IsString} from "class-validator";

export class RejectFriendRequestDto {
  @IsString()
  senderId: string;
}
