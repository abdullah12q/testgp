import { motion as Motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="h-16 w-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-text-tertiary" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-text-secondary mb-6 max-w-md">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
