import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "../../utils/cn";

export default function Dropdown({
  trigger,
  items = [],
  align = "right",
  className = "",
  width = "w-56",
}) {
  const alignmentClasses = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            "absolute z-50 mt-2 rounded-xl",
            "bg-surface border border-border shadow-xl shadow-black/20",
            "focus:outline-none overflow-hidden",
            width,
            alignmentClasses[align],
            className,
          )}
        >
          <div className="p-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg transition-colors",
                      active
                        ? "bg-surface-hover text-text-primary"
                        : "text-text-secondary",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      item.danger &&
                        "text-error hover:bg-error/10 hover:text-error",
                    )}
                  >
                    {item.icon && (
                      <span className="shrink-0 w-4 h-4">{item.icon}</span>
                    )}
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
