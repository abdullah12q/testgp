// Re-export the hook (defined here) and provider (from context)
import { useContext } from "react";
import { SidebarContext } from "../contexts/sidebar-context";
import { SidebarProvider } from "../contexts/SidebarContext";

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export { SidebarProvider };
