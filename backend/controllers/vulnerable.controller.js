// ============================================================
// ⚠️  INTENTIONALLY VULNERABLE CONTROLLER
//     FOR EDUCATIONAL / SECURITY-DEMO PURPOSES ONLY
//     Every function here contains a deliberate security flaw.
// ============================================================

import db from "../config/sqlite.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

// ---------------------------------------------------------------
// 1. CLASSIC SQL INJECTION — Login endpoint
//    User input is concatenated directly into the SQL query string.
//    Attack example:
//      email:    ' OR '1'='1
//      password: anything
//    → returns the first row from the DB (admin) without knowing password.
//
//    Data-exfiltration example:
//      email:    ' UNION SELECT 1,email,password,role,secret FROM users--
//      password: x
// ---------------------------------------------------------------
export function sqlLogin(req, res) {
  try {
    const { email, password } = req.body;

    // 🔴 VULNERABLE: direct string concatenation — NO parameterization
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

    console.log("[SQLI DEBUG] Executing query:", query);

    const user = db.prepare(query).get();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        secret: user.secret, // 🔴 also exposing the secret column
      },
    });
  } catch (error) {
    // 🔴 VULNERABLE: full error + raw query returned to client (information disclosure)
    return res.status(500).json({
      message: "Database error",
      error: error.message,
      hint: "Query failed — try adjusting your input syntax",
    });
  }
}

// ---------------------------------------------------------------
// 2. CLASSIC SQL INJECTION — Search users by email
//    Attack example:
//      GET /api/vulnerable/users/search?email=' OR '1'='1
//    → dumps all users.
//
//    Comment-based bypass:
//      GET /api/vulnerable/users/search?email=admin@shop.com'--
// ---------------------------------------------------------------
export function sqlSearchUsers(req, res) {
  try {
    const { email } = req.query;

    // 🔴 VULNERABLE: query param injected directly
    const query = `SELECT id, email, role, secret FROM users WHERE email LIKE '%${email}%'`;

    console.log("[SQLI DEBUG] Executing query:", query);

    const rows = db.prepare(query).all();

    return res.status(200).json({ results: rows });
  } catch (error) {
    return res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
}

// ---------------------------------------------------------------
// 3. NOSQL INJECTION — MongoDB product search
//    Because Express parses JSON bodies, an attacker can pass
//    MongoDB query operators directly as the search value.
//
//    Normal request:
//      POST /api/vulnerable/products/search
//      { "name": "shoes" }
//
//    Injection attack — bypass name match, return ALL products:
//      { "name": { "$gt": "" } }
//
//    $where injection (JS execution inside mongo):
//      { "name": { "$where": "this.price < 999999" } }
// ---------------------------------------------------------------
export async function noSqlSearchProducts(req, res) {
  try {
    // 🔴 VULNERABLE: user-supplied object used directly as Mongoose filter
    const { name, category, minPrice, maxPrice } = req.body;

    const filter = {};

    // 🔴 No type checking — attacker can pass { "$gt": "" } and bypass
    if (name !== undefined) filter.name = name;
    if (category !== undefined) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    console.log("[NOSQLI DEBUG] Filter:", JSON.stringify(filter));

    const products = await Product.find(filter);

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
}

// ---------------------------------------------------------------
// 4. NOSQL INJECTION — MongoDB user lookup (Authentication bypass)
//    Attacker sends:
//      POST /api/vulnerable/users/login
//      { "email": { "$gt": "" }, "clerkId": { "$gt": "" } }
//    → Mongoose matches the first document, bypassing exact-match auth.
// ---------------------------------------------------------------
export async function noSqlUserLookup(req, res) {
  try {
    // 🔴 VULNERABLE: whole req.body spreads directly into MongoDB find()
    const user = await User.findOne(req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        clerkId: user.clerkId, // 🔴 sensitive field exposed
        stripeCustomerId: user.stripeCustomerId, // 🔴 sensitive
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
}

// ---------------------------------------------------------------
// 5. SECOND-ORDER SQL INJECTION — Update user password
//    The stored email (which could contain SQL) is used in a later
//    query without sanitization.
//    Step 1: Register with email:  hacker@x.com' --
//    Step 2: That stored email is then used in a raw UPDATE query.
// ---------------------------------------------------------------
export function sqlUpdatePassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    // 🔴 VULNERABLE: stored value re-used in a raw SQL string
    const query = `UPDATE users SET password = '${newPassword}' WHERE email = '${email}'`;

    console.log("[SQLI DEBUG] Executing query:", query);

    db.prepare(query).run();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
}
