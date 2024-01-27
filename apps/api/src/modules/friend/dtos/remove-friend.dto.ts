import {IsString} from "class-validator";

export class RemoveFriendDto {
  @IsString()
  friendId: string;
}
