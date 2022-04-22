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
  await db.all("DELETE FROM Accounts WHERE ID=?", [id]);
}

/** Get list of all saved colors */
export async function getSavedColors(accountID: number) {
  return await db.all<IDatabase.Colors>("SELECT * FROM Colors WHERE AccountID=?", [accountID]);
}

export async function saveColor(accountID: number, hex: string) {
  hex = hex.toLowerCase();
  await db.get<IDatabase.Colors>("INSERT INTO Colors (AccountID, Name, Hex) VALUES (?, ?, ?)", [accountID, hex, hex]);
}

export async function removeAllColors(accountID: number, hex: string) {
  await db.all("DELETE FROM Colors WHERE AccountID=? AND Hex=?", [accountID, hex]);
}

export async function removeColor(colorID: number) {
  await db.get("DELETE FROM Colors WHERE ID=?", [colorID]);
}

export async function renameColor(colorID: number, name: string) {
  await db.get("UPDATE Colors SET Name=? WHERE ID=?", [name, colorID]);
}