import { ClipboardList, Home, ShoppingBag, Users } from "lucide-react";

export const NAVIGATION = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Products",
    path: "/products",
    icon: ShoppingBag,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
];
