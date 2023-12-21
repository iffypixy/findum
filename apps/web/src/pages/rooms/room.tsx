import {useState} from "react";
import {cx} from "class-variance-authority";
import * as Tabs from "@radix-ui/react-tabs";
import {twMerge} from "tailwind-merge";
import {BiDotsVerticalRounded} from "react-icons/bi";
import {BsPlus} from "react-icons/bs";
import {HiXMark} from "react-icons/hi2";
import {AiOutlineFlag} from "react-icons/ai";
import {useForm} from "react-hook-form";
import {Checkbox, H6, Select} from "@shared/ui";
import {PiNotePencilDuotone} from "react-icons/pi";
import * as Popover from "@radix-ui/react-popover";
import {AiOutlineLike, AiOutlineDislike} from "react-icons/ai";
import {useLocation} from "wouter";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {LiaDoorOpenSolid} from "react-icons/lia";

import {
  Avatar,
  Button,
  ContentTemplate,
  DatePicker,
  H2,
  H3,
  H4,
  H5,
  Radio,
  TextField,
  Textarea,
  TimePicker,
  UploadField,
} from "@shared/ui";
import wall from "@shared/assets/wall.jpg";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {Nullable} from "@shared/lib/types";
import {dayjs} from "@shared/lib/dayjs";

const avatar = "https://shorturl.at/ikvZ0";

interface Task {
  title: string;
  deadline: Date;
  priotity: 0 | 1 | 2 | -1;
  status: "to-fulfillment" | "in-process" | "done";
}

type Tab = "team-members" | "offers" | "tasks";

const categories = [
  {
    id: "to-fulfillment",
    title: "To fulfillment",
  },
  {
    id: "in-process",
    title: "In process",
  },
  {
    id: "done",
    title: "Done",
  },
];

interface Role {
  specialist: string;
  benefits: string;
  requirements: string;
}

const itasks: Task[] = [
  {
    title: "Authorization page",
    deadline: new Date(),
    priotity: 1,
    status: "to-fulfillment",
  },
  {
    title: "Profile page",
    deadline: new Date(),
    priotity: 2,
    status: "to-fulfillment",
  },
  {
    title: "Sign-in page",
    deadline: new Date(),
    priotity: 0,
    status: "to-fulfillment",
  },
  {
    title: "Sign-up page",
    deadline: new Date(),
    priotity: -1,
    status: "to-fulfillment",
  },
  {
    title: "Project page",
    deadline: new Date(),
    priotity: 1,
    status: "to-fulfillment",
  },
  {
    title: "Something else",
    deadline: new Date(),
    priotity: 1,
    status: "in-process",
  },
  {
    title: "Something hard",
    deadline: new Date(),
    priotity: 2,
    status: "in-process",
  },
  {title: "Something done", deadline: new Date(), priotity: 1, status: "done"},
  {
    title: "Finished a year ago",
    deadline: new Date(),
    priotity: 2,
    status: "done",
  },
];

