import { generateColorBar, updateColorDisplayFunctions } from "../display-color";
import { getClosestColor } from "../paints";
import { globals } from "../globals";
import { generateColorListElement } from "../utils";

const CLOSEST_TOL: [number, number, number] = [15, 50, 50];

/** Tab header */
export function tabHeader() {
  const span = document.createElement("span");
  span.innerText = "Mixing";
  return span;
}

export const TAB_ID = "mixing";

/** Content for how to mix globals.color */
export function generateContent() {
  const container = document.createElement("div");

  let center = document.createElement("div");
  center.classList.add("central");
  container.appendChild(center);

  let colorBar = generateColorBar();
  center.appendChild(colorBar);

  let title = document.createElement("h1");
  title.innerText = "Closest Colors";
  center.append(title);

  let div = document.createElement("div");
  let p = document.createElement("p");
  p.insertAdjacentHTML("beforeend", "<strong>&plusmn; Tolerance</strong>: ");
  ["Hue", "Saturation", "Lightness"].forEach((str, i, arr) => {
    let input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = i === 0 ? "180" : "50";
    input.value = CLOSEST_TOL[i].toString();
    input.addEventListener("input", () => {
      let n = +input.value;
      span.innerText = n.toLocaleString("en-GB");
      CLOSEST_TOL[i] = n;
      searchForClosest(divClosest);
    });
    let span = document.createElement("span");
    p.append(str, "  ", input, "  ±", span);
    if (i < arr.length - 1) p.append(" | ");
  });
  let divClosest = document.createElement("div");
  div.append(p, divClosest);
  center.append(div);

  searchForClosest(divClosest);

  updateColorDisplayFunctions.add(rgb => searchForClosest(divClosest, rgb));

  return container;
}

function searchForClosest(out: HTMLElement, targetRGB: [number, number, number] = globals.color) {
  const closest = getClosestColor(targetRGB, CLOSEST_TOL);
  let div = generateColorListElement(closest);
  out.innerHTML = "";
  out.append(div);
}