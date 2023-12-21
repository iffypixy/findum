import {PropsWithChildren} from "react";
import {IoAddCircleOutline} from "react-icons/io5";
import {useLocation} from "wouter";
import {useKeycloak} from "@react-keycloak/web";

import {Button, ContentTemplate, H1, H5} from "@shared/ui";
import {ProjectCard} from "@features/projects";

const avatar = "https://shorturl.at/ikvZ0";

export const HomePage: React.FC = () => {
  const [, navigate] = useLocation();

  const {keycloak} = useKeycloak();

  return (
    <ContentTemplate>
      <div className="w-[100%] h-[100%] bg-paper-brand flex flex-col overflow-x-auto">
        <div className="w-[100%] bg-paper shadow-sm py-14 px-10">
          <Container>
            <H1 className="mb-4 font-secondary">
              Hi, {keycloak.tokenParsed!.given_name}
            </H1>
            <span className="text-paper-contrast/40 text-xl">
              Product designer{" "}
            </span>
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
                  <span className="text-xl font-medium">Create a project</span>
                </Button>

                <Button
                  onClick={() => {
                    navigate("/projects");
                  }}
                  className="w-[45%] inline-flex items-center justify-center bg-accent-contrast text-main space-x-2 shadow-sm py-6"
                >
                  <IoAddCircleOutline className="w-[1.5em] h-auto" />{" "}
                  <span className="text-xl font-medium">Find a project</span>
                </Button>
              </div>

              <div className="flex flex-col space-y-4">
                <H5 className="font-normal">Best recent startup projects</H5>

                <div className="flex justify-between flex-wrap items-center">
                  {Array.from({length: 5}).map((_, idx) => (
                    <div key={idx} className="w-[45%] my-4">
                      <ProjectCard
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
                            benefits: "A lot of experience.",
                            requirements: "Be motivated.",
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
