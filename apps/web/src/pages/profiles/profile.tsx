import {Link} from "wouter";

import {Avatar, Button, ContentTemplate, H2, H5, Icon} from "@shared/ui";

const avatar = "https://shorturl.at/ikvZ0";

export const ProfilePage: React.FC = () => {
  return (
    <ContentTemplate>
      <div className="w-[100%] flex flex-col bg-paper-brand">
        <div className="w-[100%] h-28 flex justify-end items-end bg-paper relative bg-center bg-cover space-y-6 p-8">
          <Avatar
            src={avatar}
            className="w-36 h-auto absolute left-8 -bottom-1/2"
          />

          <div className="flex items-center space-x-4">
            <Button>Cancel</Button>
            <Button>Accept</Button>
          </div>
        </div>

        <div className="flex flex-col space-y-8 pt-32 p-8 ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-2">
              <H2>Sabina Shakhanova</H2>
              <span>sabishakh@gmail.com</span>
            </div>

            <div className="flex flex-col items-end space-y-4">
              <span>Almaty, KZ</span>

              <Link
                href="/profiles/profile/resume"
                className="inline-flex space-x-2 items-center text-accent"
              >
                <Icon.Resume />
                <span className="underline underline-offset-4">
                  View resume
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <H5>Roles</H5>

            <div className="flex items-center space-x-8">
              <div className="w-[33.3%] flex flex-col text-center bg-paper rounded-xl shadow-md space-y-1 py-[3%]">
                <span className="text-[#F59E0B] text-2xl">Project manager</span>

                <span className="text-lg">5 projects</span>
              </div>

              <div className="w-[33.3%] flex flex-col text-center bg-paper rounded-xl shadow-md space-y-1 py-[3%]">
                <span className="text-[#47B33E] text-2xl">Project manager</span>

                <span className="text-lg">5 projects</span>
              </div>

              <div className="w-[33.3%] flex flex-col text-center bg-paper rounded-xl shadow-md space-y-1 py-[3%]">
                <span className="text-[#9554FF] text-2xl">Project manager</span>

                <span className="text-lg">5 projects</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <H5>Reviews</H5>

            <div className="flex items-center space-x-8 overflow-x-auto pb-4">
              {Array.from({length: 7}).map((_, idx) => (
                <div
                  key={idx}
                  className="min-w-[25rem] flex flex-col bg-paper rounded-xl shadow-md relative space-y-4 p-8"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar src={avatar} />

                    <div className="flex flex-col">
                      <span className="text-xl">Almaz Maxutov</span>
                      <span className="text-paper-contrast/60">
                        "Dolana" project
                      </span>
                    </div>
                  </div>

                  <p className="overflow-hidden break-all">
                    It would be helpful to know the product, service, or
                    experience you want to review, as well as any specific
                    aspects or criteria you would like to focus on.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentTemplate>
  );
};
