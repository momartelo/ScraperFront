import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter.jsx";
import ReactDOM from "react-dom/client";
import "./main.css";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider.jsx";
import { ResponsiveProvider } from "./providers/ResponsiveContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ResponsiveProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ResponsiveProvider>
  </ThemeProvider>
);
