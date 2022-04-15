import { updateColorDisplay } from "./display-color";
import { globals, IGlobals } from "./globals";
import { Tabs } from "./lib/Tabs";
import * as col from "./lib/color";
import * as selectColor from "./select-color";
import * as colorHarmonies from "./color-harmonies";
import * as tonesTintsShades from "./tones-tints-shades";
import * as mixing from "./mixing";
import { paints, toColorSeries } from "paints";

declare global {
  var globals: IGlobals;
}

function main() {
  document.title = globals.title;
  const container = document.createElement("div");
  container.classList.add("main-container");
  document.body.appendChild(container);

  // Add CSS colors to paints
  paints.unshift(toColorSeries("ink", "W3", "CSS", col.cssColors));

  // Load tabs
  const map = new Map();
  map.set("select", { content: selectColor.generateContent(), text: "Select" });
  map.set("harmonies", { content: colorHarmonies.generateContent(), text: "Harmonies" });
  map.set("tones-tints-shades", { content: tonesTintsShades.generateContent(), text: "Tones, Tints & Shades" });
  map.set("mixing", { content: mixing.generateContent(), text: "Mixing" });
  const tabs = new Tabs(container, map, -1);
  tabs.onTabOpen = () => updateColorDisplay();
  globals.tabs = tabs;

  // SETUP PAGE
  globals.color = [135, 206, 235];
  globalThis.globals = globals;
  tabs.open("select");

  return 0;
}

window.addEventListener("load", () => console.log("main() -> " + main()));