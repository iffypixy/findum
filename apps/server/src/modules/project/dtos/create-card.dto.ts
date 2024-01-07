import {IsInt, Max, Min} from "class-validator";

import {MAXIMUM_CARD_SLOTS, MINIMUM_CARD_SLOTS} from "../project.constants";

export class CreateCardDto {
  @IsInt()
  @Min(MINIMUM_CARD_SLOTS)
  @Max(MAXIMUM_CARD_SLOTS)
  slots: number;
}
