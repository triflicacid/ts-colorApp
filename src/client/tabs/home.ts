import { create, createLogin } from "client/create-windows";
import { generateColorBar, updateColorDisplay } from "client/display-color";
import { createSwatch, formatString } from "client/utils";
import { NOPRO_COLOR_LIMIT } from "../../constants";
import { ActivePage, INamedColor } from "socket-types";
import * as col from "../../lib/color";

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

    center.insertAdjacentHTML("beforeend", "<h3>Saved Colors</h3>");
    const divSavedColors = document.createElement("div");
    center.appendChild(divSavedColors);
    populateSavedColors(divSavedColors);
    let rgb = globals.color, hex = col.rgb2hex(...rgb);
    p = document.createElement("p");
    center.appendChild(p);
    let s = createSwatch(hex, true, false);
    s.classList.add("no-hover");
    let inputHex = document.createElement("input");
    inputHex.placeholder = hex;
    inputHex.addEventListener("change", () => {
      hex = inputHex.value;
      rgb = col.hex2rgb(hex);
      hex = inputHex.value = col.rgb2hex(...rgb);
      s.style.backgroundColor = hex;
      s.title = hex;
    });
    s.innerText = '';
    s.append(inputHex);
    let btnSaveColor = document.createElement("button");
    btnSaveColor.innerText = "Save Color";
    btnSaveColor.addEventListener("click", () => globals.smgr && globals.smgr.emit("save-color", hex));
    if (!globals.user.pro || globals.user.colors.length > NOPRO_COLOR_LIMIT) btnSaveColor.disabled = true;
    p.append(s);
    p.insertAdjacentHTML("beforeend", "&nbsp; ");
    p.append(btnSaveColor);

    globals.smgr?.onEvent("update-color-list", (colors: INamedColor[]) => {
      if (globals.user) {
        globals.user.colors = colors;
        populateSavedColors(divSavedColors);
        btnSaveColor.disabled = !globals.user.pro || globals.user.colors.length > NOPRO_COLOR_LIMIT;
      }
    });
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

/** Populate saved color list */
function populateSavedColors(target: HTMLDivElement) {
  target.innerHTML = '';
  if (globals.user) {
    for (let i = 0; i < globals.user.colors.length; ++i) {
      const { hex, name } = globals.user.colors[i], rgb = col.hex2rgb(hex);
      let p = document.createElement("p");
      let s = createSwatch(hex, true, true, hex => {
        globals.color = rgb;
        updateColorDisplay();
      });
      s.classList.add("small");
      p.append(s);
      p.insertAdjacentHTML("beforeend", " &nbsp; ");
      let inputName = document.createElement("input");
      inputName.type = "text";
      inputName.placeholder = "Name";
      inputName.value = name;
      inputName.addEventListener("change", () => globals.smgr?.emit("rename-color", { index: i, name: inputName.value.trim() }));
      p.append(inputName);
      p.insertAdjacentHTML("beforeend", " &nbsp; ");
      let btnDel = document.createElement("button");
      btnDel.innerText = "Remove";
      btnDel.addEventListener("click", () => globals.smgr?.emit("unsave-color", { index: i }));
      p.append(btnDel);
      target.appendChild(p);
    }
  }
}