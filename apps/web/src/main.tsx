import {createRoot} from "react-dom/client";

import {App} from "@app/client";

import "@shared/lib/i18n";

import "@app/styles/index.css";

const root = document.getElementById("root")!;

createRoot(root).render(<App />);
