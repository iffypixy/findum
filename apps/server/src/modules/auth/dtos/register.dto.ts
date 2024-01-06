import {Type} from "class-transformer";
import {IsEmail, IsString, ValidateNested} from "class-validator";

class Location {
  @IsString()
  country: string;

  @IsString()
  city: string;
}

class Profile {
  @IsString()
  role1: string;

  @IsString()
  role2: string;

  @IsString()
  role3: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  avatar: string;

  @IsString()
  password: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @ValidateNested()
  @Type(() => Profile)
  profile: Profile;
}
