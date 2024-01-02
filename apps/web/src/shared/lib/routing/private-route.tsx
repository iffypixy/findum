import {Route, RouteProps} from "wouter";
import {useKeycloak} from "@react-keycloak/web";
import {useSelector} from "react-redux";

import {authModel} from "@features/auth";

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const {keycloak} = useKeycloak();

  const authenticated = useSelector(authModel.selectors.authenticated);

  console.log(authenticated);

  if (!keycloak.authenticated) {
    window.location.href = keycloak.createLoginUrl();
    return null;
  }

  return <Route {...props} />;
};
