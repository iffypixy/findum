import {IsDateString, IsEnum, IsString} from "class-validator";

enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: Date;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
