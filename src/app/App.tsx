import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "../lib/store";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </ThemeProvider>
  );
}
