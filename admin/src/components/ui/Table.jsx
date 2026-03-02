import { cn } from "../../utils/cn";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export function Table({ className, children, ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-lg border border-border shadow-sm bg-surface">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead
      className={cn(
        "[&_tr]:border-b border-border bg-surface-hover/50",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-surface-hover/50 data-[state=selected]:bg-surface-hover",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className,
  children,
  sortable,
  direction,
  onSort,
  ...props
}) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-text-secondary [&:has([role=checkbox])]:pr-0",
        sortable && "cursor-pointer select-none hover:text-text-primary",
        className,
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="ml-1">
            {direction === "asc" && <ChevronUp className="h-3 w-3" />}
            {direction === "desc" && <ChevronDown className="h-3 w-3" />}
            {!direction && <ChevronsUpDown className="h-3 w-3 opacity-50" />}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0 text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
