export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "#10B981";
    case "shipped":
      return "#3B82F6";
    case "processing":
      return "#8B5CF6";
    case "pending":
      return "#F59E0B";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
}
