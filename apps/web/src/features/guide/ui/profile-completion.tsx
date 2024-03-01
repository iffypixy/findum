import {useTranslation} from "react-i18next";

import {useProfileProgressQuery} from "@features/profile";
import {ProfileProgressType} from "@shared/api/profile";
import {Button, H4, H5, Link} from "@shared/ui";

export const ProfileCompletion: React.FC = () => {
  const {t} = useTranslation();

  const [{progress}] = useProfileProgressQuery();

  const map: Record<
    ProfileProgressType,
    {
      text: string;
      button: {
        link: string;
        text: string;
      };
    }
  > = {
    cv: {
      text: t("common.profile-completion.upload-resume.title"),
      button: {
        link: "/settings",
        text: t("common.profile-completion.upload-resume.text"),
      },
    },
    avatar: {
      text: t("common.profile-completion.upload-avatar.title"),
      button: {
        link: "/settings",
        text: t("common.profile-completion.upload-avatar.text"),
      },
    },
    projects: {
      text: t("common.profile-completion.join-projects.title"),
      button: {
        link: "/projects",
        text: t("common.profile-completion.join-projects.text"),
      },
    },
  };

  const level = 3 - (progress?.length || 0);

  const context = progress && map[progress[0]];

  const isCompleted = progress?.length === 0;

  if (isCompleted) return null;

  return (
    <div className="w-full bg-paper-brand rounded-xl p-8 space-y-6 shadow-md">
      <div className="flex flex-col space-y-1">
        <H4 className="text-[#112042]">
          {t("common.profile-completion.title")}
        </H4>

        <span className="text-[#817C7C]">{context?.text}</span>
      </div>

      <div className="w-full flex items-center space-x-6">
        <div className="h-[10px] flex flex-1 bg-[#D2D1D1] rounded-md relative">
          <span
            className="absolute w-1/3 h-full bg-[#8193F3] rounded-md"
            style={{
              width: `${level * 33.3}%`,
            }}
          />
        </div>

        <span className="text-lg text-[#112042]">{level}/3</span>
      </div>

      <div className="flex items-center">
        <div className="w-[70%]">
          <H5 className="text-[#112042]">{context?.button.text}</H5>
        </div>

        <div className="w-[30%] flex justify-end">
          {context && (
            <Link href={context?.button.link}>
              <Button>{context?.button.text}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
