import { updateColorDisplay } from "./display-color";
import { globals, IGlobals } from "./globals";
import { Tabs } from "../lib/Tabs";
import * as col from "../lib/color";
import * as selectColor from "./tabs/select-color";
import * as colorHarmonies from "./tabs/color-harmonies";
import * as home from "./tabs/home";
import * as tonesTintsShades from "./tabs/tones-tints-shades";
import * as mixing from "./tabs/mixing";
import { paints, toColorSeries } from "./paints";

var mainContainer: HTMLDivElement;

declare global {
  var globals: IGlobals;
  var main: () => void;
}

/** Create application */
function main() {
  if (mainContainer) mainContainer.remove();
  document.title = globals.title;
  const container = document.createElement("div");
  mainContainer = container;
  container.classList.add("main-container");
  document.body.appendChild(container);

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
  tabs.open(home.TAB_ID);
  
  return 0;
}

window.addEventListener("load", () => {
  globalThis.main = main;
  globalThis.globals = globals;

  globals.pro = !true;
  globals.color = [135, 206, 235];
  let code = main();
  console.log("main(): returned code " + code);
});