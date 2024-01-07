import {IsOptional, IsInt, Min, Max} from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limit: number = 10;
}
