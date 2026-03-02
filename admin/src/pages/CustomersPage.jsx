import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomers, getAllOrders } from "../utils/http";
import NoCustomers from "../components/customers/NoCustomers"; // Assuming this exists or generic
import CustomersTable from "../components/customers/CustomersTable";
import Drawer from "../components/ui/Drawer";
import CustomerDetails from "../components/customers/CustomerDetails";
import { Search, Filter } from "lucide-react";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch Customers
  const { data: customersData = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
  });

  // Fetch Orders (for stats)
  const { data: ordersData = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const customers = customersData?.customers || [];
  const orders = ordersData?.orders || [];

  // Filter
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Customers</h1>
        <p className="text-text-secondary">
          Manage your customer base and view their activity
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="search"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-tertiary"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-background border border-border rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Customers Table */}
      <div className="min-h-100">
        {isLoadingCustomers ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-surface-hover rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl">
            <p className="text-text-secondary">No customers found</p>
          </div>
        ) : (
          <CustomersTable
            customers={filteredCustomers}
            onViewCustomer={handleViewCustomer}
          />
        )}
      </div>

      {/* Customer Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Customer Profile"
      >
        <CustomerDetails customer={selectedCustomer} orders={orders} />
      </Drawer>
    </div>
  );
}
