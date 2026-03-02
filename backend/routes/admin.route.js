import { Router } from "express";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
} from "../controllers/admin.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const adminRouter = Router();

adminRouter.use(protectRoute, adminOnly);

adminRouter.post("/products", upload.array("images", 3), createProduct);
adminRouter.get("/products", getAllProducts);
adminRouter.put("/products/:id", upload.array("images", 3), updateProduct);
adminRouter.delete("/products/:id", deleteProduct);

adminRouter.get("/customers", getAllCustomers);

adminRouter.get("/stats", getDashboardStats);

adminRouter.get("/orders", getAllOrders);
adminRouter.patch("/orders/:orderId/status", updateOrderStatus);

export default adminRouter;
