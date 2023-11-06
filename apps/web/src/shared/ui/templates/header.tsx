import * as Select from "@radix-ui/react-select";
import {BiBell, BiSearch} from "react-icons/bi";

import {Icon} from "@shared/ui";

export const Header: React.FC = () => {
  return (
    <header className="w-[100%] flex justify-end items-center py-6 px-10">
      <div className="flex items-center space-x-5">
        <button className="bg-transparent outline-none">
          <BiSearch className="w-6 h-auto" />
        </button>

        <button className="bg-transparent outline-none">
          <BiBell className="w-6 h-auto" />
        </button>

        <LanguageSelect />
      </div>
    </header>
  );
};

const LanguageSelect: React.FC = () => {
  return (
    <Select.Root>
      <Select.Trigger>
        <Icon.Flag.USA className="w-8 h-auto" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content align="end">
          <Select.Viewport>
            <Select.Item value="germany" asChild>
              <Icon.Flag.Germany className="w-8 h-auto" />
            </Select.Item>

            <Select.Item value="russia" asChild>
              <Icon.Flag.Russia className="w-8 h-auto" />
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
