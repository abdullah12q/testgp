import clsx from "clsx";

export default function SkeletonLoader({
  variant = "default",
  className = "",
  count = 1,
}) {
  const variants = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-2xl",
    stat: "h-36 w-full rounded-2xl",
    table: "h-12 w-full rounded-lg",
    circle: "h-12 w-12 rounded-full",
    text: "h-4 w-3/4",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={clsx("skeleton", variants[variant], className)}
        />
      ))}
    </>
  );
}
