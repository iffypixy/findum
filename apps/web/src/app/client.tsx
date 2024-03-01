import {Toaster} from "react-hot-toast";

import {CredentialsLoader, EmailConfirmationGuard} from "@features/auth";
import {NotificationManager} from "@features/notifications";
import {ChatManager} from "@features/chats";
import {Routes} from "@pages/routes";
import {ThemeManager} from "@shared/lib/theming";

export const App = () => (
  <ThemeManager>
    <Toaster />

    <CredentialsLoader>
      <EmailConfirmationGuard>
        <NotificationManager />
        <ChatManager />

        <Routes />
      </EmailConfirmationGuard>
    </CredentialsLoader>
  </ThemeManager>
);
