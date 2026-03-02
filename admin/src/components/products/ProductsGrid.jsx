import ProductCard from "./ProductCard";
import { motion as Motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../utils/animations";

export default function ProductsGrid({ products, handleEdit }) {
  return (
    <Motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      {products?.map((product) => (
        <Motion.div key={product._id} variants={staggerItem}>
          <ProductCard product={product} handleEdit={handleEdit} />
        </Motion.div>
      ))}
    </Motion.div>
  );
}
