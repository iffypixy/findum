import {useEffect} from "react";
import {Redirect, Route, RouteProps} from "wouter";
import {useKeycloak} from "@react-keycloak/web";

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const {initialized, keycloak} = useKeycloak();

  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        keycloak.login();
      }
    }
  }, [initialized, keycloak]);

  if (!initialized) return null;

  if (!keycloak.authenticated) return <Redirect to="/sign-in" />;

  return <Route {...props} />;
};
