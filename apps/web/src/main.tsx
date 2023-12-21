import ReactDOM from "react-dom/client";
import * as Toast from "@radix-ui/react-toast";
import {ReactKeycloakProvider} from "@react-keycloak/web";

import {keycloak} from "@shared/lib/keycloak";
import {RobokassaLoader} from "@shared/lib/robokassa";

import {App} from "./app";

import "./index.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <RobokassaLoader>
      <Toast.Provider swipeDirection="right">
        <Toast.Viewport className="fixed top-0 right-0 p-10" />

        <App />
      </Toast.Provider>
    </RobokassaLoader>
  </ReactKeycloakProvider>,
);
