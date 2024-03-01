import {useTranslation} from "react-i18next";
import {Pagination, Autoplay, EffectFade} from "swiper/modules";

import {Button, ContentTemplate, H3, H4, Icon, Swiper} from "@shared/ui";
import {ProjectCard, useFeaturedProjectCards} from "@features/projects";

import explore from "@shared/assets/explore.png";
import gather from "@shared/assets/gather.png";
import inspiring from "@shared/assets/inspiring.png";
import {ProfileCompletion} from "@features/guide";
import {navigate} from "wouter/use-location";

export const HomePage: React.FC = () => {
  const {t} = useTranslation();

  const [{projectCards}] = useFeaturedProjectCards();

  return (
    <ContentTemplate>
      <div className="w-full h-full flex flex-col space-y-14">
        <ProfileCompletion />

        <div className="w-full">
          <Swiper.Root
            slidesPerView={1}
            modules={[Pagination, Autoplay, EffectFade]}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 10000,
            }}
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
          >
            <Swiper.Slide>
              <div className="w-full flex space-x-8">
                <div className="flex flex-col flex-1 space-y-6">
                  <H3 className="text-[#112042]">{t("home.hero.#1.title")}</H3>

                  <p className="text-xl text-[#112042]">
                    {t("home.hero.#1.subtitle")}
                  </p>

                  <Button
                    onClick={() => {
                      navigate("/projects?tab=all-projects");
                    }}
                  >
                    {t("home.hero.#1.buttons.explore")}
                  </Button>
                </div>

                <img
                  src={explore}
                  alt="World map"
                  className="w-[50%] h-auto object-contain mb-auto"
                />
              </div>
            </Swiper.Slide>

            <Swiper.Slide>
              <div className="w-full flex space-x-8">
                <div className="flex flex-col flex-1 space-y-6">
                  <H3 className="text-[#112042]">{t("home.hero.#2.title")}</H3>

                  <p className="text-xl text-[#112042]">
                    {t("home.hero.#2.subtitle")}
                  </p>

                  <Button
                    onClick={() => {
                      navigate("/projects/create");
                    }}
                  >
                    {t("home.hero.#2.buttons.explore")}
                  </Button>
                </div>

                <img
                  src={gather}
                  alt="Person sitting at a table with a laptop"
                  className="w-[50%] h-auto object-contain mb-auto"
                />
              </div>
            </Swiper.Slide>

            <Swiper.Slide>
              <div className="w-full flex space-x-8">
                <div className="flex flex-col flex-1 space-y-6">
                  <H3 className="text-[#112042]">{t("home.hero.#3.title")}</H3>

                  <p className="text-xl text-[#112042]">
                    {t("home.hero.#3.subtitle")}
                  </p>

                  <Button
                    onClick={() => {
                      navigate("/projects?tab=all-projects");
                    }}
                  >
                    {t("home.hero.#3.buttons.explore")}
                  </Button>
                </div>

                <img
                  src={inspiring}
                  alt="Person standing at a desk"
                  className="w-[50%] h-auto object-contain mb-auto"
                />
              </div>
            </Swiper.Slide>
          </Swiper.Root>
        </div>

        <div className="w-full flex bg-[#0B4870] text-[#F8F9FA] rounded-2xl relative p-8 pb-20">
          <Icon.Book className="text-current w-10 h-10 mr-4" />

          <p className="text-current font-light italic text-xl -mt-0.5">
            {t("common.quotes.#1.text")}
          </p>

          <span className="absolute right-8 bottom-8 text-[#E9E4E4] text-lg">
            ~ {t("common.quotes.#1.author")} ~
          </span>
        </div>

        <div className="w-full flex space-x-8">
          <Button
            onClick={() => {
              navigate("/projects/create");
            }}
            color="chromatic"
            className="w-1/2 text-xl"
          >
            🚀 Create project
          </Button>

          <Button
            onClick={() => {
              navigate("/projects?tab=all-projects");
            }}
            color="chromatic"
            className="w-1/2 text-xl"
          >
            🎯 Find project
          </Button>
        </div>

        <div className="w-full flex flex-col space-y-4">
          <H4 className="font-manrope font-medium text-2xl">
            {t("home.projects.title")}
          </H4>

          <div className="flex flex-wrap -m-4">
            {projectCards?.map((card) => (
              <div key={card.id} className="w-1/2 p-4">
                <ProjectCard card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentTemplate>
  );
};
