import {Type} from "class-transformer";
import {IsDate, IsOptional, IsString, ValidateNested} from "class-validator";

class Location {
  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  city: string;
}

export class EditProjectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location: Location;
}
