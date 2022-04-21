import { ActivePage, IClientData, ICreateAccount, ILoginData } from '../socket-types';
import socketio from 'socket.io';
import { SocketManager } from '../lib/SocketManager';
import { IDatabase } from './database-types';
import * as db from './database';

type S = socketio.Socket;

export class ClientConnection extends SocketManager<S> {
  private _user: IDatabase.Accounts | undefined;

  constructor(sock: S) {
    super(sock);
    this.sock.emit("message", `Connection established. ID: ${this.id}`);
    this._init();
  }

  private _init() {
    // Login
    this.onEvent("login", async (data: ILoginData) => {
      const account = await db.login(data.email, data.pwd);
      if (account) {
        this._user = account;
        const data = { name: account.Name, email: account.Email, pro: !!account.Pro, hex: account.Hex } as IClientData;
        this.emit("login", data);
      } else {
        this.emit("login", false);
      }
    });

    // Logout
    this.onEvent("logout", () => {
      this._user = undefined;
      this.emit("logout");
    });

    // Upgrade to Pro?
    this.onEvent("upgrade-pro", async () => {
      if (this._user) {
        // !temporary
        if (false) {
          // this._user.Pro = 1;
          // await db.setAccountPro(this._user.ID, this._user.Pro);
          // this.emit("set-pro", !!this._user.Pro);
        } else {
          this.emit("alert", `Unable to upgrade to Pro - it is unavailable at this time`);
        }
      } else {
        this.loggedInError("upgrade-pro");
      }
    });

    // Create an account
    this.onEvent("create-account", async (acnt: ICreateAccount) => {
      let n = await db.createAccount(acnt.name, acnt.email, acnt.pwd);
      if (n === 0) {
        const account = await db.login(acnt.email, acnt.pwd);
        this._user = account;
        const data = { name: account.Name, email: account.Email, pro: !!account.Pro, hex: account.Hex } as IClientData;
        this.emit("create-account", data);
      } else {
        this.emit("create-account", n);
      }
    });

    // Delete account
    this.onEvent("delete", async (email: string) => {
      if (this._user) {
        if (email === this._user.Email) {
          await db.deleteAccount(this._user.ID);
          this.emit("delete");
        } else {
          this.emit("alert", `Unable to delete account - emails do not match`);
        }
      } else {
        this.loggedInError("delete");
      }
    });
  }

  private loggedInError(action: string) {
    this.emit("alert", `Please log in to carry out action '${action}'`);
  }
}