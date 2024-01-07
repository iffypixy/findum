import {Type} from "class-transformer";
import {IsDate, IsOptional, IsString, ValidateNested} from "class-validator";

class Location {
  @IsString()
  country: string;

  @IsString()
  city: string;
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  avatar: string;

  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @ValidateNested()
  @Type(() => Location)
  location: Location;
}
