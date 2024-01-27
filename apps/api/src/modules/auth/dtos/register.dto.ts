import {Type} from "class-transformer";
import {IsEmail, IsString, ValidateNested} from "class-validator";

class Location {
  @IsString()
  country: string;

  @IsString()
  city: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;
}
