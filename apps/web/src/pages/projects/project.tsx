import {useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {twMerge} from "tailwind-merge";
import {Controller, useForm} from "react-hook-form";
import * as Popover from "@radix-ui/react-popover";
import {useParams} from "wouter";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

import {
  Avatar,
  Button,
  ContentTemplate,
  DatePicker,
  H3,
  H5,
  TextField,
  Textarea,
  TimePicker,
  UploadField,
  Modal,
  Checkbox,
  H6,
  Select,
  ModalWindowPropsWithClose,
  Icon,
  Link,
} from "@shared/ui";
import {useCredentials} from "@features/auth";
import {
  ProjectMemberCard,
  useAcceptRequest,
  useAcceptTask,
  useChangeTaskStatus,
  useCreateMember,
  useCreateTask,
  useLeaveProject,
  useProject,
  useRejectRequest,
  useSendProjectRequest,
} from "@features/projects";
import wall from "@shared/assets/wall.jpg";
import whatsapp from "@shared/assets/sm/whatsapp.jpg";
import {
  Id,
  Nullable,
  ProjectMember,
  SpecificProject,
  TaskPriority,
  TaskStatus,
} from "@shared/lib/types";
import {dayjs} from "@shared/lib/dayjs";
import {queryClient} from "@shared/lib/query";
import {nanoid} from "nanoid";
import {navigate} from "wouter/use-location";

enum Tab {
  MEMBERS = "members",
  REQUESTS = "requests",
  TASKS = "tasks",
}

export const ProjectPage: React.FC = () => {
  const {t} = useTranslation();

  const {projectId} = useParams() as {projectId: Id};

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.MEMBERS);

  const [isInvestmentRequested, setIsInvestmentRequested] = useState(false);

  const [{credentials}] = useCredentials();

  const [{project}] = useProject({id: projectId});

  const {leaveProject} = useLeaveProject();
  const {acceptRequest} = useAcceptRequest();
  const {rejectRequest} = useRejectRequest();
  const {changeTaskStatus} = useChangeTaskStatus();
  const {acceptTask} = useAcceptTask();

  const isOwner = project?.founder.id === credentials?.id;

  const isMember = project?.members.some((m) => m.user?.id === credentials?.id);

  const isVisitor = !isOwner && !isMember;

  const categories: Array<{
    id: TaskStatus;
    title: string;
  }> = [
    {
      id: TaskStatus.ASSIGNED,
      title: "To fulfillment",
    },
    {
      id: TaskStatus.IN_PROGRESS,
      title: "In process",
    },
    {
      id: TaskStatus.DONE,
      title: "Done",
    },
  ];

  if (!project) return null;

  const tabs = [
    {
      id: Tab.MEMBERS,
      title: `${t("project.tabs.team-members")}`,
    },
    {
      id: Tab.REQUESTS,
      title: `${t("project.tabs.requests")} (${project.requests?.length})`,
    },
    {
      id: Tab.TASKS,
      title: t("project.tabs.tasks"),
    },
  ].filter((tab) => {
    if (isVisitor) return ![Tab.TASKS, Tab.REQUESTS].includes(tab.id);
    if (!isOwner && isMember) return ![Tab.REQUESTS].includes(tab.id);

    return true;
  });

  const anyTasks = project.tasks && project.tasks.length > 0;

  return (
    <ContentTemplate>
      <div className="w-full flex flex-col space-y-8">
        <div className="w-full min-h-[20rem] rounded-xl overflow-hidden">
          <div
            style={{backgroundImage: `url(${wall})`}}
            className="flex justify-end w-full h-[40%] relative p-8"
          >
            {isOwner && (
              <Button
                onClick={() => {
                  setIsInvestmentRequested(true);
                }}
                disabled={isInvestmentRequested}
              >
                {isInvestmentRequested
                  ? t("common.coming-soon")
                  : t("project.buttons.request-investment")}
              </Button>
            )}

            <Avatar
              src={project.avatar}
              className="w-28 h-auto absolute left-8 -bottom-1/2"
            />
          </div>

          <div className="w-full h-[60%] bg-[#F1F5F9] flex items-end justify-between p-8">
            <div className="flex flex-col space-y-0.5">
              <H5>{project.name}</H5>

              <span className="text-[#817C7C]">
                {project.location.city}, {project.location.country}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {isVisitor ? (
                <Modal.RootFn>
                  {({close}) => (
                    <>
                      <Modal.Trigger>
                        <Button>{t("project.buttons.send-request")}</Button>
                      </Modal.Trigger>

                      <SendProjectRequestModal
                        members={project.members}
                        close={close}
                      />
                    </>
                  )}
                </Modal.RootFn>
              ) : isOwner ? (
                <>
                  <Link href={`/projects/${project.id}/edit`}>
                    <div className="flex items-center text-lg space-x-2">
                      <Icon.Pencil className="text-accent w-5 h-auto" />

                      <span className="text-accent underline underline-offset-4">
                        {t("project.buttons.edit")}
                      </span>
                    </div>
                  </Link>

                  <Link href={`/chats/project/${project.id}`}>
                    <Button>{t("project.buttons.go-to-chat")}</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="inline-flex items-center text-lg space-x-2">
                        <Icon.Door className="text-accent w-5 h-auto" />

                        <span className="text-accent underline underline-offset-4">
                          {t("project.buttons.leave-project")}
                        </span>
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content>
                        <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md p-6 space-y-6">
                          <H6>Do you really want to leave this project?</H6>

                          <div className="flex space-x-4">
                            <Popover.PopoverClose asChild>
                              <Button className="w-[50%]">Cancel</Button>
                            </Popover.PopoverClose>

                            <Button
                              onClick={() => {
                                leaveProject({
                                  id: project.id,
                                }).then(() => {
                                  toast.success(
                                    "You successfully left the project! :)",
                                  );
                                });
                              }}
                              className="w-[50%]"
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>

                  <Link href={`/chats/project/${project?.id}`}>
                    <Button>{t("common.go-to-chat")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <H6 className="border-b border-[#D2D1D1] pb-2">
            {t("common.overview")}
          </H6>

          <div className="flex flex-col space-y-4">
            <div className="w-[90%]">
              <p className="text-paper-contrast/60 text-base break-all">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-paper-contrast/60 text-sm">
                {t("project.helpers.start-date")}:{" "}
                {dayjs(project.startDate).format("LL")}
              </span>

              {project.endDate && (
                <span className="text-paper-contrast/60 text-sm">
                  {t("project.helpers.end-date")}:{" "}
                  {dayjs(project.endDate).format("LL")}
                </span>
              )}
            </div>
          </div>
        </div>

        <Tabs.Root
          value={currentTab}
          onValueChange={(value) => {
            setCurrentTab(value as Tab);
          }}
        >
          <Tabs.List className="flex border-b border-paper-contrast/25">
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={twMerge(
                  cx(
                    "font-semibold text-paper-contrast/40 border-paper-brand border-b-2 p-4",
                    {
                      "text-paper-contrast border-paper-contrast":
                        currentTab === tab.id,
                    },
                  ),
                )}
              >
                {tab.title}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value={Tab.MEMBERS} className="flex flex-col">
            <div className="flex space-x-6 overflow-x-auto py-6">
              <Link href={`/users/${project.founder.id}`}>
                <div className="min-w-[13rem] h-[14rem] flex flex-col items-center justify-center bg-[#F8F9FA] relative rounded-lg shadow-sm space-y-4">
                  <div className="w-24 h-24">
                    <Avatar
                      src={project.founder.avatar}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="w-[75%] flex flex-col items-center text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="font-semibold">
                      {project.founder.firstName} {project.founder.lastName}
                    </span>

                    <span className="text-paper-contrast/50">Founder</span>
                  </div>
                </div>
              </Link>

              {project.members.map((m) =>
                m.isOccupied ? (
                  <ProjectMemberCard
                    key={m.id}
                    member={m}
                    project={project}
                    showOptions={isOwner}
                  />
                ) : (
                  <ProjectMemberCard
                    key={m.id}
                    member={m}
                    project={project}
                    showOptions={false}
                  />
                ),
              )}
            </div>

            <div className="flex"></div>

            <div className="flex">
              {isOwner && (
                <Modal.RootFn>
                  {({close}) => (
                    <>
                      <Modal.Trigger>
                        <Button
                          className="w-[13rem] border-2 space-x-2 px-1"
                          color="secondary"
                        >
                          <span className="inline-flex p-1 border-current border-2 rounded-full">
                            <Icon.Plus className="w-4 h-auto" />
                          </span>

                          <span>Add member</span>
                        </Button>
                      </Modal.Trigger>

                      <AddMemberModal
                        close={close}
                        showError={project.slots < 1}
                        projectId={project.id}
                      />
                    </>
                  )}
                </Modal.RootFn>
              )}
            </div>
          </Tabs.Content>

          {isOwner && (
            <Tabs.Content value={Tab.REQUESTS}>
              <div className="flex space-x-6 overflow-x-auto py-6">
                {project.requests.length === 0 && (
                  <div className="w-full flex flex-col items-center justify-center text-center space-y-4">
                    <Icon.Empty />

                    <span className="text-lg text-[#817C7C] font-manrope font-medium p-4">
                      {t("project.state.no-requests")}
                    </span>
                  </div>
                )}

                {project.requests.map(({id, user, member}) => (
                  <div
                    key={id}
                    role="presentation"
                    onClick={() => {
                      navigate(`/users/${user.id}`);
                    }}
                  >
                    <div className="flex flex-col items-center min-w-[12rem] pt-8 pb-4 relative bg-paper rounded-lg shadow-md space-y-4 cursor-pointer">
                      <Avatar src={user.avatar} className="w-14 h-auto" />

                      <div className="flex flex-col items-center text-center">
                        <span className="font-semibold">
                          {user.firstName} {user.lastName}
                        </span>

                        <span className="text-paper-contrast/50">
                          {member.role}
                        </span>
                      </div>

                      <div className="w-[100%] h-[1px] bg-paper-contrast/25" />

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            acceptRequest({
                              projectId: project.id,
                              requestId: id,
                            }).then(({member}) => {
                              toast.success(
                                "You succesfully accepted the project request! :)",
                              );

                              queryClient.setQueryData(
                                ["projects", "detail", project.id],
                                {
                                  project: {
                                    ...project,
                                    members: [...project.members, member],
                                    requests: project.requests.filter(
                                      (r) => r.id !== id,
                                    ),
                                  },
                                },
                              );
                            });
                          }}
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#00AB45]">
                            <Icon.Plus className="text-[#00AB45] w-4 h-4" />
                          </span>
                        </button>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            rejectRequest({
                              projectId: project.id,
                              requestId: id,
                            }).then(() => {
                              toast.success(
                                "You succesfully rejected the project request! :)",
                              );

                              queryClient.setQueryData(
                                ["projects", "detail", project.id],
                                {
                                  project: {
                                    ...project,
                                    requests: project.requests.filter(
                                      (r) => r.id !== id,
                                    ),
                                  },
                                },
                              );
                            });
                          }}
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#EB5A5A]">
                            <Icon.Cross className="text-[#EB5A5A] w-5 h-5" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>
          )}

          {(isOwner || isMember) && (
            <Tabs.Content value={Tab.TASKS}>
              {project.tasks.length === 0 && isOwner ? (
                <div>
                  <div className="mt-6 ml-0">
                    <div className="w-full flex flex-col items-center justify-center text-center space-y-4">
                      <Icon.Empty />

                      <span className="text-lg text-[#817C7C] font-manrope font-medium p-4">
                        {t("project.state.no-tasks")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Modal.RootFn>
                      {({close}) => (
                        <>
                          <Modal.Trigger>
                            <button>
                              <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#8193F3]">
                                <Icon.Plus className="fill-[#8193F3] text-[#8193F3] w-4 h-4" />
                              </span>
                            </button>
                          </Modal.Trigger>

                          <CreateTaskModal
                            close={close}
                            members={project.members}
                            project={project}
                          />
                        </>
                      )}
                    </Modal.RootFn>
                  </div>
                </div>
              ) : !anyTasks && isMember ? (
                <div className="mt-6 ml-0">
                  <div className="w-full flex flex-col items-center justify-center text-center space-y-4">
                    <Icon.Empty />

                    <span className="text-lg text-[#817C7C] font-manrope font-medium p-4">
                      {t("project.state.no-tasks")}
                    </span>
                  </div>
                </div>
              ) : isMember && !isOwner ? (
                <div>
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;

                      const taskId = result.draggableId;
                      const newStatus = result.destination
                        .droppableId as TaskStatus;

                      changeTaskStatus({
                        projectId: project.id,
                        status: newStatus,
                        taskId,
                      }).then(() => {
                        toast.success(
                          `You successfully changed task status to ${result.destination?.droppableId}! :)`,
                        );
                      });

                      const tasks = project.tasks;

                      const draggedTask = tasks.find((t) => t.id === taskId)!;

                      const tasksExcludingDraggedOne = tasks.filter(
                        (t) => t.id !== draggedTask.id,
                      );

                      const tasksWithSameStatus =
                        tasksExcludingDraggedOne.filter(
                          (t) => t.id === newStatus,
                        );

                      const insertedTaskIdx = result.destination.index;

                      tasksWithSameStatus.splice(insertedTaskIdx, 0, {
                        ...draggedTask,
                        status: newStatus,
                      });

                      const tasksWithAnotherStatus =
                        tasksExcludingDraggedOne.filter((t) =>
                          tasksWithSameStatus.some((task) => task.id !== t.id),
                        );

                      const updatedTasks = [
                        ...tasksWithAnotherStatus,
                        ...tasksWithSameStatus,
                      ];

                      queryClient.setQueryData(
                        ["projects", "detail", project.id],
                        {
                          project: {
                            ...project,
                            tasks: updatedTasks,
                          },
                        },
                      );

                      return result;
                    }}
                  >
                    <div className="py-4 bg-[#F8F9FA]">
                      <Droppable droppableId="tasks" type="tasks">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="w-[100%] flex space-x-8"
                          >
                            {categories.map((category) => (
                              <div key={category.id} className="w-[30%]">
                                <Droppable droppableId={category.id}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      <div className="flex flex-col space-y-4">
                                        <div className="py-3 border-b border-paper-contrast">
                                          <span className="text-main font-semibold text-xl">
                                            {category.title}
                                          </span>
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                          {project.tasks
                                            .filter(
                                              (task) =>
                                                task.status === category.id,
                                            )
                                            .map((task, idx) => (
                                              <Draggable
                                                key={task.title}
                                                draggableId={task.id}
                                                index={idx}
                                              >
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <div
                                                      className={cx(
                                                        "flex flex-col bg-paper rounded-lg shadow-md p-6 space-y-1",
                                                        {
                                                          "border-4 border-[#A5DF9F]":
                                                            task.priority ===
                                                            TaskPriority.LOW,

                                                          "border-4 border-[#F4DB5B]":
                                                            task.priority ===
                                                            TaskPriority.MEDIUM,
                                                          "border-4 border-[#FFA8A8]":
                                                            task.priority ===
                                                            TaskPriority.HIGH,
                                                        },
                                                      )}
                                                    >
                                                      <div className="flex space-x-2">
                                                        <Icon.Flag
                                                          className={cx(
                                                            "w-6 h-auto",
                                                            {
                                                              "text-[#A5DF9F]":
                                                                task.priority ===
                                                                TaskPriority.LOW,

                                                              "text-[#F4DB5B]":
                                                                task.priority ===
                                                                TaskPriority.MEDIUM,
                                                              "text-[#FFA8A8]":
                                                                task.priority ===
                                                                TaskPriority.HIGH,
                                                            },
                                                          )}
                                                        />

                                                        <span className="font-semibold text-lg">
                                                          {task.title}
                                                        </span>
                                                      </div>

                                                      <div className="flex space-x-1">
                                                        <span className="text-paper-contrast/60">
                                                          Deadline:
                                                        </span>

                                                        <span>
                                                          {dayjs(
                                                            task.deadline,
                                                          ).format("LL")}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </Draggable>
                                            ))}
                                        </div>
                                      </div>

                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </DragDropContext>
                </div>
              ) : (
                <div className="flex flex-col space-y-10 py-8">
                  <div className="flex justify-end">
                    <Modal.RootFn>
                      {({close}) => (
                        <>
                          <Modal.Trigger>
                            <button>
                              <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#8193F3]">
                                <Icon.Plus className="fill-[#8193F3] text-[#8193F3] w-4 h-4" />
                              </span>
                            </button>
                          </Modal.Trigger>

                          <CreateTaskModal
                            close={close}
                            members={project.members}
                            project={project}
                          />
                        </>
                      )}
                    </Modal.RootFn>
                  </div>

                  <div className="p-8 rounded-xl bg-[#F8F9FA]">
                    <table className="w-[100%] border-collapse">
                      <thead>
                        <tr className="text-paper-contrast/60 font-semibold text-left [&>th]:pb-4 [&>th]:border-b [&>th]:border-[#CBCFFF]">
                          <th className="w-[30%]">Title</th>
                          <th className="w-[10%] text-center">Priority</th>
                          <th className="w-[15%] text-center">Status</th>
                          <th className="w-[15%] text-center">Deadline</th>
                          <th className="w-[15%] text-center">Assignees</th>
                          <th className="w-[15%] text-center">Accept</th>
                        </tr>
                      </thead>

                      <tbody className="before:content-['~'] before:block before:leading-[2rem] before:indent-[-999999px]">
                        {project.tasks.map((task, idx) => (
                          <tr key={idx} className="text-left [&>td]:py-2">
                            <td className="font-semibold text-main">
                              {task.title}
                            </td>

                            <td className="text-center">
                              <div
                                className={cx("inline-flex rounded-lg p-2", {
                                  "bg-[#A5DF9F]":
                                    task.priority === TaskPriority.LOW,
                                  "bg-[#F4DB5B]":
                                    task.priority === TaskPriority.MEDIUM,
                                  "bg-[#F78888]":
                                    task.priority === TaskPriority.HIGH,
                                })}
                              >
                                <Icon.Flag className="w-6 h-auto" />
                              </div>
                            </td>

                            <td className="text-center">
                              <span className="bg-accent text-sm text-accent-contrast rounded-md p-2">
                                {task.status}
                              </span>
                            </td>

                            <td className="text-center">
                              <div className="inline-flex items-center bg-accent rounded-md space-x-2 p-2">
                                <span className="text-sm text-accent-contrast">
                                  {dayjs().to(dayjs(new Date(task.deadline)))}
                                </span>
                              </div>
                            </td>

                            <td className="flex items-center justify-start">
                              <Avatar
                                src={task.member.user.avatar}
                                className="m-auto"
                              />
                            </td>

                            <td className="text-center">
                              <Checkbox
                                onClick={() => {
                                  acceptTask({
                                    projectId: project.id,
                                    taskId: task.id,
                                  }).then(() => {
                                    toast.success(
                                      "You successfully accepted a project task! :)",
                                    );

                                    queryClient.setQueryData(
                                      ["projects", "detail", project.id],
                                      {
                                        project: {
                                          ...project,
                                          tasks: project.tasks.filter(
                                            (t) => t.id !== task.id,
                                          ),
                                        },
                                      },
                                    );
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Tabs.Content>
          )}
        </Tabs.Root>
      </div>
    </ContentTemplate>
  );
};

// @ts-ignore
// eslint-disable-next-line
const InvestmentRequestModal: React.FC<ModalWindowPropsWithClose> = ({
  close,
}) => {
  const {t} = useTranslation();

  const {register, handleSubmit} = useForm<{
    financialModel: Nullable<File>;
    businessModel: Nullable<File>;
  }>({
    defaultValues: {
      financialModel: null,
      businessModel: null,
    },
  });

  return (
    <Modal.Window close={close} title={t("project.modals.request-investment")}>
      <div className="flex flex-col bg-paper rounded-3xl shadow-even-md space-y-12 p-10">
        <H3 className="text-center">Request for investment</H3>

        <form onSubmit={handleSubmit(() => {})} className="space-y-8">
          <div className="space-y-6">
            <UploadField
              {...register("financialModel")}
              label="Financial model"
              placeholder="financial.pdf"
              className="h-auto"
            />

            <TextField
              {...register("businessModel")}
              label="Business model"
              placeholder="Default"
              className="h-auto"
            />
          </div>

          <div className="flex space-x-4">
            <Modal.Close>
              <Button color="secondary" className="w-[100%]">
                Cancel
              </Button>
            </Modal.Close>

            <Button type="submit" className="w-[100%]">
              Send
            </Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};

interface CreateTaskModalProps extends ModalWindowPropsWithClose {
  project: SpecificProject;
  members: ProjectMember[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  close,
  members,
  project,
}) => {
  const {t} = useTranslation();

  const {register, handleSubmit, watch, control, formState} = useForm<{
    title: string;
    description: string;
    deadline: {
      date: Nullable<Date>;
      time: Nullable<string>;
    };
    priority: Nullable<TaskPriority>;
    memberId: Nullable<Id>;
  }>({
    defaultValues: {
      title: "",
      description: "",
      deadline: {
        date: null,
        time: "",
      },
      priority: null,
      memberId: null,
    },
  });

  const {createTask} = useCreateTask();

  const memberId = watch("memberId");

  const occupiedMembers = members.filter((m) => m.isOccupied);

  const selectedMember = occupiedMembers.find((m) => m.id === memberId);

  return (
    <Modal.Window close={close} title={t("project.modals.create-task.title")}>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit((form) => {
            createTask({
              title: form.title,
              description: form.description,
              deadline: form.deadline.date!,
              priority: form.priority!,
              memberId: form.memberId!,
              projectId: project.id,
            })
              .then(() => {
                toast.success(
                  "You successfully assigned a project task to this member! :)",
                );

                queryClient.setQueryData(["projects", "detail", project.id], {
                  project: {
                    ...project,
                    tasks: [
                      ...project.tasks,
                      {
                        id: nanoid(),
                        title: form.title,
                        description: form.description,
                        deadline: form.deadline.date,
                        priority: form.priority,
                        status: TaskStatus.ASSIGNED,
                        member: members.find((m) => m.id === memberId),
                      },
                    ],
                  },
                });
              })
              .finally(() => {
                close();
              });
          })}
          className="flex flex-col space-y-12"
        >
          <div className="flex flex-col space-y-4">
            <TextField
              {...register("title", {required: true})}
              type="text"
              placeholder="Task title"
              className="h-auto"
            />

            <Textarea
              {...register("description", {required: true})}
              placeholder="Description of task"
            />

            <div className="flex space-x-2">
              <Controller
                control={control}
                name="deadline.date"
                rules={{required: true}}
                render={({field: {onChange, value, disabled}}) => (
                  <DatePicker
                    onSelect={onChange}
                    selected={value || undefined}
                    label="Date"
                    disabled={disabled}
                    className="w-[65%]"
                  />
                )}
              />

              <TimePicker label="Time" className="w-[35%]" />
            </div>

            <div className="flex space-x-6 items-center">
              <Controller
                control={control}
                name="priority"
                rules={{required: true}}
                render={({field: {name, onChange, value, disabled}}) => (
                  <Select.Root
                    name={name}
                    onValueChange={onChange}
                    value={value || undefined}
                    disabled={disabled}
                    placeholder={<Icon.Flag className="w-6 h-auto" />}
                    className="w-[20%] h-auto"
                  >
                    <Select.Item value={TaskPriority.HIGH}>
                      <span className="inline-flex space-x-2 items-center">
                        <span className="bg-[#F78888] rounded-xl p-2">
                          <Icon.Flag className="w-4 h-auto" />
                        </span>
                      </span>
                    </Select.Item>

                    <Select.Item value={TaskPriority.MEDIUM}>
                      <span className="inline-flex space-x-2 items-center">
                        <span className="bg-[#F4DB5B] rounded-xl p-2">
                          <Icon.Flag className="w-4 h-auto" />
                        </span>
                      </span>
                    </Select.Item>

                    <Select.Item value={TaskPriority.LOW}>
                      <span className="inline-flex space-x-2 items-center">
                        <span className="bg-[#A5DF9F] rounded-xl p-2">
                          <Icon.Flag className="w-4 h-auto" />
                        </span>
                      </span>
                    </Select.Item>
                  </Select.Root>
                )}
              />

              <Controller
                control={control}
                name="memberId"
                rules={{required: true}}
                render={({field: {name, onChange, value, disabled}}) => (
                  <Select.Root
                    name={name}
                    value={value || undefined}
                    onValueChange={onChange}
                    disabled={disabled}
                    placeholder="Member"
                    className="w-[70%] h-auto"
                  >
                    {occupiedMembers.map((m) => (
                      <Select.Item key={m.id} value={m.id}>
                        {m.role}
                      </Select.Item>
                    ))}
                  </Select.Root>
                )}
              />

              <div className="w-[20%]">
                {selectedMember && (
                  <Avatar
                    src={selectedMember.user.avatar}
                    alt="Selected member's profile picture"
                    className="w-12 h-auto m-auto"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Modal.Close>
              <Button color="secondary" className="w-[50%]">
                Cancel
              </Button>
            </Modal.Close>

            <Button
              disabled={!formState.isValid}
              type="submit"
              className="w-[50%]"
            >
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};

interface SendProjectRequestModalProps extends ModalWindowPropsWithClose {
  members: ProjectMember[];
}

const SendProjectRequestModal: React.FC<SendProjectRequestModalProps> = ({
  members,
  close,
}) => {
  const {t} = useTranslation();

  const {handleSubmit, watch, control} = useForm<{
    selectedMemberId: Nullable<ProjectMember["id"]>;
  }>({
    defaultValues: {
      selectedMemberId: null,
    },
  });

  const {sendProjectRequest} = useSendProjectRequest();

  const selectedMemberId = watch("selectedMemberId");

  const selectedMember = members.find(
    (member) => member.id === selectedMemberId,
  );

  return (
    <Modal.Window
      close={close}
      title={t("project.modals.send-project-request.title")}
    >
      <div className="flex flex-col space-y-4">
        <div>
          <Controller
            name="selectedMemberId"
            control={control}
            render={({field: {value, onChange, name, disabled}}) => (
              <Select.Root
                value={value || undefined}
                onValueChange={onChange}
                name={name}
                disabled={disabled}
                className="h-auto"
              >
                {members
                  .filter((m) => !m.isOccupied)
                  .map((member) => (
                    <Select.Item
                      key={member.id}
                      value={member.id}
                      className="bg-[#F1F5F9] shadow-even-lg"
                    >
                      {member.role}
                    </Select.Item>
                  ))}
              </Select.Root>
            )}
          />
        </div>

        {selectedMember && (
          <form
            onSubmit={handleSubmit(() => {
              console.log(1);

              sendProjectRequest({
                cardId: selectedMember.cardId,
                memberId: selectedMember.id,
                projectId: selectedMember.project.id,
              })
                .then(() => {
                  toast.success("You successfully sent project request! :)");
                })
                .finally(() => {
                  close();
                });
            })}
            className="space-y-6"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4 w-[90%]">
                <span className="text-accent font-semibold">Requirements</span>

                <p className="text-paper-contrast/60 text-sm ml-8 break-all">
                  {selectedMember.requirements}
                </p>
              </div>

              <div className="flex flex-col space-y-4 w-[90%]">
                <span className="text-accent font-semibold">Benefits</span>

                <p className="text-paper-contrast/60 text-sm ml-8 break-all">
                  {selectedMember.benefits}
                </p>
              </div>
            </div>

            <div className="flex space-x-6 items-center">
              <Modal.Close>
                <Button className="w-[50%]" color="secondary">
                  Cancel
                </Button>
              </Modal.Close>

              <Button
                type="submit"
                disabled={!selectedMemberId}
                className="w-[50%]"
              >
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal.Window>
  );
};

enum AddMemberModalTab {
  FIND_MEMBER = "find-member",
  FIND_TEAM = "find-team",
}

interface AddMemberModalProps extends ModalWindowPropsWithClose {
  projectId: Id;
  showError: boolean;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  projectId,
  showError,
  close,
}) => {
  const {t} = useTranslation();

  const [currentTab, setCurrentTab] = useState<AddMemberModalTab>(
    AddMemberModalTab.FIND_MEMBER,
  );

  const {handleSubmit, formState, register} = useForm<{
    role: string;
    requirements: string;
    benefits: string;
  }>({
    defaultValues: {
      role: "",
      requirements: "",
      benefits: "",
    },
  });

  const {createMember} = useCreateMember();

  const tabs: Array<{
    id: AddMemberModalTab;
    label: string;
  }> = [
    {
      id: AddMemberModalTab.FIND_MEMBER,
      label: "Find specialist",
    },
    {
      id: AddMemberModalTab.FIND_TEAM,
      label: "Find team",
    },
  ];

  return (
    <Modal.Window title="Add member">
      {showError && (
        <div className="w-[18rem] h-[16rem] flex flex-col space-y-6 items-center justify-center text-center m-auto rounded-lg border-2 border-[#1E269114] mt-12">
          <p className="font-medium font-manrope text-lg">
            {t("project.modals.add-member.title")}
          </p>

          <div className="flex items-center space-x-4">
            <img src={whatsapp} className="w-5 h-5" alt="Whatsapp" />
            <span className="font-manrope font-medium text-xl">
              +7 708 802 8005
            </span>
          </div>

          <Link
            href="https://api.whatsapp.com/send?phone=77088028005"
            target="_blank"
            onClick={() => {
              window.location.href =
                "https://api.whatsapp.com/send?phone=77088028005";
            }}
          >
            <Button>{t("project.modals.add-member.buttons.write")}</Button>
          </Link>
        </div>
      )}

      {!showError && (
        <Tabs.Root
          value={currentTab}
          onValueChange={(tab) => {
            setCurrentTab(tab as AddMemberModalTab);
          }}
        >
          <Tabs.List>
            <div className="w-full">
              {tabs.map((tab) => (
                <Tabs.Trigger key={tab.id} value={tab.id} className="w-1/2">
                  <div
                    className={twMerge(
                      cx(
                        "w-full flex items-center justify-center py-4 border-b border-[#E9E4E4] text-[#817C7C]",
                        {
                          "border-b-2 border-[#112042] text-[#112042]":
                            currentTab === tab.id,
                        },
                      ),
                    )}
                  >
                    <span className="font-semibold">{tab.label}</span>
                  </div>
                </Tabs.Trigger>
              ))}
            </div>
          </Tabs.List>

          <Tabs.Content value={AddMemberModalTab.FIND_MEMBER} className="pt-4">
            <form
              onSubmit={handleSubmit((form) => {
                createMember({
                  role: form.role,
                  requirements: form.requirements,
                  benefits: form.benefits,
                  projectId,
                })
                  .then(() => {
                    toast.success("You successfully created a member!");
                  })
                  .finally(() => {
                    close();
                  });
              })}
              className="flex flex-col space-y-8"
            >
              <div className="flex flex-col space-y-4">
                <TextField
                  placeholder="UI/UX designer"
                  className="h-auto"
                  {...register("role", {required: true})}
                />
                <Textarea
                  placeholder="Requirements"
                  {...register("requirements", {required: true})}
                />
                <Textarea
                  placeholder="Benefits"
                  {...register("benefits", {required: true})}
                />
              </div>

              <div className="flex justify-end">
                <Button disabled={!formState.isValid} type="submit">
                  Confirm
                </Button>
              </div>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      )}
    </Modal.Window>
  );
};
