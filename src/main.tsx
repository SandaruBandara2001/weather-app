import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import AppAuthProvider from "./auth/AuthProvider";
import AppLayout from "./layouts/AppLayout";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./app.css";

const Home = React.lazy(() => import("./routes/Home"));
const City = React.lazy(() => import("./routes/City"));

const ProtectedHome = withAuthenticationRequired(Home, {
  onRedirecting: () => <div style={{ padding: 24 }}>Checking authentication…</div>,
});
const ProtectedCity = withAuthenticationRequired(City, {
  onRedirecting: () => <div style={{ padding: 24 }}>Checking authentication…</div>,
});

const router = createBrowserRouter([
  {
    element: <AppLayout />,           // ← unprotected layout (header always renders)
    children: [
      { path: "/", element: <ProtectedHome /> },
      { path: "/city/:id", element: <ProtectedCity /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppAuthProvider>
      <React.Suspense fallback={null}>
        <RouterProvider router={router} />
      </React.Suspense>
    </AppAuthProvider>
  </React.StrictMode>
);
