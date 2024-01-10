import {Button, ContentTemplate} from "@shared/ui";

export const FaqPage: React.FC = () => {
  return (
    <ContentTemplate>
      <ul className="h-[100%] bg-paper-brand flex flex-col">
        <li className="flex justify-between items-center border-b border-paper-contrast/30 last:border-none p-6">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Document #1</span>
            <span className="text-paper-contrast/40">Payment policy</span>
          </div>

          <a
            href="https://storage.yandexcloud.net/s3metaorta/payment%20policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Download</Button>
          </a>
        </li>

        <li className="flex justify-between items-center border-b border-paper-contrast/30 last:border-none p-6">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Document #2</span>
            <span className="text-paper-contrast/40">Privacy policy</span>
          </div>

          <a
            href="https://storage.yandexcloud.net/s3metaorta/privacy%20policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Download</Button>
          </a>
        </li>
      </ul>
    </ContentTemplate>
  );
};
