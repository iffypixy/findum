import {BsPerson, BsPlus} from "react-icons/bs";
import {BiBell} from "react-icons/bi";
import {IoInformationOutline} from "react-icons/io5";
import {useState} from "react";
import {useLocation} from "wouter";

import {Avatar, Button, Checkbox, H4} from "@shared/ui";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {dayjs} from "@shared/lib/dayjs";
import {Nullable} from "@shared/lib/types";

interface ProjectCardProps {
  id: string;
  avatar: string;
  name: string;
  description: string;
  owner: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  startDate: Date;
  endDate?: Date;
  members: {
    avatar: string;
    specialist: string;
  }[];
  slots: {
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
}

export const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const [open, setOpen] = useState(false);

  const [confirmJoinRequestModal, setConfirmJoinRequestModal] =
    useState<ConfirmJoinRequestModalData>({
      open: false,
      benefits: null,
      requirements: null,
      specialist: null,
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
        benefits={confirmJoinRequestModal.benefits!}
        specialist={confirmJoinRequestModal.specialist!}
        requirements={confirmJoinRequestModal.requirements!}
        open={confirmJoinRequestModal.open}
        onClose={() => {
          setConfirmJoinRequestModal({
            open: false,
            benefits: null,
            requirements: null,
            specialist: null,
          });
        }}
      />

      <div
        role="presentation"
        onClick={() => {
          navigate(`/projects/${props.id}`);
        }}
        className="w-[100%] flex flex-col bg-paper rounded-3xl shadow-sm cursor-pointer"
      >
        <div className="flex justify-between px-8 py-8">
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

                  <span>{props.members.length}/4</span>
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

        <div className="w-[100%] h-[1px] bg-accent-300" />

        <div className="flex items-center px-8 py-8 space-x-1">
          {props.members.map((member, idx) => (
            <div
              key={idx}
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

                setConfirmJoinRequestModal({
                  open: true,
                  benefits: slot.benefits,
                  requirements: slot.requirements,
                  specialist: slot.specialist,
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
  return (
    <Modal onClose={props.onClose} open={props.open}>
      <div className="w-[30rem] flex flex-col space-y-12 bg-paper rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <H4>{props.name}</H4>

          <div className="flex flex-col space-y-1 text-xs text-right">
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

        <p className="text-paper-contrast/60">{props.description}</p>

        <div className="flex items-center space-x-4">
          <Avatar src={props.owner.avatar} />

          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {props.owner.firstName} {props.owner.lastName}
            </span>

            <span className="text-sm text-paper-contrast/60">Founder</span>
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
}

const ConfirmJoinRequestModal: React.FC<ConfirmJoinRequestModalProps> = ({
  requirements,
  benefits,
  specialist,
  ...props
}) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="w-[35rem] flex flex-col space-y-10 bg-paper shadow-md rounded-lg p-10">
        <H4>Confirm your project request</H4>

        <form className="space-y-6">
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
      </div>
    </Modal>
  );
};

interface MyProjectCardProps {
  avatar: string;
  name: string;
  members: {
    avatar: string;
  }[];
}

export const MyProjectCard: React.FC<MyProjectCardProps> = (props) => {
  const [, navigate] = useLocation();

  return (
    <div
      role="presentation"
      onClick={() => {
        navigate(`/projects/@projectid`);
      }}
      className="flex flex-col items-center bg-paper shadow-md rounded-lg space-y-6 cursor-pointer p-8"
    >
      <Avatar src={props.avatar} className="w-16 h-auto" />

      <div className="flex flex-col items-center space-y-1 text-center">
        <span className="text-lg font-bold">{props.name}</span>

        <div className="flex items-center text-paper-contrast/40 space-x-2">
          <BiBell className="w-4 h-auto" />

          <span className="text-sm">2 new offers</span>
        </div>
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

            navigate("/chat/@projectid");
          }}
          className="w-32 text-sm"
        >
          Go to chat
        </Button>
      </div>
    </div>
  );
};
