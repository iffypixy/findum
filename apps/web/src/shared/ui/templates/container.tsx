import {PropsWithChildren} from "react";

export const Container: React.FC<PropsWithChildren> = ({children}) => (
  <div className="max-w-[1170px] w-[90%] h-full mx-auto">{children}</div>
);
