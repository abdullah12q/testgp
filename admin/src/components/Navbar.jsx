import { UserButton } from "@clerk/clerk-react";
import { Menu, Bell, Search, Command } from "lucide-react";
import { useSidebar } from "../hooks/useSidebar";
import { cn } from "../utils/cn";

export default function Navbar() {
  const { toggleMobile } = useSidebar();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-20",
        "bg-surface/80 backdrop-blur-md border-b border-border/50",
        "transition-all duration-300",
      )}
    >
      <div className="flex items-center justify-between h-full px-6 lg:px-10">
        {/* Left: Mobile Toggle & Breadcrumbs (Placeholder) */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobile}
            className="p-2 -ml-2 rounded-lg hover:bg-surface-hover lg:hidden text-text-secondary"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-2xl px-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className={cn(
                "w-full pl-12 pr-12 py-2.5 rounded-full",
                "bg-surface-hover/50 border border-border/50",
                "text-sm text-text-primary placeholder:text-text-tertiary",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                "transition-all duration-200",
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
              <span className="text-xs text-text-tertiary px-1.5 py-0.5 rounded border border-border bg-surface">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface" />
          </button>

          <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block" />

          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-9 h-9 ring-2 ring-border hover:ring-primary/50 transition-all",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
