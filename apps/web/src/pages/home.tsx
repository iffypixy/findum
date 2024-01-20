import {PropsWithChildren, useEffect, useState} from "react";
import {IoAddCircleOutline} from "react-icons/io5";
import {useLocation} from "wouter";
import {useTranslation} from "react-i18next";

import {Button, ContentTemplate, H5} from "@shared/ui";
import {api} from "@shared/api";
import {Nullable, ProjectCard as IProjectCard} from "@shared/lib/types";
import {ProjectCard} from "@features/projects";

export const HomePage: React.FC = () => {
  const [, navigate] = useLocation();

  const {t} = useTranslation();

  const [cards, setCards] = useState<Nullable<IProjectCard[]>>(null);

  useEffect(() => {
    api.projects
      .getFeaturedProjectCards()
      .then(({data}) => setCards(data.cards));
  }, []);

  return (
    <ContentTemplate>
      <div className="w-[100%] h-[100%] bg-paper flex flex-col overflow-x-auto">
        <div className="w-[100%] bg-paper pt-12 px-10">
          <Container>
            <div className="bg-[#F8F9FA] rounded-3xl shadow-even-sm w-[100%] relative p-10 pb-28">
              <p
                className="text-2xl text-[#112042] font-medium"
                style={{fontFamily: "Manrope"}}
              >
                Ideas don’t come out fully formed. They only become clear as you
                work on them. You just have to get started.
              </p>

              <span
                className="text-[#817C7C] text-xl absolute right-10 bottom-10"
                style={{fontFamily: "Manrope"}}
              >
                ~ Mark Zuckerberg ~
              </span>
            </div>
          </Container>
        </div>

        <div className="w-[100%] p-10">
          <Container>
            <div className="space-y-10">
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    navigate("/projects/create");
                  }}
                  className="w-[47.5%] font-medium text-[#47B33E] inline-flex items-center justify-center bg-[#F8F9FA] space-x-2 shadow-even-sm py-6"
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
                  className="w-[47.5%] font-medium inline-flex items-center justify-center bg-[#F8F9FA] text-[#F59E0B] space-x-2 shadow-even-sm py-6"
                >
                  <IoAddCircleOutline className="w-[1.5em] h-auto" />{" "}
                  <span className="text-xl font-medium">
                    {t("home.buttons.find-projects")}
                  </span>
                </Button>
              </div>

              <div className="flex flex-col space-y-4">
                <H5 className="font-normal" style={{fontFamily: "Manrope"}}>
                  {t("home.title")}
                </H5>

                <div className="flex justify-between flex-wrap items-center">
                  {cards
                    ?.filter((c) => c.members.some((m) => !m.isOccupied))
                    ?.map((card, idx) => (
                      <div
                        key={idx}
                        className="w-[47.5%] my-4 rounded-3xl shadow-even-sm overflow-hidden [&>div]:bg-[#F8F9FA]"
                      >
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
  <div className="max-w-[80rem] m-auto">{children}</div>
);
