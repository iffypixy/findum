import {Switch} from "wouter";

import {HomePage} from "./home";
import {PrivateChatPage} from "./private-chat";
import {ProjectChatPage} from "./project-chat";
import {NoChatPage} from "./no-chat";
import {FriendsPage} from "./friends";
import {SettingsPage} from "./settings";
import {RoomsPage} from "./rooms";
import {CreateRoomPage} from "./rooms/create";
import {RoomPage} from "./rooms/room";
import {ProfilePage} from "./profiles/profile";
import {ForgotPasswordPage} from "./forgot-password";
import {ResetPasswordPage} from "./reset-password";
import {FaqPage} from "./faq";
import {EditProjectPage} from "./rooms/edit";
import {PrivateRoute, PublicOnlyRoute} from "@shared/lib/routing";
import {SignInPage} from "./sign-in";
import {SignUpPage} from "./sign-up";

export const Routes: React.FC = () => (
  <Switch>
    <PrivateRoute path="/" component={HomePage} />
    <PublicOnlyRoute path="/sign-in" component={SignInPage} />
    <PublicOnlyRoute path="/sign-up" component={SignUpPage} />
    <PrivateRoute path="/chat/private/:partnerId" component={PrivateChatPage} />
    <PrivateRoute path="/chat/project/:projectId" component={ProjectChatPage} />
    <PrivateRoute path="/chat" component={NoChatPage} />
    <PrivateRoute path="/friends" component={FriendsPage} />
    <PrivateRoute path="/settings" component={SettingsPage} />
    <PrivateRoute path="/projects" component={RoomsPage} />
    <PrivateRoute path="/projects/create" component={CreateRoomPage} />
    <PrivateRoute path="/projects/:id/edit" component={EditProjectPage} />
    <PrivateRoute path="/projects/:id" component={RoomPage} />
    <PrivateRoute path="/profiles/:id" component={ProfilePage} />
    <PublicOnlyRoute path="/forgot-password" component={ForgotPasswordPage} />
    <PublicOnlyRoute
      path="/reset-password/:code"
      component={ResetPasswordPage}
    />
    <PrivateRoute path="/faq" component={FaqPage} />
  </Switch>
);
