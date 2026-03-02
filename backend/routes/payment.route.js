import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPaymentIntent,
  handleWebhook,
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create-intent", protectRoute, createPaymentIntent);

paymentRouter.post("/webhook", handleWebhook);

export default paymentRouter;
