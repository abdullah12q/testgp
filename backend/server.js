import express from "express";
import fs from "fs";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import { serve } from "inngest/express";

import connectDB from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";

import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import reviewRouter from "./routes/review.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import paymentRouter from "./routes/payment.route.js";
import vulnerableRouter from "./routes/vulnerable.route.js"; // ⚠️ intentionally vulnerable

import "dotenv/config.js";

const app = express();

// special handling: Stripe webhook needs raw body BEFORE any body parsing middleware
// apply raw body parser conditionally only to webhook endpoint
app.use(
  "/api/payment",
  (req, res, next) => {
    if (req.originalUrl === "/api/payment/webhook") {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json()(req, res, next); // parse json for non-webhook routes
    }
  },
  paymentRouter,
);

app.use(express.json());
app.use(clerkMiddleware()); //adds auth object to req => req.auth
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

// ⚠️  VULNERABLE ROUTES — SQL & NoSQL injection demo (no auth guard)
app.use("/api/vulnerable", vulnerableRouter);

// routes
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

if (process.env.NODE_ENV === "production") {
  const rootPublic = path.join(process.cwd(), "public");
  const nestedPublic = path.join(process.cwd(), "backend", "public");

  let publicPath = rootPublic;

  if (fs.existsSync(nestedPublic)) {
    publicPath = nestedPublic;
  }

  app.use(express.static(publicPath));

  app.get(/.*/, (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }

    const indexPath = path.join(publicPath, "index.html");

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // for tracing deployment error
      res.status(500).send(`
        <h1>Deployment Error</h1>
        <p>Could not find <code>index.html</code></p>
        <p><b>Checked Path 1:</b> ${rootPublic} (Exists: ${fs.existsSync(rootPublic)})</p>
        <p><b>Checked Path 2:</b> ${nestedPublic} (Exists: ${fs.existsSync(nestedPublic)})</p>
        <p><b>Final Selection:</b> ${publicPath}</p>
        <p><b>Files in 'backend' folder:</b> ${fs.existsSync(path.join(process.cwd(), "backend")) ? JSON.stringify(fs.readdirSync(path.join(process.cwd(), "backend"))) : "backend folder missing"}</p>
      `);
    }
  });
}

connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
