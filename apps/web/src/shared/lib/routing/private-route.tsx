import {Redirect, Route, RouteProps} from "wouter";

import {useCredentials} from "@features/auth";

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const [{isAuthenticated}] = useCredentials();

  if (!isAuthenticated) return <Redirect to="/sign-in" />;

  return <Route {...props} />;
};
