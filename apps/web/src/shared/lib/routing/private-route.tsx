import {Redirect, Route, RouteProps} from "wouter";
import {useSelector} from "react-redux";

import {authModel} from "@features/auth";

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const isAuthenticated = useSelector(authModel.selectors.isAuthenticated);

  if (!isAuthenticated) return <Redirect to="/sign-in" />;

  return <Route {...props} />;
};
