import {IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

import {PaginationQueryDto} from "@lib/dtos";

class Location {
  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  city: string;
}

export class GetCardsDto extends PaginationQueryDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  search: string;
}
