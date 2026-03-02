import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../utils/cn";

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  className,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const variants = {
    right: { x: "100%" },
    left: { x: "-100%" },
    bottom: { y: "100%" },
  };

  const animate = {
    right: { x: 0 },
    left: { x: 0 },
    bottom: { y: 0 },
  };

  const positionClasses = {
    right: "right-0 top-0 h-full w-full max-w-md",
    left: "left-0 top-0 h-full w-full max-w-md",
    bottom: "bottom-0 left-0 w-full h-[80vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={variants[position]}
            animate={animate[position]}
            exit={variants[position]}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed z-50 bg-surface border-l border-border shadow-2xl flex flex-col",
              positionClasses[position],
              className,
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-surface sticky top-0 z-10">
              {title && (
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
