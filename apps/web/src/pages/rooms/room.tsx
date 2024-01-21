import {useEffect, useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {twMerge} from "tailwind-merge";
import {BiDotsVerticalRounded} from "react-icons/bi";
import {BsPlus} from "react-icons/bs";
import {HiXMark} from "react-icons/hi2";
import {AiOutlineFlag} from "react-icons/ai";
import {Controller, useForm} from "react-hook-form";
import {Checkbox, H6, Select} from "@shared/ui";
import {PiNotePencilDuotone} from "react-icons/pi";
import * as Popover from "@radix-ui/react-popover";
import {AiOutlineLike, AiOutlineDislike} from "react-icons/ai";
import {useLocation, useParams} from "wouter";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {LiaDoorOpenSolid} from "react-icons/lia";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

import {
  Avatar,
  Button,
  ContentTemplate,
  DatePicker,
  H2,
  H3,
  H4,
  H5,
  TextField,
  Textarea,
  TimePicker,
  UploadField,
} from "@shared/ui";
import wall from "@shared/assets/wall.jpg";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {
  Nullable,
  Project,
  ProjectMember,
  TaskPriority,
  TaskStatus,
} from "@shared/lib/types";
import {dayjs} from "@shared/lib/dayjs";
import {api} from "@shared/api";
import {useSelector} from "react-redux";
import {authModel} from "@features/auth";

type Tab = "team-members" | "offers" | "tasks";

const categories = [
  {
    id: "ASSIGNED",
    title: "To fulfillment",
  },
  {
    id: "IN_PROGRESS",
    title: "In process",
  },
  {
    id: "DONE",
    title: "Done",
  },
];

interface Role {
  specialist: string;
  benefits: string;
  requirements: string;
}

export const RoomPage: React.FC = () => {
  const [, navigate] = useLocation();

  const {t} = useTranslation();

  const [currentTab, setCurrentTab] = useState<Tab>("team-members");

  const [isInvestmentRequestModalOpen, setIsInvestmentRequestModalOpen] =
    useState(false);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const [leaveFeedbackModal, setLeaveFeedbackModal] = useState<{
    open: boolean;
    member: Nullable<ProjectMember>;
    projectId: Nullable<string>;
  }>({
    open: false,
    member: null,
    projectId: null,
  });

  const [isInvestmentRequested, setIsInvestmentRequested] = useState(false);

  const credentials = useSelector(authModel.selectors.credentials);

  const [confirmJoinRequestModal, setConfirmJoinRequestModal] = useState<{
    open: boolean;
    roles: Nullable<(Role & {cardId: string; projectId: string; id: string})[]>;
  }>({
    open: false,
    roles: null,
  });

  const {id} = useParams() as {id: string};

  const [project, setProject] = useState<Nullable<Project>>(null);

  useEffect(() => {
    api.projects.getProject({id}).then(({data}) => setProject(data.project));
  }, [id]);

  const isOwner = project?.founder.id === credentials.data?.id;
  const isMember = project?.members.some(
    (m) => m.user?.id === credentials.data?.id,
  );

  const isVisitor = !isOwner && !isMember;

  const tabs = [
    {
      id: "team-members",
      title: `${t("common.team-members")} (${project?.slots.occupied}/${project
        ?.slots.total})`,
    },
    {
      id: "offers",
      title: `${t("common.requests")} (${project?.requests?.length})`,
    },
    {
      id: "tasks",
      title: t("common.tasks"),
    },
  ].filter((tab) => {
    if (isVisitor) return !["tasks", "offers"].includes(tab.id);
    if (!isOwner && isMember) return !["offers"].includes(tab.id);

    return true;
  });

  if (!project) return null;

  return (
    <>
      <ContentTemplate>
        <div className="w-[100%] flex flex-col">
          <div
            style={{backgroundImage: `url(${wall})`}}
            className="w-[100%] h-48 flex flex-col justify-start items-end relative bg-center bg-cover space-y-6 p-8"
          >
            <Button
              onClick={() => {
                setIsInvestmentRequested(true);
              }}
              disabled={isInvestmentRequested}
            >
              {isInvestmentRequested
                ? "Coming soon..."
                : t("common.request-investment")}
            </Button>

            {/* <BsQrCodeScan className="w-10 h-auto text-paper" /> */}

            <Avatar
              src={project.avatar}
              className="w-44 h-auto absolute left-8 -bottom-1/2"
            />
          </div>

          <div className="flex flex-col space-y-8 p-8 pt-32">
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <H2>{project.name}</H2>
                <span>
                  {project.location.city}, {project.location.country}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {isVisitor ? (
                  <Button
                    onClick={() => {
                      setConfirmJoinRequestModal({
                        open: true,
                        roles: project.members
                          .filter((m) => !m.isOccupied)
                          .map((m) => ({
                            id: m.id,
                            projectId: project.id,
                            //@ts-ignore
                            cardId: m.card.id,
                            specialist: m.role,
                            requirements: m.requirements,
                            benefits: m.benefits,
                          })),
                      });
                    }}
                  >
                    {t("common.send-offer")}
                  </Button>
                ) : isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        navigate(`/projects/${project.id}/edit`);
                      }}
                      className="inline-flex items-center text-lg space-x-1"
                    >
                      <PiNotePencilDuotone className="fill-accent w-5 h-auto" />

                      <span className="text-accent underline underline-offset-4">
                        {t("common.edit")}
                      </span>
                    </button>

                    <Button
                      onClick={() => {
                        navigate(`/chat/project/${project.id}`);
                      }}
                    >
                      {t("common.go-to-chat")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button className="inline-flex items-center text-lg space-x-1">
                          <LiaDoorOpenSolid className="fill-accent w-8 h-auto" />

                          <span className="text-accent underline underline-offset-4">
                            {t("common.leave-project")}
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
                                  api.projects
                                    .leaveProject({
                                      id: project.id,
                                    })
                                    .then(() => {
                                      navigate("/");

                                      toast.success(
                                        "You successfully left the project! :)",
                                      );
                                    })
                                    .catch(() => {
                                      toast.error("Something's wrong :(");
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

                    <Button
                      onClick={() => {
                        navigate(`/chat/project/${project?.id}`);
                      }}
                    >
                      {t("common.go-to-chat")}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <H5>{t("common.overview")}</H5>

              <div className="flex flex-col space-y-4">
                <div className="w-[90%]">
                  <p className="text-paper-contrast/60 text-sm break-all">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-col">
                  <span className="text-paper-contrast/60 text-xs">
                    {t("common.start-date")}:{" "}
                    {dayjs(project.startDate).format("LL")}
                  </span>

                  {project.endDate && (
                    <span className="text-paper-contrast/60 text-xs">
                      {t("common.end-date")}:{" "}
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
                        "text-paper-contrast/40 border-paper-brand border-b-2 p-4",
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

              {(isOwner || isMember) && (
                <Tabs.Content value="team-members">
                  <div className="flex space-x-6 overflow-x-auto py-6">
                    {project.members.filter((m) => m.isOccupied).length ===
                      0 && (
                      <span className="text-lg text-paper-contrast/70 p-4">
                        {t("common.no-members")}
                      </span>
                    )}

                    {project.members
                      .filter((m) => m.isOccupied)
                      .map((member, idx) => (
                        <div
                          key={idx}
                          role="presentation"
                          onClick={() => {
                            navigate(`/profiles/${member.user.id}`);
                          }}
                          className="flex flex-col items-center justify-center min-w-[12rem] min-h-[12rem] relative bg-paper rounded-lg shadow-md space-y-4 cursor-pointer"
                        >
                          <Avatar
                            src={member.user.avatar}
                            className="w-14 h-auto"
                          />

                          <div className="flex flex-col items-center text-center">
                            <span className="font-semibold">
                              {member.user.firstName} {member.user.lastName}
                            </span>

                            <span className="text-paper-contrast/50">
                              {member.role}
                            </span>
                          </div>

                          {isOwner && (
                            <Popover.Root>
                              <Popover.Trigger
                                onClick={(e) => e.stopPropagation()}
                              >
                                <BiDotsVerticalRounded className="w-5 h-auto fill-paper-contrast absolute right-4 top-4" />
                              </Popover.Trigger>

                              <Popover.Portal>
                                <Popover.Content side="top" align="start">
                                  <div className="flex flex-col bg-paper rounded-xl shadow-md space-y-2 p-4">
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        setLeaveFeedbackModal({
                                          open: true,
                                          member,
                                          projectId: project.id,
                                        });
                                      }}
                                    >
                                      Leave feedback
                                    </Button>

                                    <Popover.Root>
                                      <Popover.Trigger className="w-[100%]">
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();

                                            api.projects
                                              .removeProjectMember({
                                                memberId: member.id,
                                                projectId: project.id,
                                              })
                                              .then(() => {
                                                setProject({
                                                  ...project,
                                                  members:
                                                    project.members.filter(
                                                      (m) => m.id !== member.id,
                                                    ),
                                                });

                                                toast.success(
                                                  "You successfully removed this project member",
                                                );
                                              })
                                              .catch(() => {
                                                toast.error(
                                                  "Something's wrong",
                                                );
                                              });
                                          }}
                                          className="w-[100%]"
                                        >
                                          Delete
                                        </Button>
                                      </Popover.Trigger>

                                      <Popover.Portal>
                                        <Popover.Content>
                                          <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md p-6 space-y-6">
                                            <H6>
                                              Do you really want to delete this
                                              member?
                                            </H6>

                                            <div className="flex space-x-4">
                                              <Popover.PopoverClose asChild>
                                                <Button
                                                  color="secondary"
                                                  className="w-[50%]"
                                                >
                                                  Cancel
                                                </Button>
                                              </Popover.PopoverClose>

                                              <Button
                                                onClick={(e) => {
                                                  e.stopPropagation();

                                                  api.projects
                                                    .removeProjectMember({
                                                      memberId: member.id,
                                                      projectId: project.id,
                                                    })
                                                    .then(() => {
                                                      toast.success(
                                                        "You successfully removed this project",
                                                      );

                                                      setProject({
                                                        ...project,
                                                        members:
                                                          project.members.filter(
                                                            (m) =>
                                                              m.id !==
                                                              member.id,
                                                          ),
                                                      });
                                                    })
                                                    .catch(() => {
                                                      toast.error(
                                                        "Something's wrong",
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
                                  </div>
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>
                          )}
                        </div>
                      ))}
                  </div>
                </Tabs.Content>
              )}

              {isOwner && (
                <Tabs.Content value="offers">
                  <div className="flex space-x-6 overflow-x-auto py-6">
                    {project.requests.length === 0 && (
                      <span className="text-lg text-paper-contrast/70 p-4">
                        {t("common.no-requests")}
                      </span>
                    )}

                    {project.requests.map(({id, user, member}, idx) => (
                      <div
                        key={idx}
                        role="presentation"
                        onClick={() => {
                          navigate(`/profiles/${user.id}`);
                        }}
                        className="flex flex-col items-center min-w-[12rem] pt-8 pb-4 relative bg-paper rounded-lg shadow-md space-y-4 cursor-pointer"
                      >
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
                            onClick={(e) => {
                              e.stopPropagation();

                              api.projects
                                .acceptProjectRequest({
                                  projectId: project.id,
                                  requestId: id,
                                })
                                .then(() => {
                                  toast.success(
                                    "You succesfully accepted the project request :)",
                                  );

                                  const exist = project.members.some(
                                    (m) => m.id === member.id,
                                  );

                                  if (exist) {
                                    setProject({
                                      ...project,
                                      slots: {
                                        ...project.slots,
                                        occupied: project.slots.occupied + 1,
                                      },
                                      members: project.members.map((m) =>
                                        m.id === member.id
                                          ? {...m, isOccupied: true, user}
                                          : m,
                                      ),
                                      requests: project.requests.filter(
                                        (r) => r.id !== id,
                                      ),
                                    });
                                  } else {
                                    setProject({
                                      ...project,
                                      members: [
                                        ...project.members!,
                                        {...member, user},
                                      ],
                                      requests: project.requests.filter(
                                        (r) => r.id !== id,
                                      ),
                                    });
                                  }
                                })
                                .catch(() => {
                                  toast.error("Something's wrong :(");
                                });
                            }}
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-full border border-[#00AB45]">
                              <BsPlus className="fill-[#00AB45] w-6 h-6" />
                            </span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              api.projects
                                .declineProjectRequest({
                                  projectId: project.id,
                                  requestId: id,
                                })
                                .then(() => {
                                  toast.success(
                                    "You succesfully rejected the project request :)",
                                  );

                                  setProject({
                                    ...project,
                                    requests: project.requests.filter(
                                      (r) => r.id !== id,
                                    ),
                                  });
                                })
                                .catch(() => {
                                  toast.error("Something's wrong :(");
                                });
                            }}
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EB5A5A]">
                              <HiXMark className="fill-[#EB5A5A] w-5 h-5" />
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tabs.Content>
              )}

              {(isOwner || isMember) && (
                <Tabs.Content value="tasks">
                  {project.tasks.length === 0 && isOwner ? (
                    <div>
                      <div className="mt-10 ml-4">
                        <span className="text-lg text-paper-contrast/70">
                          {t("common.no-tasks")}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setIsCreateTaskModalOpen(true);
                          }}
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border border-main">
                            <BsPlus className="fill-main w-6 h-6" />
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : project.tasks.length === 0 && isMember ? (
                    <div className="mt-10 ml-4">
                      <span className="text-lg text-paper-contrast/70">
                        No tasks
                      </span>
                    </div>
                  ) : isMember && !isOwner ? (
                    <div>
                      <DragDropContext
                        onDragEnd={(result) => {
                          if (!result.destination) return;

                          api.projects
                            .changeProjectTaskStatus({
                              projectId: project.id,
                              status: result.destination
                                .droppableId as TaskStatus,
                              taskId: result.draggableId,
                            })
                            .then(() => {
                              toast.success(
                                `You successfully changed task status to ${result.destination?.droppableId} :)`,
                              );
                            })
                            .catch(() => {
                              toast.error("Something's wrong :(");
                            });

                          const tasks = project.tasks;

                          const task = tasks.find(
                            (t) => t.id === result.draggableId,
                          )!;

                          const otherTasks = tasks.filter(
                            (task) =>
                              task.status !== result.destination!.droppableId,
                          );

                          const thoseTasks = tasks.filter(
                            (task) =>
                              task.status === result.destination?.droppableId,
                          );

                          const updated = otherTasks.filter(
                            (t) => t.id !== task.id,
                          );

                          thoseTasks.splice(result.destination.index, 0, {
                            ...task,
                            status: result.destination!
                              .droppableId as TaskStatus,
                          });

                          setProject({
                            ...project,
                            tasks: updated.concat(thoseTasks),
                          });

                          return result;
                        }}
                      >
                        <div className="py-4">
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
                                                            <AiOutlineFlag
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
                        <button
                          onClick={() => {
                            setIsCreateTaskModalOpen(true);
                          }}
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border border-main">
                            <BsPlus className="fill-main w-6 h-6" />
                          </span>
                        </button>
                      </div>

                      <div className="bg-paper p-8 rounded-xl">
                        <table className="w-[100%] border-collapse">
                          <thead>
                            <tr className="text-paper-contrast/60 font-semibold text-left [&>th]:pb-4 [&>th]:border-b [&>th]:border-accent">
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
                                    className={cx(
                                      "inline-flex rounded-lg p-2",
                                      {
                                        "bg-[#A5DF9F]":
                                          task.priority === TaskPriority.LOW,
                                        "bg-[#F4DB5B]":
                                          task.priority === TaskPriority.MEDIUM,
                                        "bg-[#F78888]":
                                          task.priority === TaskPriority.HIGH,
                                      },
                                    )}
                                  >
                                    <AiOutlineFlag className="w-6 h-auto" />
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
                                      {dayjs().to(
                                        dayjs(new Date(task.deadline)),
                                      )}
                                    </span>
                                  </div>
                                </td>

                                <td className="flex items-center justify-start">
                                  <Avatar
                                    src={task.member.user.avatar}
                                    className="m-auto"
                                  />
                                </td>

                                <td
                                  className="text-center"
                                  onClick={() => {
                                    api.projects
                                      .acceptProjectTask({
                                        projectId: project.id,
                                        taskId: task.id,
                                      })
                                      .then(() => {
                                        toast.success(
                                          "You successfully accepted a project task",
                                        );

                                        setProject({
                                          ...project,
                                          tasks: project.tasks.filter(
                                            (t) => t.id !== task.id,
                                          ),
                                        });
                                      })
                                      .catch(() => {
                                        toast.error("Something's wrong");
                                      });
                                  }}
                                >
                                  <Checkbox />
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
        </div>
      </ContentTemplate>

      <InvestmentRequestModal
        open={isInvestmentRequestModalOpen}
        onClose={() => {
          setIsInvestmentRequestModalOpen(false);
        }}
      />

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        members={project.members}
        projectId={project.id}
        onFinish={(task: any) => {
          setProject((project: any) => ({
            ...project,
            tasks: [...project!.tasks, task],
          }));
        }}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
        }}
      />

      {leaveFeedbackModal.open && (
        <LeaveFeedbackModal
          member={leaveFeedbackModal.member!}
          projectId={leaveFeedbackModal.projectId!}
          open={leaveFeedbackModal.open}
          onClose={() => {
            setLeaveFeedbackModal({
              open: false,
              member: null,
              projectId: null,
            });
          }}
        />
      )}

      {confirmJoinRequestModal.open && (
        <ConfirmJoinRequestModal
          open={confirmJoinRequestModal.open}
          roles={confirmJoinRequestModal.roles!}
          onClose={() => {
            setConfirmJoinRequestModal({open: false, roles: null});
          }}
        />
      )}
    </>
  );
};

interface InvestmentRequestForm {
  financialModel: Nullable<File>;
  businessModel: Nullable<string>;
}

const InvestmentRequestModal: React.FC<WrappedModalProps> = ({
  open,
  onClose,
}) => {
  const {register, handleSubmit} = useForm<InvestmentRequestForm>({
    defaultValues: {
      financialModel: null,
      businessModel: null,
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col bg-paper rounded-3xl shadow-even-md space-y-12 p-10">
        <H3 className="text-center">Request for investment</H3>

        <form
          onSubmit={handleSubmit((form) => {
            console.log(form);
          })}
          className="space-y-8"
        >
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
            <Button
              color="secondary"
              type="button"
              onClick={onClose}
              className="w-[100%]"
            >
              Cancel
            </Button>

            <Button type="submit" className="w-[100%]">
              Send
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface CreateTaskForm {
  title: string;
  description: string;
  deadline: {
    date: Nullable<Date>;
    time: Nullable<string>;
  };
  priority: string;
  memberId: string;
}

const CreateTaskModal: React.FC<
  WrappedModalProps & {
    projectId: string;
    members: ProjectMember[];
    onFinish: (task: any) => void;
  }
> = ({open, onClose, ...props}) => {
  const {register, handleSubmit, watch, control, reset} =
    useForm<CreateTaskForm>({
      defaultValues: {
        title: "",
        description: "",
        deadline: {
          date: null,
          time: "",
        },
        priority: "",
        memberId: "",
      },
    });

  const memberId = watch("memberId");

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col bg-paper rounded-3xl shadow-even-md space-y-12 p-10">
        <H4>Create a task</H4>

        <form
          onSubmit={handleSubmit((form) => {
            if (
              !form.deadline ||
              !form.title ||
              !form.description ||
              !form.memberId ||
              !form.priority
            )
              return;

            api.projects
              .createProjectTask({
                title: form.title,
                description: form.description,
                deadline: new Date(form.deadline!.date!),
                priority: form.priority as TaskPriority,
                memberId: form.memberId,
                projectId: props.projectId,
              })
              .then((d) => {
                toast.success(
                  "You successfully assigned a project task to this member",
                );

                reset({
                  deadline: undefined,
                  description: undefined,
                  memberId: undefined,
                  priority: undefined,
                  title: undefined,
                });

                props.onFinish(d.data.task);

                onClose();
              })
              .catch(() => {
                toast.error("Something's wrong");
              });
          })}
          className="flex flex-col space-y-12"
        >
          <div className="flex flex-col space-y-4">
            <TextField
              {...register("title")}
              type="text"
              placeholder="Task title"
              className="h-auto"
            />

            <Textarea
              {...register("description")}
              placeholder="Description of task"
            />

            <div className="flex space-x-2">
              <Controller
                control={control}
                name="deadline.date"
                // @ts-ignore
                render={({field}) => (
                  <DatePicker
                    onSelect={(date) => field.onChange(date)}
                    selected={field.value || undefined}
                    label="Date"
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
                render={({field}) => (
                  <Select.Root
                    name="priority"
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    placeholder={<AiOutlineFlag className="w-6 h-auto" />}
                    className="w-[20%] h-auto"
                  >
                    <Select.Item value="HIGH">
                      <span className="inline-flex space-x-2 items-center">
                        <span className="bg-[#F78888] rounded-xl p-2">
                          <AiOutlineFlag className="w-4 h-auto" />
                        </span>
                      </span>
                    </Select.Item>

                    <Select.Item value="MEDIUM">
                      <span className="inline-flex space-x-2 items-center">
                        <span className="bg-[#F4DB5B] rounded-xl p-2">
                          <AiOutlineFlag className="w-4 h-auto" />
                        </span>
                      </span>
                    </Select.Item>

                    <Select.Item value="LOW">
                      <span className="inline-flex space-x-2 items-center">
                        <span className="bg-[#A5DF9F] rounded-xl p-2">
                          <AiOutlineFlag className="w-4 h-auto" />
                        </span>
                      </span>
                    </Select.Item>
                  </Select.Root>
                )}
              />

              <Controller
                control={control}
                name="memberId"
                render={({field}) => (
                  <Select.Root
                    name="memberId"
                    placeholder="Member"
                    className="w-[70%] h-auto"
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    {props.members
                      .filter((m) => m.isOccupied)
                      .map((m, idx) => (
                        <Select.Item key={idx} value={m.id}>
                          {m.role}
                        </Select.Item>
                      ))}
                  </Select.Root>
                )}
              />

              <div className="w-[20%]">
                {props.members
                  .filter((m) => m.isOccupied)
                  .find((m) => m.id === memberId) && (
                  <Avatar
                    src={
                      props.members
                        .filter((m) => m.isOccupied)
                        .find((m) => m.id === memberId)?.user.avatar || ""
                    }
                    className="w-12 h-auto m-auto"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => {
                onClose();
              }}
              color="secondary"
              type="button"
              className="w-[50%]"
            >
              Cancel
            </Button>

            <Button type="submit" className="w-[50%]">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface LeaveFeedbackForm {
  role: string;
  review: string;
  like: boolean;
}

const LeaveFeedbackModal: React.FC<
  WrappedModalProps & {member: ProjectMember; projectId: string}
> = ({open, onClose, member, projectId}) => {
  const {register, handleSubmit, setValue, watch} = useForm<LeaveFeedbackForm>({
    defaultValues: {
      role: "",
      review: "",
      like: true,
    },
  });

  const like = watch("like");

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[30rem] flex flex-col bg-paper relative rounded-3xl shadow-even-md space-y-8 p-8">
        <div className="flex space-x-4 items-center">
          <Avatar src={member.user.avatar} className="w-20 h-auto" />
          <div className="flex flex-col flex-1 overflow-hidden pr-20">
            <span className="text-xl font-bold break-keep text-ellipsis whitespace-nowrap overflow-hidden">
              {member.user.firstName} {member.user.lastName}
            </span>

            <span className="text-paper-contrast/75 break-keep text-ellipsis whitespace-nowrap overflow-hidden">
              {member.role}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((form) => {
            api.projects
              .leaveFeedback({
                description: form.review,
                memberId: member.id,
                like: form.like,
                projectId,
              })
              .then(() => {
                toast.success(
                  "You successfully left a feedback for this member",
                );

                onClose();
              })
              .catch(() => {
                toast.error("Something's wrong");
              });
          })}
          className="flex flex-col space-y-6"
        >
          {/* <Radio.Root className="flex flex-col space-y-2 text-left">
            <Radio.Item value="frontend-developer">
              Frontend developer
            </Radio.Item>

            <Radio.Item value="angular-developer">Angular developer</Radio.Item>

            <Radio.Item value="project-manager">Project manager</Radio.Item>
          </Radio.Root> */}

          <Textarea {...register("review")} placeholder="Review" />

          <div className="flex space-x-4">
            <Button color="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Send</Button>
          </div>
        </form>

        <div className="absolute right-8 top-0 flex items-center space-x-2 mt-0">
          <button
            onClick={() => {
              setValue("like", true);
            }}
          >
            <AiOutlineLike
              className="w-7 h-auto"
              style={{
                color: like ? "#8193F3" : "initial",
              }}
            />
          </button>

          <button
            onClick={() => {
              setValue("like", false);
            }}
          >
            <AiOutlineDislike
              style={{
                color: !like ? "#8193F3" : "initial",
              }}
              className="w-7 h-auto"
            />
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface ConfirmJoinRequestModalProps extends WrappedModalProps {
  roles: {
    id: string;
    requirements: string;
    benefits: string;
    specialist: string;
    cardId: string;
    projectId: string;
  }[];
}

const ConfirmJoinRequestModal: React.FC<ConfirmJoinRequestModalProps> = ({
  roles,
  ...props
}) => {
  const [selectedRole, setSelectedRole] = useState<Nullable<string>>(null);

  const data = roles.find((role) => role.id === selectedRole);

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="w-[35rem] flex flex-col space-y-8 bg-paper rounded-3xl shadow-even-md p-10">
        <div className="flex flex-col space-y-6">
          <H4>Confirm your project request</H4>

          <div>
            <Select.Root
              value={selectedRole || undefined}
              onValueChange={(value) => setSelectedRole(value)}
              className="h-auto"
            >
              {roles.map((role) => (
                <Select.Item key={role.id} value={role.id}>
                  {role.specialist}
                </Select.Item>
              ))}
            </Select.Root>
          </div>
        </div>

        {selectedRole && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            className="space-y-6"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4">
                <span className="text-accent font-semibold">Requirements</span>

                <p className="text-paper-contrast/60 text-sm ml-8">
                  {data?.requirements}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <span className="text-accent font-semibold">Benefits</span>

                <p className="text-paper-contrast/60 text-sm ml-8">
                  {data?.benefits}
                </p>
              </div>
            </div>

            <div className="flex space-x-6 items-center">
              <Button
                onClick={() => {
                  props.onClose();
                }}
                type="button"
                className="w-[50%]"
                color="secondary"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-[50%]"
                onClick={() => {
                  if (!data) return;

                  console.log(data);

                  api.projects
                    .sendProjectRequest({
                      cardId: data.cardId,
                      memberId: data.id,
                      projectId: data.projectId,
                    })
                    .then(() => {
                      toast.success(
                        "You successfully sent project request! :)",
                      );

                      props.onClose();
                    })
                    .catch(() => {
                      toast.error("Something's wrong :(");
                    });
                }}
              >
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
