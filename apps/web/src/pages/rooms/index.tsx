import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {BiSearch} from "react-icons/bi";
import {useLocation} from "wouter";
import {BsPlus} from "react-icons/bs";

import {Button, ContentTemplate, H4, H5, Select, TextField} from "@shared/ui";
import {cities} from "@shared/lib/cities";
import {MyProjectCard, ProjectCard} from "@features/projects";

const avatar = "https://shorturl.at/ikvZ0";

type Tab = "my-projects" | "all-projects";

export const RoomsPage: React.FC = () => {
  const [, navigate] = useLocation();

  const [currentTab, setCurrentTab] = useState<Tab>("my-projects");

  const hasProjects = true;

  const tabs = [
    {
      id: "my-projects",
      title: "My projects",
    },
    {
      id: "all-projects",
      title: "All projects",
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
            {tabs.map((tab) => (
              <Tabs.Trigger
                value={tab.id}
                className={cx("bg-paper rounded-t-lg px-10 py-2", {
                  "bg-paper-brand": currentTab === tab.id,
                })}
              >
                {tab.title}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content
            value="my-projects"
            className="flex-1 bg-paper-brand overflow-y-auto"
          >
            <div className="absolute -top-4 right-10">
              <Button
                onClick={() => {
                  navigate("/projects/create");
                }}
                className="inline-flex items-center space-x-3"
              >
                <span>Create project</span>

                <span className="border border-accent-contrast rounded-full">
                  <BsPlus className="w-4 h-auto text-accent-contrast" />
                </span>
              </Button>
            </div>

            {hasProjects ? (
              <div className="flex flex-col space-y-10 p-14">
                <div className="flex flex-col space-y-2">
                  <H5>Owner</H5>

                  <div className="flex items-center space-x-8 overflow-x-auto py-4">
                    {Array.from({length: 6}).map((_, idx) => (
                      <MyProjectCard
                        key={idx}
                        name="Findum"
                        avatar={avatar}
                        members={[{avatar}, {avatar}]}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-[100%] min-h-[2px] bg-paper-contrast/20" />

                <div className="flex flex-col space-y-2">
                  <H5>Rooms</H5>

                  <div className="flex items-center space-x-8 overflow-x-auto py-4">
                    {Array.from({length: 6}).map((_, idx) => (
                      <MyProjectCard
                        key={idx}
                        name="Findum"
                        avatar={avatar}
                        members={[{avatar}, {avatar}]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NoMyProjectsScreen />
            )}
          </Tabs.Content>

          <Tabs.Content
            value="all-projects"
            className="flex-1 bg-paper-brand overflow-y-auto"
          >
            <div className="absolute -top-5 right-10 flex flex-col items-start -space-y-1">
              <span className="font-semibold text-2xl">85 rooms</span>
              <span className="text-paper-contrast/60">were created</span>
            </div>

            <div className="flex flex-col space-y-8 p-14">
              <div className="flex flex-col space-y-4">
                <TextField
                  suffix={<BiSearch className="w-6 h-auto" />}
                  placeholder="Specialist"
                  className="w-[25rem] h-auto"
                />

                <Select.Root
                  placeholder="Location"
                  className="w-[15rem] h-auto"
                >
                  {cities.map((city) => (
                    <Select.Item value={city}>{city}</Select.Item>
                  ))}
                </Select.Root>
              </div>

              <div className="flex items-center flex-wrap justify-between -m-6">
                {Array.from({length: 7}).map((_, idx) => (
                  <div className="w-[45%] m-6">
                    <ProjectCard
                      key={idx}
                      id="@projectid"
                      owner={{
                        avatar,
                        firstName: "Omar",
                        lastName: "Aliev",
                      }}
                      startDate={new Date()}
                      endDate={new Date()}
                      description="Roles and responsibilities include managing Java/Java EE application development while providing expertise in the entire software development lifecycle, from concept and design to testing. Java developer responsibilities include designing, developing, and delivering high-volume, low-latency applications for mission-critical systems."
                      name="Findum #2"
                      avatar={avatar}
                      slots={[
                        {
                          specialist: "Newbie",
                          requirements: "Be smart.",
                          benefits: "A lot of money.",
                        },
                      ]}
                      members={[
                        {avatar, specialist: "Full-stack dev."},
                        {avatar, specialist: "Project manager"},
                        {avatar, specialist: "Designer"},
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
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
