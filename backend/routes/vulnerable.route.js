// ⚠️  INTENTIONALLY VULNERABLE ROUTES — FOR EDUCATIONAL PURPOSES ONLY
import { Router } from "express";
import {
  sqlLogin,
  sqlSearchUsers,
  sqlUpdatePassword,
  noSqlSearchProducts,
  noSqlUserLookup,
} from "../controllers/vulnerable.controller.js";

const vulnerableRouter = Router();

// --- SQL Injection endpoints (SQLite) ---
// POST /api/vulnerable/login
//   Body: { email, password }
//   Inject: email = ' OR '1'='1
vulnerableRouter.post("/login", sqlLogin);

// GET  /api/vulnerable/users/search?email=<payload>
//   Inject: ?email=' OR '1'='1--
vulnerableRouter.get("/users/search", sqlSearchUsers);

// PUT  /api/vulnerable/users/password
//   Body: { email, newPassword }
//   Second-order: email = admin@shop.com'--
vulnerableRouter.put("/users/password", sqlUpdatePassword);

// --- NoSQL Injection endpoints (MongoDB) ---
// POST /api/vulnerable/products/search
//   Body: { "name": { "$gt": "" } }  ← dumps all products
vulnerableRouter.post("/products/search", noSqlSearchProducts);

// POST /api/vulnerable/users/lookup
//   Body: { "email": { "$gt": "" } }  ← returns first user without knowing email
vulnerableRouter.post("/users/lookup", noSqlUserLookup);

export default vulnerableRouter;
