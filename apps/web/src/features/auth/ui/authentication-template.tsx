import {PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";

import {H2} from "@shared/ui";
import bg from "@shared/assets/block-bg.png";

export const AuthenticationTemplate: React.FC<PropsWithChildren> = ({
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
          <div className="flex flex-col space-y-10">
            <H2 className="text-white whitespace-pre-line">
              {t("common.auth.greeting.title")}
            </H2>

            <p className="text-[#9EAFC1]">
              {t("common.auth.greeting.subtitle")}
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
