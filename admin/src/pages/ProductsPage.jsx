import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query"; // Added useMutation/Client for direct delete if needed, but Card handles it.
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { getAllProducts, deleteProduct } from "../utils/http"; // Ensure deleteProduct is imported if we move delete logic here or pass it down via Card/Table
import ProductModal from "../components/ProductModal";
import { useDebounce } from "../hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Dropdown from "../components/ui/Dropdown";
import toast from "react-hot-toast";
import { queryClient } from "../utils/http"; // Direct import if needed or use hook

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery),
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, debouncedSearch, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  function handleCreate() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  const getStockVariant = (stock) => {
    if (stock === 0) return "error";
    if (stock < 10) return "warning";
    return "success";
  };
  const getStockLabel = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Products
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your catalog and inventory
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="search"
            placeholder="Search products..."
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

      {/* Table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-20">Image</TableHead>
              <TableHead
                sortable
                direction={
                  sortConfig.key === "name" ? sortConfig.direction : null
                }
                onSort={() => handleSort("name")}
              >
                Name
              </TableHead>
              <TableHead
                sortable
                direction={
                  sortConfig.key === "category" ? sortConfig.direction : null
                }
                onSort={() => handleSort("category")}
              >
                Category
              </TableHead>
              <TableHead
                sortable
                direction={
                  sortConfig.key === "price" ? sortConfig.direction : null
                }
                onSort={() => handleSort("price")}
              >
                Price
              </TableHead>
              <TableHead
                sortable
                direction={
                  sortConfig.key === "stock" ? sortConfig.direction : null
                }
                onSort={() => handleSort("stock")}
              >
                Stock
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="w-12 h-12 rounded bg-surface-hover animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-surface-hover rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-surface-hover rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-surface-hover rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 bg-surface-hover rounded animate-pulse" />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-text-secondary">
                    <Search className="w-10 h-10 mb-2 text-text-tertiary opacity-50" />
                    <p>No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id} className="group">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface-hover">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-text-primary">
                      {product.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-hover text-xs font-medium text-text-secondary">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStockVariant(product.stock)}>
                      {getStockLabel(product.stock)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && (
        <ProductModal
          productToEdit={editingProduct}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
