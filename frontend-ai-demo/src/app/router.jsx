import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import RequireAuth from "./RequireAuth";
import RequireBackend from "./RequireBackend";
import DriveFolderPage from "../pages/DriveFolderPage";
import AuthPage from "../pages/AuthPage";
import NotFoundPage from "../pages/NotFoundPage";
import ServiceOfflinePage from "../pages/ServiceOfflinePage";

export const router = createBrowserRouter([
  { path: "/service-offline", element: <ServiceOfflinePage /> },

  {
    element: <RequireBackend />,
    children: [
      { path: "/login", element: <AuthPage mode="login" /> },
      { path: "/register", element: <AuthPage mode="register" /> },

      {
        path: "/",
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <DriveFolderPage /> },
              { path: "folder/:folder_id", element: <DriveFolderPage /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);