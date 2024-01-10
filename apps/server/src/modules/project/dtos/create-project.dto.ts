import {Type} from "class-transformer";
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

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

  @IsOptional()
  @IsString()
  avatar: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @ValidateNested()
  @Type(() => Location)
  location: Location;
}
