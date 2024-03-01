import {PropsWithChildren} from "react";

import {H3} from "@shared/ui";

import {useCredentials} from "../queries";
import {AuthenticationTemplate} from "./authentication-template";

export const EmailConfirmationGuard: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [{credentials, isAuthenticated}] = useCredentials();

  if (!isAuthenticated) return <>{children}</>;

  if (!credentials?.isVerified)
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
