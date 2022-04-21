import { create, createLogin } from "client/create-windows";
import { generateColorBar } from "client/display-color";
import { formatString } from "client/utils";
import { ActivePage, IClientData } from "socket-types";

/** Tab header */
export function tabHeader() {
  const span = document.createElement("span");
  let img = new Image();
  img.src = "./home.png";
  span.append(img);
  return span;
}

export const TAB_ID = "home";

/** Create content for homepage */
export function generateContent() {
  const container = document.createElement("div");

  let center = document.createElement("div");
  center.classList.add("central");
  container.appendChild(center);

  let colorBar = generateColorBar();
  center.appendChild(colorBar);

  let title = document.createElement("h1");
  title.innerText = "Home";
  center.append(title);

  if (globals.user) {
    center.insertAdjacentHTML("beforeend", `<p>You are logged in as ${formatString(globals.user.name)}</p>`);

    let p = document.createElement("p");
    if (globals.user && !globals.user.pro) { // Upgrade to PRO
      let btnPro = document.createElement("button");
      btnPro.innerText = "Upgrade to Pro";
      btnPro.addEventListener("click", () => globals.smgr && globals.smgr.emit("upgrade-pro"));
      p.append(btnPro);
    }
    center.append(p);

    p = document.createElement("p");
    center.append(p);
    let btnLogout = document.createElement("button");
    btnLogout.innerText = "Logout";
    btnLogout.addEventListener("click", () => globals.smgr && globals.smgr.emit("logout"));
    let btnDelete = document.createElement("button");
    btnDelete.innerText = "Delete Account";
    btnDelete.addEventListener("click", () => globals.smgr && confirm("Delete account? This is permanent and cannot be undone.") && globals.smgr.emit("delete", globals.user?.email));
    p.append(btnLogout, btnDelete);
  } else {
    center.insertAdjacentHTML("beforeend", `<p>You are not logged in</p>`);

    let login = createLogin("h2");
    center.append(login);

    let p = document.createElement("p");
    let btnCreate = document.createElement("button");
    btnCreate.innerText = "Create Account";
    btnCreate.addEventListener("click", () => create(ActivePage.Create));
    p.appendChild(btnCreate);
    center.appendChild(p);
  }

  return container;
}