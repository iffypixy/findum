import {AiOutlineMail} from "react-icons/ai";
import {BsPerson} from "react-icons/bs";
import {FiSettings} from "react-icons/fi";
import {BsQuestionOctagon} from "react-icons/bs";
import {AiOutlineRight} from "react-icons/ai";
import {useLocation} from "wouter";

import {Avatar, Icon} from "@shared/ui";
import logo from "@shared/assets/logo.png";

const avatar = "https://shorturl.at/ikvZ0";

export const Navbar: React.FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <nav className="w-[20%] h-[100%] bg-main space-y-20 p-[2%]">
      <div className="flex justify-between items-center">
        <img src={logo} alt="Platform logo" className="w-10 h-auto" />

        <div className="relative w-6 h-4 cursor-pointer">
          <span className="absolute right-0 top-0 w-[100%] h-[3px] bg-main-contrast rounded-lg" />
          <span className="absolute right-0 top-[50%] translate-y-[-50%] w-[45%] h-[3px] bg-main-contrast rounded-lg" />
          <span className="absolute right-0 bottom-0 w-[75%] h-[3px] bg-main-contrast rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <Avatar src={avatar} alt="Profile picture" className="w-28 h-28" />

        <div className="flex flex-col space-y-1 text-main-contrast">
          <span className="text-lg font-bold">Omar Moldashev</span>
          <span className="text-sm">omar.moldashev@gmail.com</span>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div
          onClick={() => {
            setLocation("/chat");
          }}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="text-main-contrast flex items-center space-x-4">
            <AiOutlineMail className="w-5 h-auto" />

            <span>Messages</span>
          </div>

          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-accent-300 text-sm cursor-pointer">
            3
          </div>
        </div>

        <div
          onClick={() => {
            setLocation("/friends");
          }}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="text-main-contrast flex items-center space-x-4">
            <BsPerson className="w-5 h-auto" />

            <span>Friends</span>
          </div>

          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-accent-300 text-sm cursor-pointer">
            3
          </div>
        </div>

        <div
          onClick={() => {
            setLocation("/rooms");
          }}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="text-main-contrast flex items-center space-x-4">
            <Icon.Rooms className="w-5 h-auto" />

            <span>Rooms</span>
          </div>

          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-accent-300 text-sm cursor-pointer">
            3
          </div>
        </div>

        <div
          onClick={() => {
            setLocation("/settings");
          }}
          className="flex items-center justify-between text-main-contrast cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <FiSettings className="w-5 h-auto" />

            <span>Settings</span>
          </div>

          <AiOutlineRight className="cursor-pointer" />
        </div>

        <div
          onClick={() => {
            setLocation("/faq");
          }}
          className="flex items-center justify-between text-main-contrast cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <BsQuestionOctagon className="w-5 h-auto" />

            <span>FAQ</span>
          </div>

          <AiOutlineRight className="cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};
