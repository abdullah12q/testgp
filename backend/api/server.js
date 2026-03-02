// Vercel serverless entry point
// This file must live in an `api/` directory per Vercel's functions spec.
// It re-exports the Express app from the root server.js.
import app from "../server.js";

export default app;
