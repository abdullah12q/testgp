export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  imageUrl: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  user: string;
  clerkId: string;
  orderItems: OrderItem[];
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  };
  paymentResult: {
    id: string;
    status: string;
  };
  paymentMethod: "card" | "cod";
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  hasReviewed: boolean;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  _id: string;
  product: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string | User;
  orderId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  clerkId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

type SettingType = "link" | "toggle" | "action";

export interface SettingItem {
  id: string;
  icon: any;
  title: string;
  description: string;
  type: SettingType;
  value?: boolean;
  variant?: "default" | "danger";
}

export interface Section {
  title?: string;
  items: SettingItem[];
}

export interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string, label: string) => void;
  isBusy: boolean;
}

export interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface AddressFormModalProps {
  visible: boolean;
  initialData: Address | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address, paymentMethod: "card" | "cod") => void;
  isProcessing: boolean;
}

export interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CartItemProps {
  item: CartItem;
  isLoading: boolean;
  onUpdateQuantity: (id: string, qty: number, change: number) => void;
  onRemove: (id: string, name: string) => void;
}

export interface CreateReviewData {
  productId: string;
  orderId: string;
  rating: number;
}

export interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  productRatings: { [key: string]: number };
  onRatingChange: (productId: string, rating: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export interface FiltersModalProps {
  isModalVisible: boolean;
  handleCloseModal: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
}
