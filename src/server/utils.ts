import { IIdentifyColor } from "socket-types";
import { IDatabase } from "./database-types";

/** Configuration options for terminate function */
interface ITerminateOptions {
  coredump?: boolean;
  timeout?: number;
  log?: boolean;
  fn?: (code: number) => void;
}

/**
 * Handle termination actions of a server
 * Taken from https://blog.heroku.com/best-practices-nodejs-errors (c) JULIÁN DUQUE, DECEMBER 17, 2019
 */
export function terminate<Server>(server: Server, options: ITerminateOptions) {
  options.coredump ??= false;
  options.timeout ??= 500;
  options.log ??= false;

  // Exit function
  const exit = (code: number) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code: number, reason: string) => async (err: Error) => {
    if (options.log) console.error(`[ERROR] code ${code}: ${reason}`);
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      console.log(err.message, err.stack)
    }
    if (options.fn) await options.fn(code);

    // Attempt a graceful shutdown
    (server as any).close(exit);
    (setTimeout(exit, options.timeout) as any).unref();
  };
}

/** Get color from list */
export function getColorFromList(colors: IDatabase.Colors[], param: IIdentifyColor) {
  if (param.hex !== undefined) { // Delete by hex code
    return [...colors].reverse().find(({ Hex }) => Hex === param.hex);
  } else if (param.id !== undefined) { // Delete by ID
    return colors.find(({ ID }) => ID === param.id);
  } else if (param.index !== undefined) { // Delete by index in _userSavedColors
    return colors[param.index];
  } else {
    return undefined;
  }
}