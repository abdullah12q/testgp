import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteProduct, queryClient } from "../../utils/http";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import Badge from "../ui/Badge";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";

export default function ProductCard({ product, handleEdit }) {
  const { mutate: deleteProductMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const getStockBadge = (stock) => {
    if (stock === 0) return { variant: "error", text: "Out of Stock" };
    if (stock < 10) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  const stockStatus = getStockBadge(product.stock);

  const dropdownItems = [
    {
      label: "Edit Product",
      icon: <Pencil className="w-4 h-4" />,
      onClick: () => handleEdit(product),
    },
    {
      label: "Delete Product",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => deleteProductMutation(product._id),
      danger: true,
      disabled: isDeleting,
    },
  ];

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 hover:shadow-xl hover:border-border-light transition-all duration-200">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="shrink-0">
          <div className="h-20 w-20 rounded-xl overflow-hidden ring-1 ring-border">
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary truncate">
                {product.name}
              </h3>
              <p className="text-sm text-text-secondary mt-0.5">
                {product.category}
              </p>
            </div>

            {/* Actions Dropdown */}
            <Dropdown
              trigger={
                <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors duration-200">
                  <MoreVertical className="h-5 w-5 text-text-secondary" />
                </button>
              }
              items={dropdownItems}
            />
          </div>

          {/* Price, Stock, and Status */}
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-xs text-text-tertiary mb-0.5">Price</p>
              <p className="text-lg font-bold text-primary">${product.price}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-text-tertiary mb-0.5">Stock</p>
              <p className="text-lg font-semibold text-text-primary">
                {product.stock}
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
