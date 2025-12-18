/**
 * Drizzle + better-sqlite3 connection for a local SQLite DB file.
 *
 * Exports:
 * - `db` : Drizzle instance you can use across the server codebase
 * - `sqlite` : the underlying better-sqlite3 Database instance (for low-level ops / closing)
 *
 * Notes:
 * - This file expects the database file at `<project-root>/database/pemd.sqlite`.
 * - Ensure you have `better-sqlite3` and `drizzle-orm` installed:
 *     npm install better-sqlite3 drizzle-orm
 *
 * If you run the project where `process.cwd()` is not the repository root, adjust the path resolution accordingly.
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const DB_DIR = path.resolve(process.cwd(), 'database');
const DB_FILE = 'pemd.sqlite';
const DB_PATH = path.join(DB_DIR, DB_FILE);

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create / open the SQLite database using better-sqlite3
// `fileMustExist: false` will create the file if it doesn't already exist.
const sqlite = new Database(DB_PATH, { fileMustExist: false });

// Create the Drizzle instance from the better-sqlite3 connection
export const db = drizzle(sqlite);

// Export the raw connection for tasks like graceful shutdown or advanced sqlite operations
export { sqlite };

/**
 * Convenience: close underlying sqlite connection.
 * Call this during process shutdown if you want an explicit close.
 */
export function closeConnection() {
  try {
    sqlite.close();
  } catch (err) {
    console.warn('Error closing sqlite connection', err);
  }
}
