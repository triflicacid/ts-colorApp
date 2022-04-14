import { ColorHarmony, createHarmonyTemplate, formatString } from "utils";
import { generateColorBar, updateColorDisplay } from "./display-color";
import globals from "./globals";
import * as col from "./lib/color";

/** Create content for "Harmonies" - display color harmonies */
export function generateContent() {
  const container = document.createElement("div");
  let center = document.createElement("div");
  center.classList.add("central");
  container.appendChild(center);

  let colorBar = generateColorBar();
  center.appendChild(colorBar);

  let title = document.createElement("h1");
  title.innerText = "Color Harmonies";
  center.append(title);

  center.appendChild(createHarmonyTemplate("complementary", 2));
  center.appendChild(createHarmonyTemplate("split complementary", 3));
  center.appendChild(createHarmonyTemplate("analogous", 3));
  center.appendChild(createHarmonyTemplate("triadic", 3));
  center.appendChild(createHarmonyTemplate("rectangular", 4));

  let div = document.createElement("div"), dcw: HTMLDivElement;
  title = document.createElement("h3");
  title.innerHTML = "Divide Color Wheel &mdash; ";
  let input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = "360";
  input.value = "4";
  input.addEventListener("change", () => {
    if (dcw) dcw.remove();
    dcw = createDivideColorWheelSegment(+input.value);
    div.appendChild(dcw);
    updateColourWheelDivisions(dcw);
  });
  title.appendChild(input);
  div.appendChild(title);
  center.appendChild(div);
  dcw = createDivideColorWheelSegment(+input.value);
  div.appendChild(dcw);

  return container;
}

/** Generate segment for "divide color wheel"  */
function createDivideColorWheelSegment(divisions: number) {
  let div = createHarmonyTemplate("divide color wheel", divisions, false);
  div.dataset.divisions = divisions.toString();
  return div;
}

/** Divide Color Wheel: update swatch contents */
function updateColourWheelDivisions(div: HTMLDivElement) {
  let hexCodes = col.getDivisions(+(div.dataset.divisions ?? 4), ...col.rgb2hsl(...globals.color)).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
  let swatches = div.querySelectorAll<HTMLElement>(".color-swatch");
  for (let i = 0; i < swatches.length; i++) {
    let swatch = swatches[i], hex = hexCodes[i];
    swatch.style.backgroundColor = swatch.title = swatch.innerText = hex;
    swatch.style.color = col.bestTextColor(col.hex2rgb(hex));
  }
}