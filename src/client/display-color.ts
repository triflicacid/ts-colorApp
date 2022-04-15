import { ColorHarmony } from "./utils";
import globals from "./globals";
import * as col from "../lib/color";


/** Create color swatch `<div/>` */
export function createSwatch() {
  const swatch = document.createElement("div");
  swatch.classList.add("color-swatch");
  return swatch;
}

/** Update to a new color  */
export function updateColorDisplay(rgb: [number, number, number] = globals.color) {
  const hex = col.rgb2hex(...rgb), hsl = col.rgb2hsl(...rgb);

  document.title = globals.title + " | " + hex;

  // Color swatches
  for (const swatch of document.querySelectorAll<HTMLElement>(":not(.color-harmony) > .color-swatch:not(.static)")) {
    swatch.style.backgroundColor = hex;
    swatch.title = hex;
    if (swatch.classList.contains("fancy")) {
      swatch.innerText = hex;
      swatch.style.color = col.bestTextColor(rgb);
    }
  }

  // Color Harmony swatches
  for (const el of document.querySelectorAll<HTMLElement>(".color-harmony")) {
    let hexCodes: string[] = [];
    let swatches = el.querySelectorAll<HTMLElement>(".color-swatch:not(.static)");
    switch (el.dataset.harmony as ColorHarmony) {
      case "tones":
        hexCodes = col.getTones(...hsl, swatches.length - 1).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      case "tints":
        hexCodes = col.getNTints(...hsl, swatches.length).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      case "shades":
        hexCodes = col.getNShades(...hsl, swatches.length).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      case "complementary":
        hexCodes = [hex, col.rgb2hex(...col.hsl2rgb(...col.getComplementaryHSL(...hsl)))];
        break;
      case "split complementary": {
        let sc = col.getSplitComplementary(...hsl, 40).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        hexCodes = [hex, ...sc];
        break;
      }
      case "analogous": {
        let [cm, cp] = col.getAnalogous(...hsl, 50).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        hexCodes = [cm, hex, cp];
        break;
      }
      case "triadic":
        hexCodes = col.getTriadic(...hsl).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      case "tetrad":
        hexCodes = col.getDivisions(4, ...hsl).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      case "divide color wheel":
        hexCodes = col.getDivisions(+(el.dataset.divisions as string), ...hsl).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      case "rectangular":
        hexCodes = col.getRectangular(...hsl).map(hsl => col.rgb2hex(...col.hsl2rgb(...hsl)));
        break;
      default:
        hexCodes.push(hex);
    }
    for (let i = 0; i < Math.min(swatches.length, hexCodes.length); i++) {
      let swatch = swatches[i], hex = hexCodes[i];
      swatch.style.backgroundColor = hex;
      swatch.title = hex;
      if (swatch.classList.contains("fancy")) {
        swatch.innerText = hex;
        swatch.style.color = col.bestTextColor(col.hex2rgb(hex));
      }
    }
  }

  // Color text
  for (const el of document.querySelectorAll<HTMLElement>(":not(input).color-display")) {
    let repr: string;
    switch (el.dataset.model as col.ColorFormat) {
      case "rgb":
        repr = col.col2str("rgb", rgb);
        break;
      case "rgba":
        repr = col.col2str("rgba", rgb);
        break;
      case "cmyk":
        repr = col.col2str("cmyk", col.rgb2cmyk(...rgb));
        break;
      case "hsl":
        repr = col.col2str("hsl", col.rgb2hsl(...rgb));
        break;
      case "hsv":
        repr = col.col2str("hsv", col.rgb2hsv(...rgb));
        break;
      default:
        repr = hex;
    }
    el.innerText = repr;
    el.title = hex;
  }

  // Color text input
  for (const el of document.querySelectorAll<HTMLInputElement>("input.color-display")) {
    if (el.dataset.model === "hex") {
      el.value = col.rgb2hex(...rgb);
    } else {
      let data: number[], i = +(el.dataset.index ?? 0);
      switch (el.dataset.model as col.ColorFormat) {
        case "rgb":
          data = rgb;
          break;
        case "rgba":
          data = [...rgb, 1];
          break;
        case "cmyk":
          data = col.rgb2cmyk(...rgb);
          break;
        case "hsl":
          data = col.rgb2hsl(...rgb);
          break;
        case "hsv":
          data = col.rgb2hsv(...rgb);
          break;
        default:
          continue;
      }
      el.value = data[i].toString();
    }
  }

  // Spectra midpoints
  for (const spectrum of globals.spectra) {
    let data = (function () {
      switch (spectrum.format) {
        case "rgb":
          return rgb;
        case "hsl":
          return col.rgb2hsl(...rgb);
        case "hsv":
          return col.rgb2hsv(...rgb);
        case "cmyk":
          return col.rgb2cmyk(...rgb);
        default:
          return undefined;
      }
    })();
    if (data) {
      spectrum.stops = data.map((d, i) => isFinite(spectrum.colorData[i]) ? -1 : d).filter(n => n !== -1);
      if (spectrum.format === "hsl") {
        // Update hues?
        if (isFinite(spectrum.colorData[0]) && spectrum.colorData[0] !== hsl[0]) spectrum.colorData[0] = hsl[0];
      }
      spectrum.interactives.forEach(I => I.draw());
      Array.from(spectrum.interactives)
    }
  }

  updateColorDisplayFunctions.forEach(f => f(rgb));
}

/** Extra functions to be called inside `updateColorDisplay` */
export const updateColorDisplayFunctions = new Set<(rgb: [number, number, number]) => void>();

/** Generate color bar - show info about active color (`globals.color`) */
export function generateColorBar() {
  let container = document.createElement("div");
  container.classList.add("color-bar");

  // Show color
  let swatch = createSwatch();
  container.appendChild(swatch);
  container.insertAdjacentHTML("beforeend", "<br>");

  // Color description
  let desc = document.createElement("div");
  desc.classList.add("color-description", "item-list");
  [
    {
      model: "hex",
      string: col.rgb2hex(...globals.color)
    }, {
      model: "rgb",
      string: col.col2str("rgb", globals.color)
    }, {
      model: "hsl",
      string: col.col2str("hsl", col.hsl2rgb(...globals.color))
    }
  ].forEach(({ model, string }) => {
    let span = document.createElement("span");
    span.classList.add("color-display");
    span.dataset.model = model;
    span.classList.add("item");
    // span.innerText = string;
    desc.appendChild(span);
  });
  container.appendChild(desc);

  return container;
}