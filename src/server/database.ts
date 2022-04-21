import { SQLiteDatabase } from "../lib/SQLiteDatabase";
import { IDatabase } from "./database-types";
import { join } from "path";

/**
 * CONNECTION TO MAIN DATABASE
 * [!] Need to await call db.open() else any queries will error
 * When process is exited, kernel should clean up all file resources (including this connection)
*/
export const db = new SQLiteDatabase(join(__dirname, '../../database.sqlite'));

/** Get user with given username and password */
export async function login(email: string, pwd: string) {
  return await db.get<IDatabase.Accounts>("SELECT * FROM Accounts WHERE Email=? AND Password=?", [email, pwd]);
}

/** Upgrade field 'Pro' for a user */
export async function setAccountPro(id: number, pro: number) {
  return await db.get<IDatabase.Accounts>("UPDATE Accounts SET Pro=? WHERE ID=?", [pro, id]);
}

/**
 * Attempt to create an account
 * - 0 -> OK
 * - 1 -> missing data
 * - 2 -> email already exists
*/
export async function createAccount(name: string, email: string, password: string) {
  if (name.length === 0 || email.length === 0 || password.length === 0) return 1;
  // Does email already exist?
  let user = await db.get<IDatabase.Accounts>("SELECT * FROM Accounts WHERE email=?", [email]);
  if (user) return 2;
  await db.get("INSERT INTO Accounts (Name, Email, Password) VALUES (?, ?, ?)", [name, email, password]);
  return 0;
}

export async function deleteAccount(id: number) {
  db.all("DELETE FROM Accounts WHERE ID=?", [id]);
}