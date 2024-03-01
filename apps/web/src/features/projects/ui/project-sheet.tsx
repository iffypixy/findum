import {useTranslation} from "react-i18next";

import {useCredentials} from "@features/auth";
import {Avatar, Button, Icon} from "@shared/ui";
import {FounderProject, MemberProject, ProjectSheet} from "@shared/lib/types";
import {navigate} from "wouter/use-location";

interface MyProjectCardProps {
  project: ProjectSheet;
}

export const MyProjectSheet: React.FC<MyProjectCardProps> = ({project}) => {
  const {t} = useTranslation();

  const [{credentials}] = useCredentials();

  const isFounder = credentials?.id === project.founder.id;

  const anyMembers = project.members && project.members.length !== 0;

  return (
    <div
      role="presentation"
      onClick={() => {
        navigate(`/projects/${project.id}`);
      }}
      className="w-[15rem] max-w-[13rem] min-w-[13rem] justify-center items-center flex flex-col bg-paper shadow-even-sm rounded-2xl space-y-4 cursor-pointer py-6"
    >
      <Avatar src={project.avatar} className="w-16 h-auto border" />

      <div className="w-full flex flex-col items-center space-y-1 text-center">
        <div className="w-[80%] overflow-hidden">
          <span className="text-lg font-semibold whitespace-nowrap text-[#2D2D2E]">
            {project.name}
          </span>
        </div>

        {isFounder && (
          <MyFounderProjectSheet project={project as FounderProject} />
        )}

        {!isFounder && (
          <MyMemberProjectSheet project={project as MemberProject} />
        )}
      </div>

      <div className="flex items-center">
        {anyMembers && (
          <div className="flex items-center -space-x-3 mr-4">
            {project.members.map((avatar, idx) => (
              <Avatar
                key={idx}
                src={avatar}
                alt="Project member's avatar"
                className="w-7 h-auto"
              />
            ))}
          </div>
        )}

        <Button
          onClick={(event) => {
            event.stopPropagation();

            navigate(`/chats/project/${project.id}`);
          }}
          className="w-32 text-sm px-0"
        >
          {t("common.go-to-chat")}
        </Button>
      </div>
    </div>
  );
};

interface MyFounderProjectSheetProps {
  project: FounderProject;
}

const MyFounderProjectSheet: React.FC<MyFounderProjectSheetProps> = ({
  project,
}) =>
  project.newRequests > 0 && (
    <div className="flex items-center text-[#817C7C] space-x-2">
      <Icon.Bell className="w-4 h-auto" />
      <span className="text-xs">{project.newRequests} new request(s)</span>
    </div>
  );

interface MyMemberProjectSheetProps {
  project: MemberProject;
}

const MyMemberProjectSheet: React.FC<MyMemberProjectSheetProps> = ({project}) =>
  project.newTasks > 0 && (
    <div className="flex items-center text-[#817C7C] space-x-2">
      <Icon.Bell className="w-4 h-auto" />
      <span className="text-xs">{project.newTasks} new task(s)</span>
    </div>
  );
