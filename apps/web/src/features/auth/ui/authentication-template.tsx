import {Avatar, H2} from "@shared/ui";
import bg from "@shared/assets/block-bg.png";
import {useTranslation} from "react-i18next";

const avatar = "https://shorturl.at/ikvZ0";

type AuthenticationTemplate = React.PropsWithChildren;

export const AuthenticationTemplate: React.FC<AuthenticationTemplate> = ({
  children,
}) => {
  const {t} = useTranslation();

  return (
    <main className="w-screen h-screen flex">
      <div
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="w-[50%] h-[100%] flex items-center justify-center bg-main bg-cover bg-center"
      >
        <div className="w-[70%] flex flex-col space-y-20">
          <div className="flex flex-col space-y-6">
            <H2 className="text-white whitespace-pre-line">
              {t("common.auth-title")}
            </H2>

            {/* <p className="text-main-contrast/70 text-white">
              {t("common.auth-subtitle")}
            </p> */}
          </div>

          <div className="flex items-center space-x-5">
            <div className="flex -space-x-3">
              {Array.from({length: 4}).map((_, idx) => (
                <Avatar key={idx} src={avatar} />
              ))}
            </div>

            <span className="text-main-contrast/70 text-white">
              {t("common.auth-ad")}
            </span>
          </div>

          <div className="flex flex-col space-y-6">
            <p className="text-white text-sm">
              MetaOrta является социальной сетью, которая предоставляет
              возможность людям обьединяться в одну команду для реализации их
              стартап-идеи. Наша ценность в том, что мы упрощаем и ускоряем
              процесс командообразования что в следствии влияет позитивно на
              воспроизводимость их проекта
            </p>
          </div>
        </div>
      </div>

      <div className="w-[50%] h-[100%] flex flex-col items-start justify-center pl-[5%]">
        {children}
      </div>
    </main>
  );
};
