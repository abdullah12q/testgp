import { Router } from "express";
import {
  addAddress,
  addToWishlist,
  deleteAddress,
  getAddresses,
  getWishlist,
  removeFromWishlist,
  updateAddress,
  updatePushToken,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.use(protectRoute);

userRouter.post("/addresses", addAddress);
userRouter.get("/addresses", getAddresses);
userRouter.put("/addresses/:addressId", updateAddress);
userRouter.delete("/addresses/:addressId", deleteAddress);

userRouter.post("/wishlist/:productId", addToWishlist);
userRouter.get("/wishlist", getWishlist);
userRouter.delete("/wishlist/:productId", removeFromWishlist);

userRouter.put("/push-token", updatePushToken);

export default userRouter;
