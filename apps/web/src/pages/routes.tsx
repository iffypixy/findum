import {Switch} from "wouter";

import {HomePage} from "./home";
import {ChatsPage} from "./chats";
import {PrivateChatPage} from "./chats/private";
import {ProjectChatPage} from "./chats/project";
import {FriendsPage} from "./friends";
import {SettingsPage} from "./settings";
import {ProjectsPage} from "./projects";
import {CreateProjectPage} from "./projects/create";
import {ProjectPage} from "./projects/project";
import {UserPage} from "./users/user";
import {EditProjectPage} from "./projects/edit";
import {PrivateRoute, PublicOnlyRoute} from "@shared/lib/routing";
import {SignInPage} from "./sign-in";
import {SignUpPage} from "./sign-up";
import {ForgotPasswordPage} from "./forgot-password";
import {ResetPasswordPage} from "./reset-password";

export const Routes: React.FC = () => (
  <Switch>
    <PublicOnlyRoute path="/sign-in" component={SignInPage} />
    <PublicOnlyRoute path="/sign-up" component={SignUpPage} />
    <PrivateRoute path="/" component={HomePage} />
    <PrivateRoute path="/friends" component={FriendsPage} />
    <PrivateRoute path="/projects" component={ProjectsPage} />
    <PrivateRoute path="/settings" component={SettingsPage} />
    <PrivateRoute path="/projects/create" component={CreateProjectPage} />
    <PrivateRoute path="/projects/:projectId" component={ProjectPage} />
    <PrivateRoute
      path="/projects/:projectId/edit"
      component={EditProjectPage}
    />
    <PrivateRoute path="/settings" component={SettingsPage} />
    <PrivateRoute path="/users/:userId" component={UserPage} />
    <PrivateRoute path="/chats" component={ChatsPage} />
    <PrivateRoute
      path="/chats/private/:partnerId"
      component={PrivateChatPage}
    />
    <PrivateRoute
      path="/chats/project/:projectId"
      component={ProjectChatPage}
    />

    <PublicOnlyRoute path="/forgot-password" component={ForgotPasswordPage} />
    <PublicOnlyRoute
      path="/reset-password/:code"
      component={ResetPasswordPage}
    />
  </Switch>
);
