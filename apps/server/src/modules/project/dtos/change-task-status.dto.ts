import {IsEnum} from "class-validator";

enum TaskStatus {
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export class ChangeTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
