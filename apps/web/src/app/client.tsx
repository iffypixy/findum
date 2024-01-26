import {Routes} from "@pages/routes";
import {ThemeManager} from "@shared/lib/theming";

export const App = () => (
  <ThemeManager>
    <Routes />
  </ThemeManager>
);
