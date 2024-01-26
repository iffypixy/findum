import {PropsWithChildren, useEffect} from "react";
import {create} from "zustand";

type Theme = "light" | "dark";

interface ThemingStore {
  theme: Theme;
}

export const useThemingStore = create<ThemingStore>((set) => ({
  theme: "light",
  setTheme: (theme: Theme) => set({theme}),
  toggleTheme: () =>
    set(({theme}) => {
      const toggled: Theme = theme === "light" ? "dark" : "light";

      return {theme: toggled};
    }),
}));

export const ThemeManager: React.FC<PropsWithChildren> = ({children}) => {
  const theme = useThemingStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
};
