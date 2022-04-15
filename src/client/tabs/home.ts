import { generateColorBar } from "client/display-color";

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

  let p = document.createElement("p");
  if (globals.pro) {
    p.append(`Your are a Pro account`);
  } else {
    let btn = document.createElement("button");
    btn.innerText = "Upgrade to Pro";
    btn.addEventListener("click", () => {
      /* !TEMPORARY! */
      globals.pro = true;
      main();
    });
    p.append(btn);
  }
  center.append(p);

  return container;
}