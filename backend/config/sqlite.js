// ⚠️  INTENTIONALLY VULNERABLE — FOR EDUCATIONAL/SECURITY-DEMO PURPOSES ONLY
// This SQLite instance mirrors a simplified "users" table and is used to
// demonstrate classic SQL Injection attacks for the graduation project.

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "vulnerable.db");

const db = new Database(DB_PATH);

// Create a demo users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    email   TEXT    NOT NULL UNIQUE,
    password TEXT   NOT NULL,
    role    TEXT    NOT NULL DEFAULT 'user',
    secret  TEXT
  );
`);

// Seed demo accounts (plain-text passwords — another intentional weakness)
const seed = db.prepare(
  "INSERT OR IGNORE INTO users (email, password, role, secret) VALUES (?, ?, ?, ?)",
);
seed.run(
  "admin@shop.com",
  "Admin@1234",
  "admin",
  "FLAG{sql_injection_success}",
);
seed.run("alice@shop.com", "Password1!", "user", "alice_secret_token");
seed.run("bob@shop.com", "qwerty123", "user", "bob_secret_token");

export default db;
