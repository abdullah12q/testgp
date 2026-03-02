import { Loader2Icon } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2Icon className="size-12 animate-spin" />
    </div>
  );
}
