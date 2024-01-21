import {BsPerson, BsPlus} from "react-icons/bs";
import {IoInformationOutline} from "react-icons/io5";
import {useState} from "react";
import {useLocation} from "wouter";

import {Avatar, Button, Checkbox, H4} from "@shared/ui";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {dayjs} from "@shared/lib/dayjs";
import {Nullable} from "@shared/lib/types";
import {api} from "@shared/api";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";
import {authModel} from "@features/auth";
import {useTranslation} from "react-i18next";
import {BiBell} from "react-icons/bi";

interface ProjectCardProps {
  id: string;
  avatar: string;
  name: string;
  description: string;
  projectId: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  startDate: Date;
  endDate?: Date;
  members: {
    id: string;
    userId: string;
    avatar: string;
    specialist: string;
  }[];
  slots: {
    id: string;
    specialist: string;
    requirements: string;
    benefits: string;
  }[];
}

interface ConfirmJoinRequestModalData {
  open: boolean;
  benefits: Nullable<string>;
  requirements: Nullable<string>;
  specialist: Nullable<string>;
  memberId: Nullable<string>;
  cardId: Nullable<string>;
  projectId: Nullable<string>;
}

export const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const [open, setOpen] = useState(false);

  const credentials = useSelector(authModel.selectors.credentials);

  const [confirmJoinRequestModal, setConfirmJoinRequestModal] =
    useState<ConfirmJoinRequestModalData>({
      open: false,
      benefits: null,
      requirements: null,
      specialist: null,
      memberId: null,
      cardId: null,
      projectId: null,
    });

  const [, navigate] = useLocation();

  return (
    <>
      <ProjectDescriptionModal
        name={props.name}
        description={props.description}
        owner={props.owner}
        startDate={props.startDate}
        endDate={props.endDate}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />

      <ConfirmJoinRequestModal
        memberId={confirmJoinRequestModal.memberId!}
        benefits={confirmJoinRequestModal.benefits!}
        specialist={confirmJoinRequestModal.specialist!}
        requirements={confirmJoinRequestModal.requirements!}
        cardId={confirmJoinRequestModal.cardId!}
        projectId={confirmJoinRequestModal.projectId!}
        open={confirmJoinRequestModal.open}
        onClose={() => {
          setConfirmJoinRequestModal({
            open: false,
            memberId: null,
            cardId: null,
            projectId: null,
            benefits: null,
            requirements: null,
            specialist: null,
          });
        }}
      />

      <div
        role="presentation"
        onClick={() => {
          navigate(`/projects/${props.projectId}`);
        }}
        className="w-[100%] flex flex-col bg-paper rounded-3xl shadow-sm cursor-pointer"
      >
        <div className="flex justify-between p-8">
          <div className="flex items-center space-x-8">
            <Avatar
              src={props.avatar}
              alt="Startup project avatar"
              className="w-24 h-auto"
            />

            <div className="flex flex-col space-y-1">
              <span className="text-main text-2xl font-medium">
                {props.name}
              </span>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-paper-contrast/60">
                  <BsPerson className="w-4 h-auto" />

                  <span>
                    {props.members.length}/
                    {props.slots.length + props.members.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end h-[100%]">
            <button
              onClick={(event) => {
                event.stopPropagation();

                setOpen(true);
              }}
            >
              <IoInformationOutline className="w-6 h-auto text-main hover:text-accent transition" />
            </button>
          </div>
        </div>

        {props.members.length + props.slots.length > 0 && (
          <>
            <div className="w-[100%] h-[1px] bg-accent-300" />

            <div className="flex items-center px-8 py-8 space-x-1">
              {props.members.map((member, idx) => (
                <div
                  key={idx}
                  role="presentation"
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/profiles/${member.userId}`);
                  }}
                  className="w-[8rem] flex flex-col text-center items-center space-y-2 overflow-hidden"
                >
                  <Avatar src={member.avatar} className="w-16 h-auto" />

                  <span className="text-xs w-[100%] text-ellipsis whitespace-nowrap overflow-hidden">
                    {member.specialist}
                  </span>
                </div>
              ))}

              {props.slots.map((slot, idx) => (
                <div
                  key={idx}
                  role="presentation"
                  onClick={(event) => {
                    event.stopPropagation();

                    if (credentials.data?.id !== props.owner.id)
                      setConfirmJoinRequestModal({
                        open: true,
                        memberId: slot.id,
                        benefits: slot.benefits,
                        requirements: slot.requirements,
                        specialist: slot.specialist,
                        cardId: props.id,
                        projectId: props.projectId,
                      });
                  }}
                  className="w-[8rem] flex flex-col items-center text-center space-y-2"
                >
                  <button className="w-16 h-16 inline-flex items-center justify-center bg-accent-300 rounded-full">
                    <BsPlus className="w-8 h-auto text-accent-contrast" />
                  </button>

                  <span className="text-xs">{slot.specialist}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

interface ProjectDescriptionModalProps extends WrappedModalProps {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  owner: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
}

const ProjectDescriptionModal: React.FC<ProjectDescriptionModalProps> = (
  props,
) => {
  const {t} = useTranslation();

  return (
    <Modal onClose={props.onClose} open={props.open}>
      <div className="w-[30rem] flex flex-col space-y-12 bg-paper rounded-3xl shadow-even-md p-10">
        <div className="flex justify-between items-center">
          <H4 className="w-[70%] text-xl">{props.name}</H4>

          <div className="w-[30%] flex flex-col space-y-1 text-xs text-right">
            <span className="text-main">
              {dayjs(props.startDate).format("LL")}
            </span>

            {props.endDate && (
              <span className="text-main">
                {dayjs(props.endDate).format("LL")}
              </span>
            )}
          </div>
        </div>

        <div className="w-[85%]">
          <p
            className="text-paper-contrast/60 text-sm font-medium break-all"
            style={{fontFamily: "Montserrat"}}
          >
            {props.description}
          </p>
        </div>

        <div className="flex items-center space-x-5">
          <Avatar src={props.owner.avatar} />

          <div className="flex flex-col">
            <span className="font-semibold text-xl text-[#112042]">
              {props.owner.firstName} {props.owner.lastName}
            </span>

            <span className="text-xs text-[#817C7C]">
              {t("common.founder")}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface ConfirmJoinRequestModalProps extends WrappedModalProps {
  requirements: string;
  benefits: string;
  specialist: string;
  memberId: string;
  cardId: string;
  projectId: string;
}

const ConfirmJoinRequestModal: React.FC<ConfirmJoinRequestModalProps> = ({
  requirements,
  benefits,
  specialist,
  memberId,
  cardId,
  projectId,
  ...props
}) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="w-[35rem] flex flex-col space-y-10 bg-paper rounded-3xl shadow-even-md p-10">
        <H4>Confirm your project request</H4>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4">
              <span className="text-accent font-semibold">Requirements</span>

              <p className="text-paper-contrast/60 text-sm ml-8">
                {requirements}
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <span className="text-accent font-semibold">Benefits</span>

              <p className="text-paper-contrast/60 text-sm ml-8">{benefits}</p>
            </div>
          </div>

          <div className="flex flex-col">
            <Checkbox label={specialist} />
          </div>

          <div className="flex space-x-6 items-center">
            <Button
              color="secondary"
              onClick={() => {
                props.onClose();
              }}
              type="button"
              className="w-[50%]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-[50%]"
              onClick={() => {
                api.projects
                  .sendProjectRequest({
                    cardId,
                    memberId,
                    projectId,
                  })
                  .then(() => {
                    toast.success("Successfully sent project request :)");

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
      </div>
    </Modal>
  );
};

interface MyProjectCardProps {
  avatar: string;
  name: string;
  id: string;
  isFounder: boolean;
  requests?: number;
  tasks?: number;
  members: {
    avatar: string;
  }[];
}

export const MyProjectCard: React.FC<MyProjectCardProps> = (props) => {
  const [, navigate] = useLocation();

  const {t} = useTranslation();

  return (
    <div
      role="presentation"
      onClick={() => {
        navigate(`/projects/${props.id}`);
      }}
      className="w-[15rem] max-w-[13rem] min-w-[13rem] justify-center items-center flex flex-col bg-paper shadow-even-sm rounded-2xl space-y-4 cursor-pointer py-6"
    >
      <Avatar src={props.avatar} className="w-16 h-auto border" />

      <div className="flex flex-col items-center space-y-1 text-center w-[100%]">
        <div className="w-[80%] overflow-hidden">
          <span className="text-lg font-semibold whitespace-nowrap">
            {props.name}
          </span>
        </div>

        {props.isFounder && props.requests! > -1 && (
          <div className="flex items-center text-paper-contrast/40 space-x-2">
            <BiBell className="w-4 h-auto" />
            <span className="text-xs">{props.requests} new request(s)</span>
          </div>
        )}

        {!props.isFounder && props.tasks! > 0 && (
          <div className="flex items-center text-paper-contrast/40 space-x-2">
            <BiBell className="w-4 h-auto" />
            <span className="text-xs">{props.tasks} undone task(s)</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center -space-x-3">
          {props.members.map((member, idx) => (
            <Avatar key={idx} src={member.avatar} className="w-7 h-auto" />
          ))}
        </div>

        <Button
          onClick={(event) => {
            event.stopPropagation();

            navigate(`/chat/project/${props.id}`);
          }}
          className="w-32 text-sm"
        >
          {t("common.go-to-chat")}
        </Button>
      </div>
    </div>
  );
};
