import {useSelector} from "react-redux";
import {AuthenticationTemplate, authModel} from "..";
import {PropsWithChildren} from "react";
import {H3} from "@shared/ui";

export const Verification: React.FC<PropsWithChildren> = ({children}) => {
  const credentials = useSelector(authModel.selectors.credentials);

  if (!credentials.data) return <>{children}</>;

  if (!credentials.data?.isVerified)
    return (
      <AuthenticationTemplate>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <H3>Confirm your registration</H3>

            <span className="text-paper-contrast/60 text-lg">
              Check your mailbox
            </span>
          </div>
        </div>
      </AuthenticationTemplate>
    );

  return <>{children}</>;
};
