import { useUser } from "@clerk/clerk-react";
import { ChevronLeft, ChevronRight, ShoppingBag, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { NAVIGATION } from "../utils/constants";
import { useSidebar } from "../hooks/useSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

export default function Sidebar() {
  const { user, isLoaded } = useUser();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } =
    useSidebar();
  const location = useLocation();

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 h-screen z-50",
          "hidden lg:flex flex-col",
          "bg-surface/95 backdrop-blur-xl border-r border-border",
          "shadow-2xl",
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent whitespace-nowrap"
                >
                  TapCart
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <ul className="space-y-2">
            {NAVIGATION.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}

                    <Icon
                      className={cn(
                        "w-6 h-6 shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-text-secondary group-hover:text-text-primary",
                      )}
                    />

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-border/50 bg-surface-hover/30">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center",
            )}
          >
            {isLoaded && user && (
              <>
                <div className="relative shrink-0">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-surface" />
                </div>

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 min-w-0 overflow-hidden"
                    >
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-text-tertiary truncate">
                        Admin
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-24 z-50 p-1.5 rounded-full bg-border text-text-secondary hover:bg-primary hover:text-white transition-colors shadow-lg border border-surface"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-surface/95 backdrop-blur-xl border-r border-border lg:hidden flex flex-col"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-text-primary">
                  TapCart
                </span>
              </div>
              <button
                onClick={closeMobile}
                className="p-2 -mr-2 text-text-secondary"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                {NAVIGATION.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={closeMobile}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-6 h-6",
                            isActive ? "text-primary" : "text-text-secondary",
                          )}
                        />
                        {item.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
