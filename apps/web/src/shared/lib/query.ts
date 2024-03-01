import {QueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import i18n from "i18next";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryOnMount: false,
    },
    mutations: {
      onError: () => {
        toast.error(i18n.t("common.toasts.something-went-wrong"));
      },
    },
  },
});
