import {Avatar, H2} from "@shared/ui";
import bg from "@shared/assets/block-bg.png";
import {useTranslation} from "react-i18next";

import {Button} from "@shared/ui";

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
            <H2 className="text-main-contrast whitespace-pre-line">
              {t("common.auth-title")}
            </H2>

            <p className="text-main-contrast/70">{t("common.auth-subtitle")}</p>
          </div>

          <div className="flex items-center space-x-5">
            <div className="flex -space-x-3">
              {Array.from({length: 4}).map((_, idx) => (
                <Avatar key={idx} src={avatar} />
              ))}
            </div>

            <span className="text-main-contrast/70">{t("common.auth-ad")}</span>
          </div>

          <div className="flex flex-col space-y-6">
            <p className="text-white text-xs">
              MetaOrta — социальная сеть, которая предоставляет людям
              возможность объединиться в команду для реализации своих
              стартап-идей.
              <br /> <br />
              Покупка карточки - вы приобретаете место для ваших обьявлении о
              наборе в ваши проекты, где вы можете отдельно докупить ваши слоты.
              <br /> <br />
              Вторая карточка - 2100 тг <br /> Третья карточка - 5000 тг
              <br /> <br /> Покупка слотов - для набора нужных вам людей внутри
              карточки вы приобритаете места от 1-4 мест для каждой карточки.
              Цена каждого слота 1100 тг
              <br /> <br />
              KZ348562203131489362 <br /> АО "Банк ЦентрКредит"
              <br /> KCJBKZKX
            </p>

            <div className="flex space-x-4 text-xs">
              <a
                href="https://storage.yandexcloud.net/s3metaorta/payment%20policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Payment policy</Button>
              </a>

              <a
                href="https://storage.yandexcloud.net/s3metaorta/privacy%20policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Privacy policy</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[50%] h-[100%] flex flex-col items-start justify-center pl-[5%]">
        {children}
      </div>
    </main>
  );
};
