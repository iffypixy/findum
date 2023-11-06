import {AiOutlineMail} from "react-icons/ai";

import {Avatar} from "@shared/ui";

const avatar = "https://shorturl.at/ikvZ0";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[5%] h-[100%] flex flex-col items-center space-y-10 shadow-lg py-[1%]">
      <AiOutlineMail className="w-8 h-auto" />

      <div className="flex flex-col space-y-6">
        {Array.from({length: 5}).map((_, idx) => (
          <Avatar key={idx} src={avatar} alt="Friend's avatar" />
        ))}
      </div>
    </aside>
  );
};
