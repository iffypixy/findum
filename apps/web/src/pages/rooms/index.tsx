import {PropsWithChildren, useEffect, useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {BiSearch} from "react-icons/bi";
import {useLocation} from "wouter";
import {BsPlus} from "react-icons/bs";
import {useTranslation} from "react-i18next";

import {Button, ContentTemplate, H4, H5, Select, TextField} from "@shared/ui";
import {countries} from "@shared/lib/location";
import {MyProjectCard, ProjectCard, projectsModel} from "@features/projects";
import {useDispatch} from "@shared/lib/store";
import {useSelector} from "react-redux";
import {useDebouncedValue} from "@shared/lib/debounce";

type Tab = "my-projects" | "all-projects";

export const RoomsPage: React.FC = () => {
  const dispatch = useDispatch();

  const [, navigate] = useLocation();

  const params = new URLSearchParams(window.location.search);

  const [currentTab, setCurrentTab] = useState<Tab>(
    (params.get("tab") as Tab) || "my-projects",
  );

  const [specialist, setSpecialist] = useState("");

  const [country, setCountry] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string>("");

  const {t} = useTranslation();

  const all = useSelector(projectsModel.selectors.all);
  const founder = useSelector(projectsModel.selectors.founder);
  const member = useSelector(projectsModel.selectors.member);
  const total = useSelector(projectsModel.selectors.total);

  useEffect(() => {
    dispatch(projectsModel.actions.fetchProjectsAsFounder());
    dispatch(projectsModel.actions.fetchProjectsAsMember());
    dispatch(projectsModel.actions.fetchTotalAmountOfProjects());
  }, []);

  const citySearch = useDebouncedValue(city, 500);
  const countrySearch = useDebouncedValue(country, 500);
  const specialistSearch = useDebouncedValue(specialist, 500);

  useEffect(() => {
    if (currentTab === "all-projects") {
      if (!all)
        dispatch(
          projectsModel.actions.fetchProjectCards({
            page: 1,
            limit: 100,
          }),
        );
    }
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === "all-projects") {
      dispatch(
        projectsModel.actions.fetchProjectCards({
          page: 1,
          limit: 100,
          location: {country: countrySearch, city: citySearch} || undefined,
          role: specialistSearch || undefined,
        }),
      );
    }
  }, [citySearch, countrySearch, specialistSearch, currentTab]);

  useEffect(() => {
    if (currentTab === "all-projects") {
      if (!total) dispatch(projectsModel.actions.fetchTotalAmountOfProjects());
    }
  }, [dispatch, currentTab, total]);

  const hasProjects = true;

  const tabs = [
    {
      id: "my-projects",
      title: t("common.my-projects"),
    },
    {
      id: "all-projects",
      title: t("common.all-projects"),
    },
  ];

  return (
    <>
      <ContentTemplate>
        <Tabs.Root
          value={currentTab}
          onValueChange={(tab) => {
            setCurrentTab(tab as Tab);
          }}
          className="h-[100%] flex flex-col relative"
        >
          <Tabs.List className="px-14">
            <Container>
              {tabs.map((tab, idx) => (
                <Tabs.Trigger
                  key={idx}
                  value={tab.id}
                  className={cx("ml-5 bg-paper rounded-t-2xl px-10 py-2", {
                    "bg-paper-brand": currentTab === tab.id,
                  })}
                >
                  {tab.title}
                </Tabs.Trigger>
              ))}

              {currentTab === "all-projects" ? (
                <div className="absolute -top-5 z-50 right-20 flex flex-col items-start -space-y-1">
                  <span className="font-semibold text-2xl">
                    {total.data} {t("common.projects-were-created1")}
                  </span>
                  <span className="text-paper-contrast/60">
                    {t("common.projects-were-created2")}
                  </span>
                </div>
              ) : (
                <div className="absolute -top-3 right-10">
                  <Button
                    onClick={() => {
                      navigate("/projects/create");
                    }}
                    className="inline-flex items-center space-x-3"
                  >
                    <span>{t("common.create-project")}</span>

                    <span className="border border-accent-contrast rounded-full">
                      <BsPlus className="w-4 h-auto text-accent-contrast" />
                    </span>
                  </Button>
                </div>
              )}
            </Container>
          </Tabs.List>

          <Tabs.Content
            value="my-projects"
            className="flex-1 bg-paper-brand overflow-y-auto"
          >
            <Container>
              {hasProjects ? (
                <div className="flex flex-col space-y-10 p-14">
                  <div className="flex flex-col space-y-2">
                    <H5>{t("common.founder")}</H5>

                    {founder.data?.length === 0 ? (
                      <span className="text-paper-contrast/75 mt-6">
                        {t("common.no-projects")}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-8 overflow-x-auto py-4">
                        {founder.data?.map((project) => (
                          <MyProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            isFounder={true}
                            requests={(project as any).requests}
                            tasks={0}
                            avatar={project.avatar}
                            members={[]}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-[100%] min-h-[2px] bg-paper-contrast/20" />

                  <div className="flex flex-col space-y-2">
                    <H5>{t("common.projects")}</H5>

                    {member.data?.length === 0 ? (
                      <span className="text-paper-contrast/75 mt-6">
                        {t("common.no-projects")}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-8 overflow-x-auto py-4">
                        {member.data?.map((project) => (
                          <MyProjectCard
                            key={project.id}
                            id={project.id}
                            isFounder={false}
                            name={project.name}
                            tasks={(project as any).tasks}
                            avatar={project.avatar}
                            members={[]}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <NoMyProjectsScreen />
              )}
            </Container>
          </Tabs.Content>

          <Tabs.Content
            value="all-projects"
            className="flex-1 bg-paper-brand overflow-y-auto"
          >
            <Container>
              <div className="flex flex-col space-y-8 p-14">
                <div className="flex flex-col w-[30rem] space-y-4">
                  <TextField
                    suffix={<BiSearch className="w-6 h-auto" />}
                    placeholder={t("common.specialist")}
                    className="w-[100%] h-auto"
                    value={specialist}
                    onChange={(event) => {
                      setSpecialist(event.currentTarget.value);
                    }}
                  />

                  <div className="flex space-x-4">
                    <Select.Root
                      placeholder={t("common.country")}
                      className="w-[50%] h-auto"
                      value={country || undefined}
                      onValueChange={(value) => {
                        setCountry(value);
                      }}
                    >
                      {countries.map((country, idx) => (
                        <Select.Item key={idx} value={country}>
                          {country}
                        </Select.Item>
                      ))}
                    </Select.Root>

                    <TextField
                      placeholder={t("common.city")}
                      className="w-[50%] h-auto"
                      value={city}
                      onChange={(event) => {
                        setCity(event.currentTarget.value);
                      }}
                    />
                  </div>
                </div>

                {all.data?.length === 0 ? (
                  <span className="text-paper-contrast/75 mt-6">
                    {t("common.no-project-cards")}
                  </span>
                ) : (
                  <div className="flex items-center flex-wrap justify-between -m-6">
                    {all.data
                      ?.filter((c) => c.members.some((m) => !m.isOccupied))
                      .map((card, idx) => (
                        <div className="w-[45%] m-6" key={idx}>
                          <ProjectCard
                            key={idx}
                            id={card.id}
                            projectId={card.project.id}
                            owner={card.project.founder}
                            startDate={new Date(card.project.startDate)}
                            endDate={
                              card.project.endDate &&
                              new Date(card.project.endDate)
                            }
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
                                id: m.id,
                                userId: m.user.id,
                                avatar: m.user.avatar,
                                specialist: m.role,
                              }))}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Container>
          </Tabs.Content>
        </Tabs.Root>
      </ContentTemplate>
    </>
  );
};

const NoMyProjectsScreen: React.FC = () => {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col space-y-8 items-center justify-center text-center p-32">
      <div className="flex flex-col space-y-2">
        <H4>You haven't created any project yet</H4>

        <span className="text-paper-contrast/40">
          Let’s try to create a room to start the project
        </span>
      </div>

      <Button
        onClick={() => {
          navigate("/projects/create");
        }}
      >
        Create project
      </Button>
    </div>
  );
};

const Container: React.FC<PropsWithChildren> = ({children}) => (
  <div className="max-w-[80rem] m-auto relative">{children}</div>
);
