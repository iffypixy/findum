import {PropsWithChildren, useEffect, useState} from "react";
import {IoAddCircleOutline} from "react-icons/io5";
import {useLocation} from "wouter";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import {Button, ContentTemplate, H1, H5} from "@shared/ui";
import {api} from "@shared/api";
import {Nullable, ProjectCard as IProjectCard} from "@shared/lib/types";
import {ProjectCard} from "@features/projects";
import {authModel} from "@features/auth";

export const HomePage: React.FC = () => {
  const [, navigate] = useLocation();

  const {t} = useTranslation();

  const credentials = useSelector(authModel.selectors.credentials);

  const [cards, setCards] = useState<Nullable<IProjectCard[]>>(null);

  useEffect(() => {
    api.projects
      .getFeaturedProjectCards()
      .then(({data}) => setCards(data.cards));
  }, []);

  return (
    <ContentTemplate>
      <div className="w-[100%] h-[100%] bg-paper-brand flex flex-col overflow-x-auto">
        <div className="w-[100%] bg-paper shadow-sm py-14 px-10">
          <Container>
            <H1 className="mb-4 font-secondary">
              {t("home.greeting")}
              {credentials.data?.firstName}
            </H1>
            <span className="text-paper-contrast/40 text-xl"></span>
          </Container>
        </div>

        <div className="w-[100%] p-10">
          <Container>
            <div className="space-y-14">
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    navigate("/projects/create");
                  }}
                  className="w-[45%] inline-flex items-center justify-center bg-accent-contrast text-main space-x-2 shadow-sm py-6"
                >
                  <IoAddCircleOutline className="w-[1.5em] h-auto" />{" "}
                  <span className="text-xl font-medium">
                    {t("home.buttons.create-project")}
                  </span>
                </Button>

                <Button
                  onClick={() => {
                    navigate("/projects?tab=all-projects");
                  }}
                  className="w-[45%] inline-flex items-center justify-center bg-accent-contrast text-main space-x-2 shadow-sm py-6"
                >
                  <IoAddCircleOutline className="w-[1.5em] h-auto" />{" "}
                  <span className="text-xl font-medium">
                    {t("home.buttons.find-projects")}
                  </span>
                </Button>
              </div>

              <div className="flex flex-col space-y-4">
                <H5 className="font-normal">{t("home.title")}</H5>

                <div className="flex justify-between flex-wrap items-center">
                  {cards
                    ?.filter((c) => c.members.some((m) => !m.isOccupied))
                    ?.map((card, idx) => (
                      <div key={idx} className="w-[45%] my-4">
                        <ProjectCard
                          id={card.id}
                          projectId={card.project.id}
                          owner={card.project.founder}
                          startDate={card.project.startDate}
                          endDate={card.project.endDate}
                          description={card.project.description}
                          name={card.project.name}
                          avatar={card.project.avatar}
                          slots={card.members
                            .filter((m) => !m.isOccupied)
                            .map((m) => ({
                              id: m.id,
                              specialist: m.role,
                              benefits: m.benefits,
                              requirements: m.requirements,
                            }))}
                          members={card.members
                            .filter((m) => m.isOccupied)
                            .map((m) => ({
                              userId: m.user.id,
                              id: m.id,
                              avatar: m.user.avatar,
                              specialist: m.role,
                            }))}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </ContentTemplate>
  );
};

const Container: React.FC<PropsWithChildren> = ({children}) => (
  <div className="max-w-[90rem] m-auto">{children}</div>
);
