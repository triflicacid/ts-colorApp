import sqlite3 from 'sqlite3';
sqlite3.verbose();

export class SQLiteDatabase {
  private _path: string; // Path to .db fle
  private _isOpen: boolean = false; // Is a connection established and open?
  private _db: sqlite3.Database | undefined; // SQLite Database

  /** Constructor opens the database at file */
  constructor(path: string) {
    this._path = path;
  }

  public get path() { return this._path; }

  /** Are we connected to the database? */
  public isOpen() { return this._isOpen; }

  /** Open connection to database */
  public async open() {
    if (!this._isOpen) {
      try {
        this._db = await open(this._path);
        this._isOpen = true;
      } catch (e) {
        return this._error(e as Error);
      }
    }
  }

  /** Run a query */
  public async run(query: string): Promise<void> {
    if (this._isOpen) {
      try {
        await run(<sqlite3.Database>this._db, query);
      } catch (e) {
        return this._error(e as Error);
      }
    } else {
      return this._error(new SQLiteDatabaseError('running (class)', 'Database is not open'));
    }
  }

  /** Get array of all rows back from query */
  public async all<T>(query: string, params: any[] = []): Promise<T[]> {
    if (this._isOpen) {
      try {
        return await all(<sqlite3.Database>this._db, query, params);
      } catch (e) {
        return this._error(e as Error);
      }
    } else {
      return this._error(new SQLiteDatabaseError('read:all (class)', 'Database is not open'));
    }
  }

  /** Get first row matching query */
  public async get<T>(query: string, params: any[] = []): Promise<T> {
    if (this._isOpen) {
      try {
        return await get(<sqlite3.Database>this._db, query, params);
      } catch (e) {
        return this._error(e as Error);
      }
    } else {
      return this._error(new SQLiteDatabaseError('read:get (class)', 'Database is not open'));
    }
  }

  /** Loop through each row matching query */
  public async each<T>(query: string, callback: (row: T, n: number) => void, params: any[] = []): Promise<number> {
    if (this._isOpen) {
      try {
        return await each(<sqlite3.Database>this._db, query, params, callback);
      } catch (e) {
        return this._error(e as Error);
      }
    } else {
      return this._error(new SQLiteDatabaseError('read:each (class)', 'Database is not open'));
    }
  }

  /** Close database connection */
  public async close(): Promise<void> {
    if (this._isOpen) {
      await close(<sqlite3.Database>this._db);
      this._db = undefined;
      this._isOpen = false;
    } else {
      return this._error(new SQLiteDatabaseError('closing (class)', 'Database is not open'));
    }
  }

  /** Handle error. Throws an error; markes as ": any" for compatibility. */
  private _error(e: Error): any {
    if (this.isOpen()) this.close(); // Close connection
    throw e;
  }

  /** Is this a valid string for a name/column/value ? */
  public static isValidString(str: string) {
    return /^[A-Za-z0-9@\.]*$/.test(str);
  }
}

export class SQLiteDatabaseError extends Error {
  constructor(stage: string, message: string, sql?: string) {
    let msg = `[stage ${stage}] ${message}`;
    if (sql) msg += ` [${sql}]`;
    super(msg);
    this.name = 'SQLiteDatabaseError';
  }
}

export function open(path: string): Promise<sqlite3.Database> {
  return new Promise(function (resolve, reject) {
    const db = new sqlite3.Database(path, (err) => {
      if (err) reject(new SQLiteDatabaseError('opening', err.message));
      else resolve(db);
    })
  });
}

// any query: insert/delete/update
export function run(db: sqlite3.Database, query: string): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    db.run(query, (err) => {
      if (err) reject(new SQLiteDatabaseError('running', err.message, query));
      else resolve(true);
    })
  })
}

// first row read
export function get(db: sqlite3.Database, query: string, params: any[] = []): Promise<any> {
  return new Promise(function (resolve, reject) {
    db.get(query, params, (err, row) => {
      if (err) reject(new SQLiteDatabaseError('reading: get', err.message, query))
      else resolve(row)
    })
  })
}

// set of rows read
export function all(db: sqlite3.Database, query: string, params: any[] = []): Promise<any[]> {
  return new Promise(function (resolve, reject) {
    db.all(query, params, (err, rows) => {
      if (err) reject(new SQLiteDatabaseError('reading: all', err.message, query));
      else resolve(rows);
    })
  })
}

// each row returned one by one 
export function each(db: sqlite3.Database, query: string, params: any[], callback: (row: any, n: number) => void): Promise<number> {
  return new Promise(function (resolve, reject) {
    db.serialize(() => {
      let n = 0;
      db.each(query, params, (err, row) => {
        if (err) reject(new SQLiteDatabaseError('reading: each', err.message, query));
        else {
          if (row) callback(row, n);
          n++;
        }
      })
      db.get("", (err, row) => resolve(n));
    })
  })
}

export function close(db: sqlite3.Database): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    db.close();
    resolve(true);
  })
}