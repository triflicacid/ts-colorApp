import { updateColorDisplay } from "./display-color";
import { globals } from "./globals";
import { Tabs } from "../lib/Tabs";
import * as col from "../lib/color";
import * as selectColor from "./tabs/select-color";
import * as colorHarmonies from "./tabs/color-harmonies";
import * as home from "./tabs/home";
import * as tonesTintsShades from "./tabs/tones-tints-shades";
import * as mixing from "./tabs/mixing";
import { paints, toColorSeries } from "./paints";
import { ActivePage, IClientData, ICreateAccount, ILoginData } from "../socket-types";

var mainContainer: HTMLDivElement;

/** Greate page from ActivePage, and make main screen */
export function create(p: ActivePage) {
  let div: HTMLDivElement;
  switch (p) {
    case ActivePage.Main:
      div = createMain();
      break;
    case ActivePage.Login:
      div = createLogin("h1");
      break;
    case ActivePage.Create:
      div = createNewAccount();
      break;
    default:
      div = document.createElement("div");
      document.title = "404";
      div.innerHTML = `<em>Page /${ActivePage[p]} could not be found (${p})</em>`;
  }
  if (globals.smgr) globals.smgr.flag = p;

  if (mainContainer) mainContainer.remove();
  div.classList.add("main-container");
  document.body.appendChild(div);
  mainContainer = div;

  if (p === ActivePage.Main) (globals.tabs as Tabs).open(home.TAB_ID);
}

/** Create application */
export function createMain() {
  document.title = globals.title;
  const container = document.createElement("div");

  // Add CSS colors to paints
  paints.unshift(toColorSeries("ink", "W3", "CSS", col.cssColors));

  // Load tabs
  const map = new Map();
  [selectColor, colorHarmonies, home, tonesTintsShades, mixing].forEach(data => {
    map.set(data.TAB_ID, { content: data.generateContent(), text: data.tabHeader() });
  });
  const tabs = new Tabs(container, map, -1);
  tabs.onTabOpen = () => updateColorDisplay();
  globals.tabs = tabs;

  return container;
}

/** Create login screen */
export function createLogin(titleEl?: keyof HTMLElementTagNameMap) {
  const container = document.createElement("div");
  document.title = "Color | Login";

  if (titleEl) {
    let title = document.createElement(titleEl);
    title.innerText = "Log In";
    container.appendChild(title);
  }

  const form = document.createElement("div");
  container.appendChild(form);
  form.classList.add("login-form");

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.placeholder = "Email";
  inputEmail.addEventListener("input", () => error.hidden = true);
  
  const inputPwd = document.createElement("input");
  inputPwd.type = "password";
  inputPwd.placeholder = "Password";
  inputPwd.addEventListener("input", () => error.hidden = true);

  const error = document.createElement("span");
  error.classList.add("error");
  error.hidden = true;

  const btn = document.createElement("button");
  btn.innerText = "Log In";
  btn.addEventListener("click", () => {
    const data = { email: inputEmail.value.trim(), pwd: inputPwd.value.trim() } as ILoginData;
    globals.smgr?.emit("login", data);
  });

  form.append(inputEmail, inputPwd, error, btn);

  form.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') btn.click();
  });

  // Socket callback?
  if (globals.smgr) {
    globals.smgr.onEvent("login", (arg: false | IClientData) => {
      if (arg) {
        inputEmail.value = "";
        globals.user = arg;
        create(ActivePage.Main);
      } else {
        error.hidden = false;
        error.innerText = "Invalid email or password";
      }
      inputPwd.value = "";
    });

    globals.smgr.onEvent("logout", () => {
      globals.user = undefined;
      create(ActivePage.Main);
    });
  }

  return container;
}

export function createNewAccount() {
  const container = document.createElement("div");
  document.title = "Color | New Account";

  const form = document.createElement("div");
  container.appendChild(form);
  form.classList.add("login-form");

  form.insertAdjacentHTML("beforeend", "<div class='central'><h1>Create Account</h1></div>");

  let btnBack = document.createElement("button");
  btnBack.innerText = "Back";
  btnBack.addEventListener("click", () => create(ActivePage.Main)); // Go back to /Main
  form.appendChild(btnBack);

  form.insertAdjacentHTML("beforeend", "<br>");

  const inputName = document.createElement("input");
  inputName.type = "text";
  inputName.placeholder = "Name";
  inputName.addEventListener("input", () => error.hidden = true);

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.placeholder = "Email";
  inputEmail.addEventListener("input", () => error.hidden = true);

  const inputPwd = document.createElement("input");
  inputPwd.type = "password";
  inputPwd.placeholder = "Password";
  inputPwd.addEventListener("input", () => error.hidden = true);

  const error = document.createElement("span");
  error.classList.add("error");
  error.hidden = true;

  const btn = document.createElement("button");
  btn.innerText = "Create";
  btn.addEventListener("click", () => {
    const data = { name: inputName.value.trim(), email: inputEmail.value.trim(), pwd: inputPwd.value.trim() } as ICreateAccount;
    globals.smgr?.emit("create-account", data);
  });

  form.append(inputName, inputEmail, inputPwd, error, btn);

  form.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') btn.click();
  });

  // Socket callback?
  if (globals.smgr) {
    globals.smgr.onEvent("create-account", (arg: number | IClientData) => {
      if (typeof arg === "object") {
        inputEmail.value = "";
        globals.user = arg;
        create(ActivePage.Main);
      } else {
        error.hidden = false;
        if (arg === 1) error.innerText = "Missing information";
        else if (arg === 2) error.innerText = "Username already exists";
        else error.innerText = "Unable to create account";
      }
      inputPwd.value = "";
    });

    globals.smgr.onEvent("logout", () => {
      globals.user = undefined;
      create(ActivePage.Main);
    });
  }

  return container;
}