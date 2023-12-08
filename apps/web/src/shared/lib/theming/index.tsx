import {useEffect} from "react";
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

interface ThemeToggleProps {
  children?: React.ReactNode;
}

export const ThemeManager: React.FC<ThemeToggleProps> = ({children}) => {
  const theme = useThemingStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
};
