import {Button, ContentTemplate} from "@shared/ui";

export const FaqPage: React.FC = () => {
  return (
    <ContentTemplate>
      <ul className="h-[100%] bg-paper-brand flex flex-col">
        <li className="flex justify-between items-center border-b border-paper-contrast/30 last:border-none p-6">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Document #1</span>
            <span className="text-paper-contrast/40">
              Hides email & location
            </span>
          </div>

          <Button>Download</Button>
        </li>

        <li className="flex justify-between items-center border-b border-paper-contrast/30 last:border-none p-6">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Document #2</span>
            <span className="text-paper-contrast/40">
              Hides email & location
            </span>
          </div>

          <Button>Download</Button>
        </li>
      </ul>
    </ContentTemplate>
  );
};
