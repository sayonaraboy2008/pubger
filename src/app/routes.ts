import { createBrowserRouter } from "react-router";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import TournamentPage from "./pages/TournamentPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTournamentEdit from "./pages/admin/AdminTournamentEdit";
import PointsCalculator from "./pages/admin/PointsCalculator";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "tournament/:id", Component: TournamentPage },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminLogin },
      { path: "dashboard", Component: AdminDashboard },
      { path: "tournament/:id", Component: AdminTournamentEdit },
      { path: "calculator", Component: PointsCalculator },
    ],
  },
]);
