import {Redirect, Route, RouteProps} from "wouter";

import {useCredentials} from "@features/auth";

export const PublicOnlyRoute: React.FC<RouteProps> = (props) => {
  const [{isAuthenticated}] = useCredentials();

  if (isAuthenticated) return <Redirect to="/" />;

  return <Route {...props} />;
};
