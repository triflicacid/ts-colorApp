import { SQLiteDatabase } from "../lib/SQLiteDatabase";

/**
 * CONNECTION TO MAIN DATABASE
 * [!] Need to await call db.open() else any queries will error
 * When process is exited, kernel should clean up all file resources (including this connection)
*/
export const db = new SQLiteDatabase('dist/data/database.db');