import {Route, Switch} from "wouter";

import {HomePage} from "./home";
import {SignInPage} from "./sign-in";
import {SignUpPage} from "./sign-up";
import {ChatPage} from "./chat";
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

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route path="/sign-in" component={SignInPage} />
    <Route path="/sign-up" component={SignUpPage} />
    <Route path="/chat" component={ChatPage} />
    <Route path="/friends" component={FriendsPage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/projects" component={RoomsPage} />
    <Route path="/projects/create" component={CreateRoomPage} />
    <Route path="/projects/:id/edit" component={EditProjectPage} />
    <Route path="/projects/:id" component={RoomPage} />
    <Route path="/profiles/:id" component={ProfilePage} />
    <Route path="/forgot-password" component={ForgotPasswordPage} />
    <Route path="/reset-password" component={ResetPasswordPage} />
    <Route path="/faq" component={FaqPage} />
  </Switch>
);
