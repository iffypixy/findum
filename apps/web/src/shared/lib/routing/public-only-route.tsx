import {Redirect, Route, RouteProps} from "wouter";
import {useSelector} from "react-redux";

import {authModel} from "@features/auth";

export const PublicOnlyRoute: React.FC<RouteProps> = (props) => {
  const isAuthenticated = useSelector(authModel.selectors.isAuthenticated);

  if (isAuthenticated) return <Redirect to="/" />;

  return <Route {...props} />;
};
