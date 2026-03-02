import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider, useSidebar } from "../hooks/useSidebar";
import { cn } from "../utils/cn";

function LayoutContent() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen font-sans bg-background text-text-primary selection:bg-primary selection:text-white">
      <Sidebar />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          "lg:ml-70", // Matching new expanded sidebar width
          isCollapsed && "lg:ml-20", // Matching collapsed width
        )}
      >
        <Navbar />

        <main className="p-6 mx-auto lg:p-10 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function RootPage() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
