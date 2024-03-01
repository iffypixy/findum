import {ChatTemplate} from "@features/chats";

export const ChatsPage: React.FC = () => {
  return (
    <ChatTemplate>
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-lg font-semibold text-paper-contrast/60">
          Select chat
        </span>
      </div>
    </ChatTemplate>
  );
};
