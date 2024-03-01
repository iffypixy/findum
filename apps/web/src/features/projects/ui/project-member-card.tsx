import * as Popover from "@radix-ui/react-popover";
import {PropsWithChildren} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {AiOutlineDislike, AiOutlineLike} from "react-icons/ai";
import {cx} from "class-variance-authority";
import {navigate} from "wouter/use-location";

import {Project, ProjectMember, SpecificProject} from "@shared/lib/types";
import {
  Avatar,
  Button,
  H6,
  Icon,
  Modal,
  ModalWindowPropsWithClose,
  Textarea,
} from "@shared/ui";
import {queryClient} from "@shared/lib/query";
import {dayjs} from "@shared/lib/dayjs";

import {useLeaveFeedback, useRemoveMember} from "../queries";

interface ProjectMemberProps extends PropsWithChildren {
  member: ProjectMember;
  project: SpecificProject;
  showOptions?: boolean;
}

export const ProjectMemberCard: React.FC<ProjectMemberProps> = ({
  member,
  project,
  showOptions = false,
}) => {
  const {t} = useTranslation();

  const {removeMember} = useRemoveMember();

  const deadline = new Date(member.createdAt).setDate(
    new Date(member.createdAt).getDate() + 7,
  );

  return (
    <div
      role="presentation"
      onClick={(event) => {
        if (
          event.target === event.currentTarget ||
          event.target instanceof HTMLImageElement
        )
          navigate(`/users/${member.user.id}`);
      }}
      className="min-w-[13rem] h-[14rem] flex flex-col items-center justify-center bg-[#F8F9FA] rounded-lg cursor-pointer shadow-sm space-y-4 relative"
    >
      <div className="w-24 h-24">
        {member.isOccupied ? (
          <Avatar src={member.user.avatar} className="w-full h-auto" />
        ) : (
          <div className="w-full h-full bg-[#CBCFFF] rounded-full flex justify-center items-center">
            <Icon.Inquire className="w-8 h-auto text-[#FFFFFF]" />
          </div>
        )}
      </div>

      <div className="w-[75%] flex flex-col items-center text-center whitespace-nowrap overflow-hidden text-ellipsis">
        <span
          className={cx("font-semibold", {
            italic: !member.isOccupied,
          })}
        >
          {member.isOccupied
            ? `${member.user.firstName} ${member.user.lastName}`
            : t("common.not-found")}
        </span>

        <span className="text-paper-contrast/50">{member.role}</span>
      </div>

      {showOptions && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              // onClick={(event) => {
              //   event.stopPropagation();
              // }}
              className="absolute right-4 top-4"
            >
              <Icon.Options className="w-1 h-auto fill-paper-contrast" />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content side="top" align="start">
              <div className="flex flex-col bg-paper rounded-xl shadow-md space-y-2 p-4">
                <Modal.RootFn>
                  {({close}) => (
                    <>
                      <Modal.Trigger>
                        <Button
                        // onClick={(event) => {
                        //   event.stopPropagation();
                        // }}
                        >
                          Leave feedback
                        </Button>
                      </Modal.Trigger>

                      <LeaveFeedbackModal
                        close={close}
                        member={member}
                        project={project}
                      />
                    </>
                  )}
                </Modal.RootFn>

                <Popover.Root>
                  <Popover.Trigger>
                    <Button
                      // onClick={(event) => {
                      //   event.stopPropagation();
                      // }}
                      className="w-[100%]"
                    >
                      Delete
                    </Button>
                  </Popover.Trigger>

                  <Popover.Portal>
                    <Popover.Content side="top" align="start" sideOffset={8}>
                      <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md p-6 space-y-6">
                        <H6>Do you really want to delete this member?</H6>

                        <div className="flex space-x-4">
                          <Popover.PopoverClose asChild>
                            <Button color="secondary" className="w-[50%]">
                              Cancel
                            </Button>
                          </Popover.PopoverClose>

                          <Button
                            onClick={() => {
                              removeMember({
                                memberId: member.id,
                                projectId: project.id,
                              }).then(() => {
                                toast.success(
                                  "You successfully removed this project! :)",
                                );

                                queryClient.setQueryData(
                                  ["projects", "detail", project.id],
                                  {
                                    project: {
                                      ...project,
                                      members: project.members.filter(
                                        (m) => m.id !== member.id,
                                      ),
                                    },
                                  },
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

      {!member.isOccupied && (
        <div className="absolute left-3 top-0 bg-[#A5DF9F] px-2 py-1 rounded-lg text-xs">
          {dayjs(deadline).diff(new Date(), "day")} day(s) left
        </div>
      )}
    </div>
  );
};

interface LeaveFeedbackModalProps extends ModalWindowPropsWithClose {
  member: ProjectMember;
  project: Project;
}

const LeaveFeedbackModal: React.FC<LeaveFeedbackModalProps> = ({
  close,
  member,
  project,
}) => {
  const {t} = useTranslation();

  const {register, handleSubmit, setValue, watch, formState} = useForm<{
    role: string;
    review: string;
    like: boolean;
  }>({
    defaultValues: {
      role: "",
      review: "",
      like: true,
    },
  });

  const {leaveFeedback} = useLeaveFeedback();

  const like = watch("like");

  return (
    <Modal.Window close={close}>
      <div className="flex flex-col space-y-6">
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
            leaveFeedback({
              memberId: member.id,
              projectId: project.id,
              description: form.review,
              like: form.like,
            })
              .then(() => {
                toast.success(
                  "You successfully left a feedback for this member! :)",
                );
              })
              .finally(() => {
                close();
              });
          })}
          className="flex flex-col space-y-6"
        >
          <Textarea {...register("review")} placeholder="Review" />

          <div className="flex space-x-4">
            <Modal.Close>
              <Button
                // onClick={(event) => {
                //   event.stopPropagation();
                // }}
                color="secondary"
              >
                {t("common.cancel")}
              </Button>
            </Modal.Close>

            <Button
              // onClick={(event) => {
              //   event.stopPropagation();
              // }}
              disabled={!formState.isValid}
              type="submit"
            >
              {t("common.send")}
            </Button>
          </div>
        </form>

        <div className="absolute right-10 top-10 flex items-center space-x-2 mt-0">
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
    </Modal.Window>
  );
};
