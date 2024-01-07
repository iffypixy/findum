import {IsInt} from "class-validator";

export class AddSlotsDto {
  @IsInt()
  slots: number;
}
