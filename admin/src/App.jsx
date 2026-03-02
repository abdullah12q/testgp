import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./utils/http";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { ShieldAlert, LogOut } from "lucide-react";

import RootPage from "./pages/RootPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";

function AccessDenied() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center">
      <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-6 animate-pulse">
        <ShieldAlert className="w-12 h-12 text-error" />
      </div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Access Denied
      </h1>
      <p className="text-text-secondary max-w-md mb-8">
        You do not have permission to view the administrative dashboard. <br />
        Please sign in with an administrator account.
      </p>
      <button
        onClick={() => signOut({ redirectUrl: "/login" })}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        Sign in with a different account
      </button>
    </div>
  );
}

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  if (!isLoaded || !isUserLoaded) return <LoadingSpinner />;

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  const isUserAdmin =
    isSignedIn && user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isUserAdmin ? <Navigate to="/dashboard" /> : <LoginPage />,
    },
    {
      path: "/",
      element: isSignedIn ? (
        isUserAdmin ? (
          <RootPage />
        ) : (
          <AccessDenied />
        )
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        { index: true, element: <Navigate to="/dashboard" /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "products", element: <ProductsPage /> },
        { path: "orders", element: <OrdersPage /> },
        { path: "customers", element: <CustomersPage /> },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "#18181b",
            color: "#e4e4e7",
            border: "1px solid #3f3f46",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
