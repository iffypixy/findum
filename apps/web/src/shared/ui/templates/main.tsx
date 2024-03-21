import {PropsWithChildren, ReactNode} from "react";
import {cx} from "class-variance-authority";

import {Container} from "./container";

interface MainTemplateProps extends PropsWithChildren {
  navbar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  preserveNoScroll?: boolean;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({
  navbar,
  header,
  footer,
  preserveNoScroll,
  children,
}) => (
  <div
    className={cx("w-full flex flex-col", {
      "h-screen": preserveNoScroll,
    })}
  >
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

    {footer && <footer>{footer}</footer>}
  </div>
);
