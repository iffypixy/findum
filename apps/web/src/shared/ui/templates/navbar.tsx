import {useState} from "react";
import {AiOutlineMail} from "react-icons/ai";
import {BsPerson} from "react-icons/bs";
import {FiSettings} from "react-icons/fi";
import {BsQuestionOctagon} from "react-icons/bs";
import {AiOutlineRight} from "react-icons/ai";
import {Link, useLocation} from "wouter";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";
import {createPortal} from "react-dom";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import {Avatar, Icon} from "@shared/ui";
import logo from "@shared/assets/logo.png";
import {authModel} from "@features/auth";
import {api} from "@shared/api";
import toast from "react-hot-toast";
import {useDispatch} from "@shared/lib/store";

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const [open, setOpen] = useState(false);

  const credentials = useSelector(authModel.selectors.credentials);

  const [location] = useLocation();

  return (
    <>
      {!open &&
        createPortal(
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="fixed left-7 top-7"
          >
            <span className="flex flex-col relative w-[20px] h-[14px] cursor-pointer">
              <span className="absolute left-0 top-0 w-[100%] h-[3px] bg-main rounded-lg" />
              <span className="absolute left-0 top-[50%] translate-y-[-50%] w-[45%] h-[3px] bg-main rounded-lg" />
              <span className="absolute left-0 bottom-0 w-[75%] h-[3px] bg-main rounded-lg" />
            </span>
          </button>,
          document.body,
        )}

      <div
        className={twMerge(
          cx(
            "w-[19vw] h-[100%] bg-main space-y-20 p-[10%] transition-width ease-in-out sm:w-[100vw]",
            {
              hidden: !open,
            },
          ),
        )}
      >
        <div className="flex justify-between items-center">
          <Link href="/">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a>
              <img src={logo} alt="Platform logo" className="w-10 h-auto" />
            </a>
          </Link>

          <button
            onClick={() => {
              setOpen(false);
            }}
            className={cx({
              hidden: !open,
            })}
          >
            <span className="flex flex-col relative w-[20px] h-[14px] cursor-pointer">
              <span className="absolute right-0 top-0 w-[100%] h-[3px] bg-main-contrast rounded-lg" />
              <span className="absolute right-0 top-[50%] translate-y-[-50%] w-[45%] h-[3px] bg-main-contrast rounded-lg" />
              <span className="absolute right-0 bottom-0 w-[75%] h-[3px] bg-main-contrast rounded-lg" />
            </span>
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          <Link href={`/profiles/${credentials.data?.id}`}>
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a>
              <Avatar
                src={credentials.data?.avatar || ""}
                alt="Profile picture"
                className="w-28 h-28"
              />
            </a>
          </Link>

          <div className="flex flex-col space-y-1 text-main-contrast">
            <span className="text-lg font-bold">
              {credentials.data?.firstName} {credentials.data?.lastName}
            </span>
            <span className="text-sm">{credentials.data?.email}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2 -m-2">
          <Link href="/chat">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
              className={cx(
                "flex items-center justify-between cursor-pointer text-main-contrast rounded-md p-2",
                {
                  "bg-main-400": location.startsWith("/chat"),
                },
              )}
            >
              <span className="flex items-center space-x-4">
                <AiOutlineMail className="w-5 h-auto" />

                <span>{t("common.messages")}</span>
              </span>

              <AiOutlineRight className="cursor-pointer" />
            </a>
          </Link>

          <Link href="/friends">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
              className={cx(
                "flex items-center justify-between cursor-pointer text-main-contrast rounded-md p-2",
                {
                  "bg-main-400": location === "/friends",
                },
              )}
            >
              <span className="flex items-center space-x-4">
                <BsPerson className="w-5 h-auto" />

                <span>{t("common.friends")}</span>
              </span>

              <AiOutlineRight className="cursor-pointer" />
            </a>
          </Link>

          <Link href="/projects">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
              className={cx(
                "flex items-center justify-between cursor-pointer text-main-contrast rounded-md p-2",
                {
                  "bg-main-400": location === "/projects",
                },
              )}
            >
              <span className="text-main-contrast flex items-center space-x-4">
                <Icon.Rooms className="w-5 h-auto" />

                <span>{t("common.projects")}</span>
              </span>

              <AiOutlineRight className="cursor-pointer" />
            </a>
          </Link>

          <Link href="/settings">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
              className={cx(
                "flex items-center justify-between cursor-pointer text-main-contrast rounded-md p-2",
                {
                  "bg-main-400": location === "/settings",
                },
              )}
            >
              <span className="flex items-center space-x-4">
                <FiSettings className="w-5 h-auto" />

                <span>{t("common.settings")}</span>
              </span>

              <AiOutlineRight className="cursor-pointer" />
            </a>
          </Link>

          <Link href="/faq">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
              className={cx(
                "flex items-center justify-between cursor-pointer text-main-contrast rounded-md p-2",
                {
                  "bg-main-400": location === "/faq",
                },
              )}
            >
              <span className="flex items-center space-x-4">
                <BsQuestionOctagon className="w-5 h-auto" />

                <span>{t("common.faq")}</span>
              </span>

              <AiOutlineRight className="cursor-pointer" />
            </a>
          </Link>

          <div
            onClick={() => {
              api.auth
                .logout()
                .then(() => {
                  toast.success("You successfully logged out! :)");

                  dispatch(authModel.actions.setCredentials(null));
                  dispatch(authModel.actions.setIsAuthetnicated(false));
                })
                .catch(() => {
                  toast.error("Something's wrong :(");
                });
            }}
            role="presentation"
          >
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <span
              className={cx(
                "flex items-center justify-between cursor-pointer text-main-contrast rounded-md p-2",
              )}
            >
              <span className="flex items-center space-x-4">
                <Icon.Logout className="w-5 h-auto" />

                <span>{t("common.logout")}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
