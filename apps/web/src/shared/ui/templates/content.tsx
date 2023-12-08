import {MainTemplate} from "./main";
import {Navbar} from "./navbar";
import {Header} from "./header";

type ContentTemplate = React.PropsWithChildren;

export const ContentTemplate: React.FC<ContentTemplate> = ({children}) => (
  <MainTemplate header={<Header />} navbar={<Navbar />}>
    {children}
  </MainTemplate>
);
