import {Suspense} from "react";
import {createRoot} from "react-dom/client";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

import {App} from "@app/client";
import {queryClient} from "@shared/lib/query";

import "@shared/lib/i18n";

import "@app/styles/index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen />

    <Suspense>
      <App />
    </Suspense>
  </QueryClientProvider>,
);
