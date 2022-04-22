import { IClientData, ICreateAccount, ILoginData, IIdentifyColor } from '../socket-types';
import socketio from 'socket.io';
import { SocketManager } from '../lib/SocketManager';
import { IDatabase } from './database-types';
import * as db from './database';
import { hex2rgb, rgb2hex } from '../lib/color';
import { getColorFromList } from './utils';
import { NOPRO_COLOR_LIMIT } from '../constants';

type S = socketio.Socket;

export class ClientConnection extends SocketManager<S> {
  private _user: IDatabase.Accounts | undefined;
  private _userSavedColors: IDatabase.Colors[];

  constructor(sock: S) {
    super(sock);
    this._userSavedColors = [];
    this.sock.emit("message", `Connection established. ID: ${this.id}`);
    this._init();
  }

  private _init() {
    // Login
    this.onEvent("login", async (data: ILoginData) => {
      const account = await db.login(data.email, data.pwd);
      if (account) {
        this._user = account;
        const colors = await db.getSavedColors(account.ID);
        this._userSavedColors = colors;
        const data = { name: account.Name, email: account.Email, pro: !!account.Pro, colors: colors.map(c => ({ name: c.Name, hex: c.Hex })) } as IClientData;
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
        this._userSavedColors.length = 0;
        const data = { name: account.Name, email: account.Email, pro: !!account.Pro, colors: [] } as IClientData;
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

    this.onEvent("update-color-list", async () => {
      if (this._user) {
        const colors = await db.getSavedColors(this._user.ID);
        this._userSavedColors = colors;
        this.emit("update-color-list", colors.map(c => ({ name: c.Name, hex: c.Hex })));
      } else {
        this.loggedInError("update-color-list");
      }
    });

    // Save a Color
    this.onEvent("save-color", async (hex: string) => {
      if (this._user) {
        if (this._user.Pro || this._userSavedColors.length <= NOPRO_COLOR_LIMIT) {
          hex = rgb2hex(...hex2rgb(hex));
          await db.saveColor(this._user.ID, hex);
          await this.invokeEvent("update-color-list");
        } else {
          this.emit("alert", `Color limit reached. Upgrade to Pro to save more colors.`);
        }
      } else {
        this.loggedInError("save-color");
      }
    });

    // Remove (unsave) a Color
    this.onEvent("unsave-color", async (arg: IIdentifyColor) => {
      if (this._user) {
        let color = getColorFromList(this._userSavedColors, arg);
        if (color) await db.removeColor(color.ID);
        await this.invokeEvent("update-color-list");
      } else {
        this.loggedInError("save-color");
      }
    });
    
    // Rename a color
    this.onEvent("rename-color", async (arg: IIdentifyColor & { name: string; }) => {
      if (this._user) {
        let color = getColorFromList(this._userSavedColors, arg);
        if (color) await db.renameColor(color.ID, arg.name.trim());
        await this.invokeEvent("update-color-list");
      } else {
        this.loggedInError("save-color");
      }
    });
  }

  private loggedInError(action: string) {
    this.emit("alert", `Please log in to carry out action '${action}'`);
  }
}