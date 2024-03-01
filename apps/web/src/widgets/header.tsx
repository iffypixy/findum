import {useTranslation} from "react-i18next";

import {useCredentials} from "@features/auth";
import {Avatar, Container, Icon, Link} from "@shared/ui";
import usa from "@shared/assets/flags/usa.png";
import russia from "@shared/assets/flags/russia.png";
import logo from "@shared/assets/logo.jpg";
import kazakhstan from "@shared/assets/flags/kazakhstan.png";

export const Header: React.FC = () => {
  const {i18n} = useTranslation();

  const [{credentials}] = useCredentials();

  const languages = ["en", "ru", "kz"];

  const nextLanguage = () => {
    const idx = languages.indexOf(i18n.language) + 1;

    return languages[idx] || languages[0];
  };

  const flag = {
    en: usa,
    ru: russia,
    kz: kazakhstan,
  }[i18n.language]!;

  return (
    <div className="w-full bg-paper-brand py-6">
      <Container>
        <div className="w-full flex justify-between items-center">
          <Avatar src={logo} alt="MetaOrta logo" />

          <div className="flex items-center space-x-14">
            <div className="flex items-center space-x-6">
              <button>
                <Icon.Search className="w-6 h-6" />
              </button>

              <button>
                <Icon.Bell className="w-7 h-7" />
              </button>

              <button
                onClick={() => {
                  i18n.changeLanguage(nextLanguage());
                }}
              >
                <img
                  src={flag}
                  alt="Current language flag"
                  className="w-auto h-9"
                />
              </button>
            </div>

            <Link href={`/users/${credentials?.id}`}>
              <div className="relative">
                <Avatar src={credentials!.avatar} alt="Profile avatar" />

                <span className="text-[#434343] absolute left-[125%] top-1/2 -translate-y-1/2 whitespace-nowrap">
                  {credentials?.firstName} {credentials?.lastName}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
