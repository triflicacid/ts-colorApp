import { io } from "socket.io-client";
import { globals, IGlobals } from "./globals";
import { SocketManager } from "../lib/SocketManager";
import { create } from "./create-windows";
import { ActivePage } from "socket-types";

declare global {
  var globals: IGlobals;
}

window.addEventListener("load", () => {
  globalThis.globals = globals;

  globals.smgr = new SocketManager(io({
    reconnection: true,
    reconnectionAttempts: 6,
    reconnectionDelay: 500,
  }));
  globals.smgr.onEvent('message', (msg: string) => console.log(`[SOCKET] ` + msg));
  globals.smgr.onEvent('alert', (msg: string) => window.alert(msg));
  globals.smgr.onEvent('create-page', create);
  globals.smgr.onEvent("set-pro", (v: boolean) => {
    if (globals.user) {
      globals.user.pro = v;
      create(ActivePage.Main);
    }
  });
  globals.smgr.onEvent('delete', () => {
    globals.user = undefined;
    create(ActivePage.Main);
  });

  globals.color = [135, 206, 235];
  create(ActivePage.Main);
});