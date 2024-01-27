import {Type} from "class-transformer";
import {IsOptional, IsString, ValidateNested} from "class-validator";

class Location {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}

export class EditProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;

  @IsOptional()
  @IsString()
  cv?: string;
}
