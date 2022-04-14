import { generateColorBar } from "display-color";
import { createHarmonyTemplate } from "utils";

/** Create content - view active colors tones, tints and shades */
export function generateContent() {
  const container = document.createElement("div");

  let center = document.createElement("div");
  center.classList.add("central");
  container.appendChild(center);

  let colorBar = generateColorBar();
  center.appendChild(colorBar);

  let title = document.createElement("h1");
  title.innerText = "Color Study";
  center.append(title);

  // Tints, tones & shades
  center.appendChild(createHarmonyTemplate("tones", 11));
  center.appendChild(createHarmonyTemplate("tints", 10));
  center.appendChild(createHarmonyTemplate("shades", 10));

  return container;
}