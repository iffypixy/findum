import {useTranslation} from "react-i18next";

import {Icon, Link} from "@shared/ui";
import {useLogout} from "@features/auth";
import {queryClient} from "@shared/lib/query";

export const Navbar: React.FC = () => {
  const {t} = useTranslation();

  const {logout} = useLogout();

  return (
    <div className="w-full flex flex-col text-[#112042] text-lg space-y-6">
      <Link href="/">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon.House className="w-[1em] h-[1em] text-current" />

            <span className="fill-current">{t("common.home")}</span>
          </div>

          <Icon.Chevron.Right className="fill-current" />
        </div>
      </Link>

      <Link href="/chats">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon.Message className="w-[1em] h-[1em] text-current" />

            <span className="fill-current">{t("common.messages")}</span>
          </div>

          <Icon.Chevron.Right className="fill-current" />
        </div>
      </Link>

      <Link href="/friends">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon.Person className="w-[1em] h-[1em] text-current" />

            <span className="fill-current">{t("common.friends")}</span>
          </div>

          <Icon.Chevron.Right className="fill-current" />
        </div>
      </Link>

      <Link href="/projects">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon.Project className="w-[1em] h-[1em] text-current" />

            <span className="fill-current">{t("common.projects")}</span>
          </div>

          <Icon.Chevron.Right className="fill-current" />
        </div>
      </Link>

      <Link href="/settings">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon.Settings className="w-[1em] h-[1em] text-current" />

            <span className="fill-current">{t("common.settings")}</span>
          </div>

          <Icon.Chevron.Right className="fill-current" />
        </div>
      </Link>

      <button
        onClick={() => {
          logout().then(() => {
            queryClient.setQueryData(["auth", "credentials"], {
              credentials: null,
            });
          });
        }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Icon.Door className="w-[1em] h-[1em] text-current" />

          <span className="fill-current">{t("common.logout")}</span>
        </div>

        <Icon.Chevron.Right className="fill-current" />
      </button>
    </div>
  );
};
