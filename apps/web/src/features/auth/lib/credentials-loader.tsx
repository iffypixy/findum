import {useEffect} from "react";
import {useKeycloak} from "@react-keycloak/web";

import {api} from "@shared/api";
import {request} from "@shared/lib/request";

import {useAuthStore} from "../store";

export const CredentialsLoader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {keycloak, initialized} = useKeycloak();

  const store = useAuthStore((state) => state);

  useEffect(() => {
    if (initialized) {
      if (keycloak.authenticated) {
        const header = `Bearer ${keycloak.token}`;

        localStorage.setItem("token", header);

        request.defaults.headers["Authorization"] = header;

        if (!store.credentials) {
          api.getMe().then(({data}) => {
            store.setCredentials(data);
          });
        }
      } else {
        keycloak.login();
      }
    }
  }, [initialized, keycloak, store]);

  if (!initialized) return null;

  return <>{children}</>;
};
