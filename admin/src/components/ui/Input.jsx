import clsx from "clsx";

export default function Input({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={clsx("relative", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          "w-full px-4 py-2.5 rounded-lg",
          "bg-surface border border-border",
          "text-text-primary placeholder:text-text-tertiary",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-(--color-error) focus:ring-(--color-error)",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-(--color-error)">{error}</p>}
    </div>
  );
}
