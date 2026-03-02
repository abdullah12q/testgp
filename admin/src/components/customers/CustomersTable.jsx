import { formatDate } from "../../utils/helpers";
import { Eye, Mail, MapPin, ShoppingBag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

export default function CustomersTable({ customers, onViewCustomer }) {
  return (
    <div className="overflow-hidden border rounded-xl border-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-surface-hover/50">
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">Addresses</TableHead>
            <TableHead className="hidden lg:table-cell">Wishlist</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer._id}
              className="cursor-pointer group"
              onClick={() => onViewCustomer && onViewCustomer(customer)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 overflow-hidden border rounded-full border-border bg-surface-hover">
                    <img
                      src={
                        customer.imageUrl ||
                        `https://ui-avatars.com/api/?name=${customer.name}&background=random`
                      }
                      alt={customer.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {customer.name}
                    </p>
                    <p className="text-xs text-text-tertiary md:hidden">
                      {customer.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              </TableCell>

              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">
                    {customer.addresses?.length || 0} address(es)
                  </span>
                </div>
              </TableCell>

              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-2 text-text-secondary">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="text-sm">
                    {customer.wishlist?.length || 0} items
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-sm text-text-tertiary">
                  {formatDate(customer.createdAt)}
                </span>
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onViewCustomer && onViewCustomer(customer)}
                  className="p-2 transition-colors duration-200 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
