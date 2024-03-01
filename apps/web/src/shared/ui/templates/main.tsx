import {PropsWithChildren, ReactNode} from "react";
import {cx} from "class-variance-authority";

import {Container} from "./container";

interface MainTemplateProps extends PropsWithChildren {
  navbar?: ReactNode;
  header?: ReactNode;
  preserveNoScroll?: boolean;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({
  navbar,
  header,
  preserveNoScroll,
  children,
}) => (
  <div className="w-full h-full flex flex-col">
    {header && <header>{header}</header>}

    <div
      className={cx("w-full h-full bg-paper py-8", {
        "min-h-[calc(100%-96px)]": preserveNoScroll,
      })}
    >
      <Container>
        <div className="w-full h-full flex justify-between">
          {navbar && <nav className="w-[13rem] mr-[3rem]">{navbar}</nav>}

          <main className="flex h-full w-[calc(100%-18rem)]">{children}</main>
        </div>
      </Container>
    </div>
  </div>
);
