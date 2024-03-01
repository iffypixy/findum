import {PropsWithChildren} from "react";

import header from "@shared/assets/header.png";
import {User} from "@shared/lib/types";
import {Avatar} from "@shared/ui";
import {navigate} from "wouter/use-location";

interface FriendCardProps extends PropsWithChildren {
  user: User;
}

export const FriendCard: React.FC<FriendCardProps> = ({user, children}) => (
  <div
    role="presentation"
    onClick={() => {
      navigate(`/users/${user.id}`);
    }}
    className="w-full flex flex-col rounded-xl"
  >
    <img src={header} alt="Profile header" className="w-full h-16" />

    <div className="flex flex-col space-y-4 p-6 bg-white text-center relative pt-14">
      <Avatar
        src={user.avatar}
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 border border-[#ccc]"
        alt="Avatar"
      />

      <div className="flex flex-col space-y-0.5">
        <span className="text-[#112042] font-medium">
          {user.firstName} {user.lastName}
        </span>

        <span className="text-[#817C7C] text-sm">
          {user.location.city}, {user.location.country}
        </span>
      </div>

      {children}
    </div>
  </div>
);
