import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllProducts } from "../controllers/admin.controller.js";
import { getProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.use(protectRoute);

productRouter.get("/", getAllProducts);
productRouter.get("/:productId", getProduct);

export default productRouter;