export const RoomPage: React.FC = () => {
  const [, navigate] = useLocation();

  const [currentTab, setCurrentTab] = useState<Tab>("team-members");

  const [isInvestmentRequestModalOpen, setIsInvestmentRequestModalOpen] =
    useState(false);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const [isLeaveFeedbackModalOpen, setIsLeaveFeedbackModalOpen] =
    useState(false);

  const [isInvestmentRequested, setIsInvestmentRequested] = useState(false);

  const [tasks, setTasks] = useState(itasks);

  const [confirmJoinRequestModal, setConfirmJoinRequestModal] = useState<{
    open: boolean;
    roles: Nullable<Role[]>;
  }>({
    open: false,
    roles: null,
  });

  const isOwner = false;
  const isMember = isOwner || false;

  const isVisitor = !isOwner && !isMember;

  const project = {
    members: [
      {avatar, firstName: "Sabina", lastName: "Shakhanova", role: "Designer"},
      {avatar, firstName: "Sabina", lastName: "Shakhanova", role: "Designer"},
      {avatar, firstName: "Sabina", lastName: "Shakhanova", role: "Designer"},
    ],
    slots: [{role: "Full-stack dev."}, {role: "Project manager"}],
    offers: [{}, {}],
    startDate: new Date(),
    endDate: new Date(),
  };

  const tabs = [
    {
      id: "team-members",
      title: `Team members (${project.members.length}/${
        [...project.members, ...project.slots].length
      })`,
    },
    {
      id: "offers",
      title: `Offers (${project.offers.length})`,
    },
    {
      id: "tasks",
      title: "Tasks",
    },
  ].filter((tab) => {
    if (!isMember) return !["tasks", "offers"].includes(tab.id);
    if (!isOwner) return !["offers"].includes(tab.id);

    return true;
  });

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
                : "Request an investment"}
            </Button>

            {/* <BsQrCodeScan className="w-10 h-auto text-paper" /> */}

            <Avatar
              src={avatar}
              className="w-44 h-auto absolute left-8 -bottom-1/2"
            />
          </div>

          <div className="flex flex-col space-y-8 p-8 pt-32">
            <div className="flex justify-between items-center">
              <div className="flex flex-col space-y-2">
                <H2>Findum app</H2>
                <span>Almaty, KZ</span>
              </div>

              <div className="flex items-center space-x-4">
                {isVisitor ? (
                  <Button
                    onClick={() => {
                      setConfirmJoinRequestModal({
                        open: true,
                        roles: [
                          {
                            specialist: "Full-stack dev.",
                            requirements: "Something's required #1",
                            benefits: "You get something in return. #1",
                          },
                          {
                            specialist: "Manager",
                            requirements: "Something's required #2",
                            benefits: "You get something in return. #2",
                          },
                          {
                            specialist: "Designer",
                            requirements: "Something's required #3",
                            benefits: "You get something in return. #3",
                          },
                        ],
                      });
                    }}
                  >
                    Send offer
                  </Button>
                ) : isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        navigate(`/projects/@projectid/edit`);
                      }}
                      className="inline-flex items-center text-lg space-x-1"
                    >
                      <PiNotePencilDuotone className="fill-accent w-5 h-auto" />

                      <span className="text-accent underline underline-offset-4">
                        Edit
                      </span>
                    </button>

                    <Button
                      onClick={() => {
                        navigate(`/chat/@projectid`);
                      }}
                    >
                      Go to chat
                    </Button>
                  </>
                ) : (
                  <>
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button
                          onClick={() => {}}
                          className="inline-flex items-center text-lg space-x-1"
                        >
                          <LiaDoorOpenSolid className="fill-accent w-8 h-auto" />

                          <span className="text-accent underline underline-offset-4">
                            Leave project
                          </span>
                        </button>
                      </Popover.Trigger>

                      <Popover.Portal>
                        <Popover.Content>
                          <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md p-6 space-y-6">
                            <H6>Do you really want to leave this project?</H6>

                            <div className="flex space-x-4">
                              <Button className="w-[50%]">Cancel</Button>

                              <Button className="w-[50%]">Confirm</Button>
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>

                    <Button
                      onClick={() => {
                        navigate(`/chat/@projectid`);
                      }}
                    >
                      Go to chat
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <H5>Overview</H5>

              <div className="flex flex-col space-y-4">
                <p className="text-paper-contrast/60 text-sm">
                  XYZ Corporation is a leading global company that specializes
                  in providing innovative solutions in the field of technology
                  and digital services. With a rich history spanning over 20
                  years, the company has established itself as a trusted and
                  reliable partner for businesses across various industries.
                </p>

                <div className="flex flex-col">
                  <span className="text-paper-contrast/60 text-xs">
                    Start day: {dayjs(project.startDate).format("LL")}
                  </span>

                  <span className="text-paper-contrast/60 text-xs">
                    End day: {dayjs(project.endDate).format("LL")}
                  </span>
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

              <Tabs.Content value="team-members">
                <div className="flex space-x-6 overflow-x-auto py-6">
                  {project.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center min-w-[12rem] min-h-[12rem] relative bg-paper rounded-lg shadow-md space-y-4"
                    >
                      <Avatar src={member.avatar} className="w-14 h-auto" />

                      <div className="flex flex-col items-center text-center">
                        <span className="font-semibold">
                          {member.firstName} {member.lastName}
                        </span>

                        <span className="text-paper-contrast/50">
                          {member.role}
                        </span>
                      </div>

                      <Popover.Root>
                        <Popover.Trigger>
                          <BiDotsVerticalRounded className="w-5 h-auto fill-paper-contrast absolute right-4 top-4" />
                        </Popover.Trigger>

                        <Popover.Portal>
                          <Popover.Content side="top" align="start">
                            <div className="flex flex-col bg-paper rounded-xl shadow-md space-y-2 p-4">
                              <Button
                                onClick={() => {
                                  setIsLeaveFeedbackModalOpen(true);
                                }}
                              >
                                Leave feedback
                              </Button>

                              <Popover.Root>
                                <Popover.Trigger className="w-[100%]">
                                  <Button className="w-[100%]">Delete</Button>
                                </Popover.Trigger>

                                <Popover.Portal>
                                  <Popover.Content>
                                    <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md p-6 space-y-6">
                                      <H6>
                                        Do you really want to delete this
                                        member?
                                      </H6>

                                      <div className="flex space-x-4">
                                        <Button className="w-[50%]">
                                          Cancel
                                        </Button>

                                        <Button className="w-[50%]">
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
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="offers">
                <div className="flex space-x-6 overflow-x-auto py-6">
                  {project.offers.map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center min-w-[12rem] pt-8 pb-4 relative bg-paper rounded-lg shadow-md space-y-4"
                    >
                      <Avatar src={avatar} className="w-14 h-auto" />

                      <div className="flex flex-col items-center text-center">
                        <span className="font-semibold">Omar Aliev</span>
                        <span className="text-paper-contrast/50">Founder</span>
                      </div>

                      <div className="w-[100%] h-[1px] bg-paper-contrast/25" />

                      <div className="flex items-center space-x-4">
                        <button>
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border border-[#00AB45]">
                            <BsPlus className="fill-[#00AB45] w-6 h-6" />
                          </span>
                        </button>

                        <button>
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EB5A5A]">
                            <HiXMark className="fill-[#EB5A5A] w-5 h-5" />
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="tasks">
                {isMember && !isOwner ? (
                  <div>
                    <DragDropContext
                      onDragEnd={(result) => {
                        if (!result.destination) return;

                        const task = tasks.find(
                          (task) => task.title === result.draggableId,
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
                          (t) => t.title !== task.title,
                        );

                        thoseTasks.splice(result.destination.index, 0, {
                          ...task,
                          status: result.destination!
                            .droppableId as Task["status"],
                        });

                        setTasks(updated.concat(thoseTasks));

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
                                            {tasks
                                              .filter(
                                                (task) =>
                                                  task.status === category.id,
                                              )
                                              .map((task, idx) => (
                                                <Draggable
                                                  key={task.title}
                                                  draggableId={task.title}
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
                                                              task.priotity ===
                                                              0,

                                                            "border-4 border-[#F4DB5B]":
                                                              task.priotity ===
                                                              1,
                                                            "border-4 border-[#FFA8A8]":
                                                              task.priotity ===
                                                              2,
                                                          },
                                                        )}
                                                      >
                                                        <div className="flex space-x-2">
                                                          <AiOutlineFlag
                                                            className={cx(
                                                              "w-6 h-auto",
                                                              {
                                                                "text-[#A5DF9F]":
                                                                  task.priotity ===
                                                                  0,

                                                                "text-[#F4DB5B]":
                                                                  task.priotity ===
                                                                  1,
                                                                "text-[#FFA8A8]":
                                                                  task.priotity ===
                                                                  2,
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
                            <th className="w-[15%] text-center">Integration</th>
                            <th className="w-[15%] text-center">Deadline</th>
                            <th className="w-[15%] text-center">Assignees</th>
                            <th className="w-[15%] text-center">Accept</th>
                          </tr>
                        </thead>

                        <tbody className="before:content-['~'] before:block before:leading-[2rem] before:indent-[-999999px]">
                          {Array.from({length: 4}).map((_, idx) => (
                            <tr key={idx} className="text-left [&>td]:py-2">
                              <td className="font-semibold text-main">
                                Authorization page
                              </td>

                              <td className="text-center">
                                <div
                                  className={cx("inline-flex rounded-lg p-2", {
                                    "bg-[#A5DF9F]": true,
                                    "bg-[#F4DB5B]": false,
                                    "bg-[#F78888]": false,
                                  })}
                                >
                                  <AiOutlineFlag className="w-6 h-auto" />
                                </div>
                              </td>

                              <td className="text-center">
                                <span className="bg-accent text-sm text-accent-contrast rounded-md p-2">
                                  Done
                                </span>
                              </td>

                              <td className="text-center">
                                <div className="inline-flex items-center bg-accent rounded-md space-x-2 p-2">
                                  <span className="text-sm text-accent-contrast">
                                    Today
                                  </span>

                                  <button className="flex">
                                    <span className="w-[1em] h-[1em] rounded-full inline-flex items-center justify-center border border-accent-contrast">
                                      <HiXMark className="w-[1.5em] h-[1.5em] fill-accent-contrast" />
                                    </span>
                                  </button>
                                </div>
                              </td>

                              <td className="flex items-center justify-start">
                                <Avatar src={avatar} className="m-auto" />
                              </td>

                              <td className="text-center">
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
        onClose={() => {
          setIsCreateTaskModalOpen(false);
        }}
      />

      <LeaveFeedbackModal
        open={isLeaveFeedbackModalOpen}
        onClose={() => {
          setIsLeaveFeedbackModalOpen(false);
        }}
      />

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
      <div className="flex flex-col bg-paper shadow-md rounded-xl space-y-12 p-10">
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
            <Button onClick={onClose} className="w-[100%]">
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
  member: string;
}

const CreateTaskModal: React.FC<WrappedModalProps> = ({open, onClose}) => {
  const {register, handleSubmit} = useForm<CreateTaskForm>({
    defaultValues: {
      title: "",
      description: "",
      deadline: {
        date: null,
        time: "",
      },
      priority: "",
      member: "",
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col bg-paper shadow-md rounded-xl space-y-12 p-10">
        <H4>Create a task</H4>

        <form
          onSubmit={handleSubmit((form) => {
            console.log(form);
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
              <DatePicker label="Date" className="w-[65%]" />
              <TimePicker label="Time" className="w-[35%]" />
            </div>

            <div className="flex space-x-6 items-center">
              <Select.Root
                name="priority"
                placeholder={<AiOutlineFlag className="w-6 h-auto" />}
                className="w-[20%] h-auto"
              >
                <Select.Item value="high">
                  <span className="inline-flex space-x-2 items-center">
                    <span className="bg-[#F78888] rounded-xl p-2">
                      <AiOutlineFlag className="w-4 h-auto" />
                    </span>
                  </span>
                </Select.Item>

                <Select.Item value="medium">
                  <span className="inline-flex space-x-2 items-center">
                    <span className="bg-[#F4DB5B] rounded-xl p-2">
                      <AiOutlineFlag className="w-4 h-auto" />
                    </span>
                  </span>
                </Select.Item>

                <Select.Item value="low">
                  <span className="inline-flex space-x-2 items-center">
                    <span className="bg-[#A5DF9F] rounded-xl p-2">
                      <AiOutlineFlag className="w-4 h-auto" />
                    </span>
                  </span>
                </Select.Item>
              </Select.Root>

              <Select.Root
                name="member"
                placeholder="Member"
                className="w-[70%] h-auto"
              >
                <Select.Item value="Full-stack dev.">
                  Full-stack dev.
                </Select.Item>

                <Select.Item value="Project manager">
                  Project manager
                </Select.Item>

                <Select.Item value="Designer">Designer</Select.Item>
              </Select.Root>

              <div className="w-[20%]">
                <Avatar src={avatar} className="w-12 h-auto m-auto" />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => {
                onClose();
              }}
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
}

const LeaveFeedbackModal: React.FC<WrappedModalProps> = ({open, onClose}) => {
  const {register, handleSubmit} = useForm<LeaveFeedbackForm>({
    defaultValues: {
      role: "",
      review: "",
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[30rem] flex flex-col bg-paper relative shadow-md rounded-xl space-y-8 p-8">
        <div className="flex space-x-4 items-center">
          <Avatar src={avatar} className="w-20 h-auto" />
          <div className="flex flex-col flex-1 overflow-hidden pr-20">
            <span className="text-xl font-bold break-keep text-ellipsis whitespace-nowrap overflow-hidden">
              Omar Aliev
            </span>

            <span className="text-paper-contrast/75 break-keep text-ellipsis whitespace-nowrap overflow-hidden">
              Frontend developer
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((form) => {
            console.log(form);
          })}
          className="flex flex-col space-y-6"
        >
          <Radio.Root className="flex flex-col space-y-2 text-left">
            <Radio.Item value="frontend-developer">
              Frontend developer
            </Radio.Item>

            <Radio.Item value="angular-developer">Angular developer</Radio.Item>

            <Radio.Item value="project-manager">Project manager</Radio.Item>
          </Radio.Root>

          <Textarea {...register("review")} placeholder="Review" />

          <div className="flex space-x-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Send</Button>
          </div>
        </form>

        <div className="absolute right-8 top-0 flex items-center space-x-2 mt-0">
          <button>
            <AiOutlineLike className="w-7 h-auto" />
          </button>

          <button>
            <AiOutlineDislike className="w-7 h-auto" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface ConfirmJoinRequestModalProps extends WrappedModalProps {
  roles: {
    requirements: string;
    benefits: string;
    specialist: string;
  }[];
}

const ConfirmJoinRequestModal: React.FC<ConfirmJoinRequestModalProps> = ({
  roles,
  ...props
}) => {
  const [selectedRole, setSelectedRole] = useState<Nullable<string>>(null);

  const data = roles.find((role) => role.specialist === selectedRole);

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="w-[35rem] flex flex-col space-y-8 bg-paper shadow-md rounded-lg p-10">
        <div className="flex flex-col space-y-6">
          <H4>Confirm your project request</H4>

          <div>
            <Select.Root
              value={selectedRole || undefined}
              onValueChange={(value) => setSelectedRole(value)}
              className="h-auto"
            >
              {roles.map((role) => (
                <Select.Item key={role.specialist} value={role.specialist}>
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
              >
                Cancel
              </Button>

              <Button type="submit" className="w-[50%]">
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
