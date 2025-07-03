import { beforeEach, afterEach } from "vitest";
import { closeDatabase } from "../src/db-client";

// Clean up database connections after each test
afterEach(async () => {
  await closeDatabase();
});

// Reset database state before each test
beforeEach(async () => {
  // Database will be re-initialized with in-memory database for each test
});
