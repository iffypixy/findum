import {IsDate, IsEnum, IsString} from "class-validator";

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

  @IsDate()
  deadline: Date;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
