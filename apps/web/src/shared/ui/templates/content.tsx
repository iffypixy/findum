import {PropsWithChildren} from "react";

import {Navbar} from "@widgets/navbar";
import {Header} from "@widgets/header";

import {MainTemplate} from "./main";

interface ContentTemplateProps extends PropsWithChildren {
  preserveNoScroll?: boolean;
}

export const ContentTemplate: React.FC<ContentTemplateProps> = ({
  children,
  preserveNoScroll,
}) => (
  <MainTemplate
    header={<Header />}
    navbar={<Navbar />}
    preserveNoScroll={preserveNoScroll}
  >
    {children}
  </MainTemplate>
);
