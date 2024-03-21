import {useEffect, useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {useTranslation} from "react-i18next";

import {
  Button,
  ContentTemplate,
  H5,
  H6,
  Icon,
  Link,
  TextField,
} from "@shared/ui";
import {
  MyProjectSheet,
  ProjectCard,
  useFounderProjects,
  useMemberProjects,
  useSearchedProjectCards,
} from "@features/projects";
import {useSearchParam} from "@shared/lib/routing";

enum Tab {
  MY_PROJECTS = "my-projects",
  ALL_PROJECTS = "all-projects",
}

export const ProjectsPage: React.FC = () => {
  const initialTab = useSearchParam("tab") as Tab;

  const [currentTab, setCurrentTab] = useState<Tab>(
    initialTab || Tab.MY_PROJECTS,
  );

  console.log(currentTab);

  const {t} = useTranslation();

  const tabs: Record<Tab, string> = {
    "my-projects": t("projects.tabs.my-projects"),
    "all-projects": t("projects.tabs.all-projects"),
  };

  return (
    <ContentTemplate preserveNoScroll>
      <Tabs.Root
        value={currentTab}
        onValueChange={(tab) => {
          setCurrentTab(tab as Tab);
        }}
        className="w-full h-full flex flex-col"
      >
        <Tabs.List>
          {Object.entries(tabs).map(([tab, label]) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className={cx("rounded-t-2xl px-10 py-2", {
                "bg-paper-brand": currentTab === tab,
              })}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="bg-paper-brand flex-1 rounded-xl">
          <Tabs.Content value="my-projects">
            <MyProjectsTab />
          </Tabs.Content>

          <Tabs.Content value="all-projects">
            <AllProjectsTab />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};

const MyProjectsTab: React.FC = () => {
  const {t} = useTranslation();

  const [{projects: founderProjects}] = useFounderProjects();
  const [{projects: memberProjects}] = useMemberProjects();

  const anyFounderProjects = founderProjects && founderProjects.length !== 0;
  const anyMemberProjects = memberProjects && memberProjects.length !== 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-8">
        <H5>{t("projects.founder.title")}</H5>

        {!anyFounderProjects && (
          <div className="flex justify-center items-center mt-16">
            <div className="flex flex-col justify-center items-center text-center space-y-8">
              <div className="flex flex-col space-y-2">
                <H6 className="text-[#817C7C] font-medium text-xl max-w-[20rem]">
                  {t("projects.no-founder-projects.title")}
                </H6>

                <span className="text-[#B6B6B6] max-w-[22rem]">
                  {t("projects.no-founder-projects.subtitle")}
                </span>
              </div>

              <Link href="/projects/create">
                <Button>Create project</Button>
              </Link>
            </div>
          </div>
        )}

        {anyFounderProjects && (
          <div className="flex space-x-4 my-16">
            {founderProjects.map((project) => (
              <div key={project.id} className="w-[14rem]">
                <MyProjectSheet project={project} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col p-8">
        <H5>{t("projects.member.title")}</H5>

        {!anyMemberProjects && (
          <div className="flex justify-center items-center my-16">
            <div className="flex flex-col justify-center items-center text-center space-y-2">
              <H6 className="text-[#817C7C] font-medium text-xl max-w-[20rem]">
                {t("projects.no-member-projects.title")}
              </H6>

              <span className="text-[#B6B6B6] max-w-[22rem]">
                {t("projects.no-member-projects.subtitle")}
              </span>
            </div>
          </div>
        )}

        {anyMemberProjects && (
          <div className="flex space-x-4 mt-16">
            {memberProjects.map((project) => (
              <div key={project.id} className="w-[14rem]">
                <MyProjectSheet project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AllProjectsTab: React.FC = () => {
  const {t} = useTranslation();

  const [search, setSearch] = useState("");

  const [{projectCards}, {refetch}] = useSearchedProjectCards({
    limit: 10000000,
    page: 1,
    search,
  });

  useEffect(() => {
    refetch();
  }, [search]);

  const anyProjectCards = projectCards && projectCards.length !== 0;

  return (
    <div className="flex flex-col">
      <div className="flex justify-end p-8">
        <TextField
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
          placeholder="Search projects"
          className="h-auto"
        />
      </div>

      {anyProjectCards && (
        <div className="flex flex-wrap p-8 -m-2">
          {projectCards.map((card) => (
            <div key={card.id} className="w-1/2 p-2">
              <ProjectCard card={card} />
            </div>
          ))}
        </div>
      )}

      {!anyProjectCards && (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6 mt-12">
          <Icon.Empty />

          <H6 className="font-manrope font-medium text-[#817C7C]">
            {t("projects.all-projects.labels.no-project-cards")}
          </H6>
        </div>
      )}
    </div>
  );
};
