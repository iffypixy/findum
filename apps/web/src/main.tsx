import ReactDOM from "react-dom/client";
import * as Toast from "@radix-ui/react-toast";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {Provider} from "react-redux";

import {keycloak} from "@shared/lib/keycloak";
import {RobokassaLoader} from "@shared/lib/robokassa";
import {store} from "@shared/lib/store";
import {CredentialsLoader} from "@features/auth";

import {App} from "./app";

import "./index.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
      }}
    >
      <CredentialsLoader>
        <RobokassaLoader>
          <Toast.Provider swipeDirection="right">
            <Toast.Viewport className="fixed top-0 right-0 p-10" />

            <App />
          </Toast.Provider>
        </RobokassaLoader>
      </CredentialsLoader>
    </ReactKeycloakProvider>
  </Provider>,
);
