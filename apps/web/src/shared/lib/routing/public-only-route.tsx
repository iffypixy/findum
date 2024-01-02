import {useEffect} from "react";
import {Redirect, Route, RouteProps} from "wouter";
import {useKeycloak} from "@react-keycloak/web";
import {useSelector} from "react-redux";

import {authModel} from "@features/auth";

export const PublicOnlyRoute: React.FC<RouteProps> = (props) => {
  const {initialized, keycloak} = useKeycloak();

  const authenticated = useSelector(authModel.selectors.authenticated);

  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        keycloak.login();
      }
    }
  }, [initialized, keycloak]);

  if (!initialized) return null;

  if (keycloak.authenticated && authenticated) return <Redirect to="/" />;

  return <Route {...props} />;
};
