import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {
  Avatar,
  Button,
  Checkbox,
  Modal,
  ModalWindowPropsWithClose,
  Icon,
  H5,
} from "@shared/ui";
import {dayjs} from "@shared/lib/dayjs";
import {
  Project,
  ProjectCard as TProjectCard,
  ProjectMember,
} from "@shared/lib/types";

import {useSendProjectRequest} from "../queries";
import {navigate} from "wouter/use-location";

interface ProjectCardProps {
  card: TProjectCard;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({card}) => {
  const occupiedMembers = card.members.filter((m) => m.user);
  const availableMembers = card.members.filter((m) => !m.user);

  const membersInTotal = occupiedMembers.length + availableMembers.length;

  const anyMembers = membersInTotal > 0;

  return (
    <div
      role="presentation"
      onClick={() => {
        navigate(`/projects/${card.project.id}`);
      }}
    >
      <div className="w-[100%] flex flex-col bg-[#F8F9FA] rounded-3xl shadow-sm cursor-pointer">
        <div className="flex justify-between p-5">
          <div className="flex items-center space-x-6">
            <Avatar
              src={card.project.avatar}
              alt="Startup project avatar"
              className="w-16 h-auto"
            />

            <div className="flex flex-col space-y-0.5">
              <div className="max-w-[14rem] whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-main text-xl font-medium">
                  {card.project.name}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-[#817C7C]">
                  <Icon.Person className="w-[0.85em] h-auto text-current" />

                  <span className="text-base">
                    {occupiedMembers.length}/{membersInTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[100%] flex flex-col justify-between items-end">
            <Modal.Root>
              <Modal.Trigger>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Icon.Info className="w-6 h-auto text-main hover:text-accent transition" />
                </button>
              </Modal.Trigger>

              <ProjectOverviewModal project={card.project} />
            </Modal.Root>
          </div>
        </div>

        {anyMembers && <div className="w-[100%] h-[1px] bg-accent-300" />}

        {anyMembers && (
          <div className="flex items-center py-5">
            {occupiedMembers.map((member) => (
              <div key={member.id} className="w-1/4">
                <div className="max-w-[8rem] flex flex-col text-center items-center space-y-2 m-auto">
                  <Avatar src={member.user.avatar} className="w-16 h-auto" />

                  <div className="max-w-[90%] text-ellipsis whitespace-nowrap overflow-hidden">
                    <span className="text-xs">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}

            {availableMembers.map((member) => (
              <div key={member.id} className="w-1/4">
                <div
                  role="presentation"
                  className="max-w-[8rem] flex flex-col items-center text-center space-y-2 m-auto"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Modal.RootFn>
                    {({close}) => (
                      <>
                        <Modal.Trigger>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            className="w-16 h-16 inline-flex items-center justify-center bg-accent-300 rounded-full"
                          >
                            <Icon.Plus className="w-6 h-auto text-accent-contrast" />
                          </button>
                        </Modal.Trigger>

                        <ConfirmProjectRequestModal
                          member={{
                            id: member.id,
                            benefits: member.benefits,
                            requirements: member.requirements,
                            role: member.role,
                            user: member.user,
                            project: member.project,
                            cardId: card.id,
                            isOccupied: false,
                            createdAt: member.createdAt,
                          }}
                          close={close}
                        />
                      </>
                    )}
                  </Modal.RootFn>

                  <div className="max-w-[90%] text-ellipsis whitespace-nowrap overflow-hidden">
                    <span className="text-xs">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProjectOverviewModalProps {
  project: Project;
}

const ProjectOverviewModal: React.FC<ProjectOverviewModalProps> = ({
  project,
}) => {
  const {t} = useTranslation();

  return (
    <Modal.Window>
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <H5 className="w-[70%] text-xl font-semibold break-words">
            {project.name}
          </H5>

          <div className="w-[30%] flex flex-col space-y-1 text-xs text-right">
            <span className="text-[#112042]">
              {dayjs(project.startDate).format("LL")}
            </span>

            {project.endDate && (
              <span className="text-[#112042]">
                {dayjs(project.endDate).format("LL")}
              </span>
            )}
          </div>
        </div>

        <div className="w-[85%]">
          <p className="text-[#817C7C] text-sm font-montserrat font-medium break-all">
            {project.description}
          </p>
        </div>

        <div className="flex items-center space-x-5">
          <Avatar src={project.founder.avatar} className="w-16 h-auto" />

          <div className="flex flex-col space-y-0.5">
            <span className="text-xl text-[#112042]">
              {project.founder.firstName} {project.founder.lastName}
            </span>

            <span className="text-sm text-[#817C7C]">
              {t("common.founder")}
            </span>
          </div>
        </div>
      </div>
    </Modal.Window>
  );
};

interface ProjectRequestForm {
  isConfirmed: boolean;
}

interface ConfirmProjectRequestModalProps extends ModalWindowPropsWithClose {
  member: ProjectMember;
}

const ConfirmProjectRequestModal: React.FC<ConfirmProjectRequestModalProps> = ({
  member,
  close,
}) => {
  const {t} = useTranslation();

  const {register, handleSubmit, formState} = useForm<ProjectRequestForm>({
    defaultValues: {
      isConfirmed: false,
    },
    resolver: zodResolver(
      z.object({
        isConfirmed: z.literal(true),
      }),
    ),
  });

  const {sendProjectRequest} = useSendProjectRequest();

  return (
    <Modal.Window title="Confirm your project request">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <span className="text-accent text-sm">
              {t("common.requirements")}
            </span>

            <p className="text-[#817C7C] text-xs break-words ml-8">
              {member.requirements}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-accent text-sm">{t("common.benefits")}</span>

            <p className="text-[#817C7C] text-xs break-words ml-8">
              {member.benefits}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(() => {
            sendProjectRequest({
              cardId: member.cardId,
              memberId: member.id,
              projectId: member.project.id,
            }).then(() => {
              close();

              toast.success(t("common.toasts.sent-project-request"));
            });
          })}
          className="flex flex-col space-y-6"
        >
          <Checkbox
            label={member.role}
            {...register("isConfirmed", {required: true})}
          />

          <div className="flex space-x-6 items-center">
            <Modal.Close>
              <Button color="secondary" type="button" className="w-[50%]">
                {t("common.cancel")}
              </Button>
            </Modal.Close>

            <Button
              type="submit"
              disabled={!formState.isValid}
              className="w-[50%]"
            >
              {t("common.confirm")}
            </Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};
