import {BsPerson} from "react-icons/bs";
import {BsPlus} from "react-icons/bs";
import {BiSortUp} from "react-icons/bi";
import {PiNotePencilDuotone} from "react-icons/pi";
import {IoAddCircleOutline} from "react-icons/io5";

import {Avatar, Button, H1, H4, Header, Navbar, Sidebar} from "@shared/ui";

const avatar = "https://shorturl.at/ikvZ0";

export const HomePage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex">
      <Navbar />

      <div className="w-[75%] h-[100%] bg-paper-brand">
        <Header />

        <main>
          <div className="w-[100%] bg-paper shadow-sm py-14 px-10">
            <H1 className="mb-4">Hi, Omar</H1>
            <span className="text-paper-contrast/40">Product designer </span>
          </div>

          <div className="w-[100%] space-y-14 p-10">
            <div className="flex justify-between space-x-12">
              <Button className="w-[100%] inline-flex items-center justify-center bg-accent-contrast text-main space-x-2 shadow-sm py-5">
                <IoAddCircleOutline className="w-[1.5em] h-auto" />{" "}
                <span>Create a project</span>
              </Button>

              <Button className="w-[100%] inline-flex items-center justify-center bg-accent-contrast text-main space-x-2 shadow-sm py-5">
                <IoAddCircleOutline className="w-[1.5em] h-auto" />{" "}
                <span>Find a project</span>
              </Button>
            </div>

            <div className="flex flex-col space-y-4">
              <H4>Best recent startup projects</H4>

              <div className="flex space-x-12">
                {Array.from({length: 2}).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-[100%] flex flex-col bg-paper rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between p-8">
                      <div className="flex items-center space-x-8">
                        <Avatar
                          src={avatar}
                          alt="Startup project avatar"
                          className="w-20 h-auto"
                        />

                        <div className="flex flex-col space-y-2">
                          <span className="text-main text-xl font-bold">
                            Findum app
                          </span>

                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2 text-paper-contrast/60">
                              <BsPerson className="w-4 h-auto" />

                              <span>0/4</span>
                            </div>

                            <div className="flex items-center space-x-2 text-paper-contrast/60">
                              <BiSortUp className="w-4 h-auto" />
                              <span>invested</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end h-[100%]">
                        <button className="bg-transparent outline-none">
                          <PiNotePencilDuotone className="w-6 h-auto text-main" />
                        </button>

                        <span className="text-sm text-paper-contrast/60">
                          show all
                        </span>
                      </div>
                    </div>

                    <div className="w-[100%] h-[1px] bg-accent" />

                    <div className="flex items-center space-x-6 p-8">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-accent-300 rounded-full">
                          <BsPlus className="w-8 h-auto text-accent-contrast" />
                        </div>

                        <span className="text-xs">UX/UI designer</span>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-accent-300 rounded-full">
                          <BsPlus className="w-8 h-auto text-accent-contrast" />
                        </div>

                        <span className="text-xs">Frontend dev.</span>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-accent-300 rounded-full">
                          <BsPlus className="w-8 h-auto text-accent-contrast" />
                        </div>

                        <span className="text-xs">Project manager</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Sidebar />
    </div>
  );
};
