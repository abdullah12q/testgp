import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ImageIcon,
  X,
  Upload,
  Loader2,
  DollarSign,
  Package,
} from "lucide-react";
import { createProduct, updateProduct } from "../utils/http";
import Modal from "./ui/Modal";
import { cn } from "../utils/cn";

export default function ProductModal({ productToEdit, closeModal }) {
  const queryClient = useQueryClient();
  const [imagePreviews, setImagePreviews] = useState(
    productToEdit?.images || [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: productToEdit?.name || "",
      category: productToEdit?.category || "",
      price: productToEdit?.price || "",
      stock: productToEdit?.stock || "",
      description: productToEdit?.description || "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    return () =>
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
  }, [imagePreviews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      productToEdit
        ? updateProduct({ id: productToEdit._id, formData: data })
        : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(productToEdit ? "Product updated" : "Product created");
      closeModal();
    },
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit = (formData) => {
    if (!productToEdit && selectedFiles.length === 0) {
      return toast.error("Please upload at least one image");
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    selectedFiles.forEach((file) => data.append("images", file));

    mutate(data);
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      title={productToEdit ? "Edit Product" : "Add New Product"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-secondary block">
            Product Images
          </label>
          <div className="relative border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/50 transition-colors bg-surface-hover/30 text-center group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-surface border border-border group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Upload className="w-6 h-6 text-text-tertiary group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  SVG, PNG, JPG or GIF (max. 3 images)
                </p>
              </div>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = [...selectedFiles];
                      newFiles.splice(index, 1);
                      setSelectedFiles(newFiles);
                      const newPreviews = [...imagePreviews];
                      newPreviews.splice(index, 1);
                      setImagePreviews(newPreviews);
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Product Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg bg-background border text-text-primary focus:ring-2 transition-all",
                errors.name
                  ? "border-error focus:ring-error/20"
                  : "border-border focus:border-primary/50 focus:ring-primary/20",
              )}
              placeholder="e.g. Premium Leather Bag"
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg bg-background border text-text-primary focus:ring-2 transition-all appearance-none",
                errors.category
                  ? "border-error focus:ring-error/20"
                  : "border-border focus:border-primary/50 focus:ring-primary/20",
              )}
            >
              <option value="">Select category...</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports">Sports</option>
            </select>
            {errors.category && (
              <p className="text-xs text-error">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: 0,
                })}
                className={cn(
                  "w-full pl-9 pr-4 py-2.5 rounded-lg bg-background border text-text-primary focus:ring-2 transition-all",
                  errors.price
                    ? "border-error focus:ring-error/20"
                    : "border-border focus:border-primary/50 focus:ring-primary/20",
                )}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="text-xs text-error">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Stock
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: 0,
                })}
                className={cn(
                  "w-full pl-9 pr-4 py-2.5 rounded-lg bg-background border text-text-primary focus:ring-2 transition-all",
                  errors.stock
                    ? "border-error focus:ring-error/20"
                    : "border-border focus:border-primary/50 focus:ring-primary/20",
                )}
                placeholder="0"
              />
            </div>
            {errors.stock && (
              <p className="text-xs text-error">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-background border text-text-primary focus:ring-2 transition-all min-h-25",
              errors.description
                ? "border-error focus:ring-error/20"
                : "border-border focus:border-primary/50 focus:ring-primary/20",
            )}
            placeholder="Describe your product..."
          />
          {errors.description && (
            <p className="text-xs text-error">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {productToEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
