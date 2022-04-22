import { updateColorDisplay } from "./display-color";
import { IColorSeries } from "./paints";
import * as col from "../lib/color";
import { globals } from "./globals";

export type ColorHarmony = "tones" | "tints" | "shades" | "complementary" | "analogous" | "split complementary" | "triadic" | "tetrad" | "rectangular" | "divide color wheel";

export const formatString = (s: string) => s.split(/(?<=[a-z])(?=[A-Z])|\s|\-/g).map(x => x ? x[0].toUpperCase() + (x.substring(1) ?? "") : "").join(' ');

/** Create template for a harmony */
export function createHarmonyTemplate(harmony: ColorHarmony, n: number, title = true) {
  let div = document.createElement("div");
  if (title) div.insertAdjacentHTML("beforeend", `<h3>${formatString(harmony)}</h3>`);
  div.classList.add("color-harmony");
  div.dataset.harmony = harmony;
  for (let i = 0; i < n; ++i) {
    let sw = document.createElement("span");
    sw.classList.add("color-swatch", "fancy");
    sw.addEventListener("click", () => {
      let hex = sw.innerText, rgb = col.hex2rgb(hex);
      globals.color = rgb;
      updateColorDisplay();
    });
    div.appendChild(sw);
  }
  return div;
}

/** Create color swatch `<div/>` */
export function createBasicSwatch() {
  const swatch = document.createElement("div");
  swatch.classList.add("color-swatch");
  return swatch;
}

/** Create configurable swatch */
export function createSwatch(hex?: string, isFancy = true, isStatic = true, onclick?: (hex: string) => void) {
  let s = document.createElement("span");
  s.classList.add("color-swatch");
  if (isFancy) s.classList.add("fancy");
  if (isStatic) s.classList.add("static");
  if (hex) {
    let rgb = col.hex2rgb(hex);
    s.style.backgroundColor = hex;
    s.title = hex;
    s.style.color = col.bestTextColor(rgb);
    s.innerText = hex;
  }
  if (onclick) s.addEventListener("click", () => onclick(s.innerText));
  return s;
}

export const globalCompositionOperations: GlobalCompositeOperation[] = ["color", "color-burn", "color-dodge", "copy", "darken", "destination-atop", "destination-in", "destination-out", "destination-over", "difference", "exclusion", "hard-light", "hue", "lighten", "lighter", "luminosity", "multiply", "overlay", "saturation", "screen", "soft-light", "source-atop", "source-in", "source-out", "source-over", "xor"];

export const getColorSeriesTitle = (series: IColorSeries) => formatString(series.make) + ": " + formatString(series.series);

interface IModifiedColorSeries {
  type: string;
  make: string;
  series: string;
  seriesID: string;
  colors: { name: string; hex: string; el: HTMLElement; }[];
}

/** Generate color list module from input */
export function generateColorListElement(allColors: IColorSeries[], filtering = true) {
  let div = document.createElement("div");
  div.classList.add("central");

  let tableDiv = document.createElement("div");
  tableDiv.classList.add("central");

  const swatch = (hex: string) => {
    let s = createSwatch(hex, true, true, hex => {
      globals.color = col.hex2rgb(hex);
      updateColorDisplay();
    });
    s.classList.add("static");
    return s;
  };
  const search = (query: string, series: string = "*") => colors.map<IModifiedColorSeries | null>((obj) => {
    if (series === "*" || obj.seriesID === series) {
      let cobj = { ...obj };
      cobj.colors = obj.colors.filter(({ name }) => name.toLowerCase().match(query.toLowerCase()));
      return cobj;
    } else {
      return null;
    }
  }).filter(a => a) as IModifiedColorSeries[];
  const display = (colors: IModifiedColorSeries[]) => {
    tableDiv.innerHTML = "";
    let count = allColors.reduce((acc, series) => acc + series.colors.length, 0);
    let table = document.createElement("table"), tbody = table.createTBody();
    table.insertAdjacentHTML("afterbegin", `<thead><tr><th colspan='2'><span>Colors: ${count.toLocaleString("en-GB")}</span></th></tr></thead>`);
    for (let series of colors) {
      if (series.hasOwnProperty("title")) {

      }
      tbody.insertAdjacentHTML("beforeend", `<tr><th colspan='2'>${getColorSeriesTitle(series)}</th></tr>`);
      series.colors.forEach(({ name, hex }) => {
        const rgb = col.hex2rgb(hex);
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let s = createSwatch(hex, true, true, hex => {
          globals.color = rgb;
          updateColorDisplay();
        });
        s.classList.add("static");
        s.title = col.col2str("hsl", col.rgb2hsl(...rgb));
        td.appendChild(s);
        tr.appendChild(td);
        tr.insertAdjacentHTML("beforeend", `<td>${formatString(name)}</td>`);
        tbody.appendChild(tr);
      });
    }

    tableDiv.appendChild(table);
  };

  // Assemble all colors
  const colors: IModifiedColorSeries[] = [], colorSeries: { text: string; value: string; }[] = [];
  for (let series of allColors) {
    let seriesID = series.make + "_" + series.series;
    let title = getColorSeriesTitle(series);
    colorSeries.push({ text: title, value: seriesID });

    const repr = { seriesID, type: series.type, make: series.make, series: series.series, colors: [] } as IModifiedColorSeries;
    colors.push(repr);
    for (let { name, hex } of series.colors) {
      let el = swatch(hex);
      repr.colors.push({ name, hex, el });
    }
  }

  // HTML
  if (filtering) {
    let p = document.createElement("p");
    div.appendChild(p);
    p.insertAdjacentHTML("beforeend", "Search ");
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Color";
    input.addEventListener("input", () => display(search(input.value, selectSeries.value)));
    let selectSeries = document.createElement("select");
    selectSeries.insertAdjacentHTML("beforeend", "<option value='*'>Any</option>");
    colorSeries.forEach(({ text, value }) => selectSeries.insertAdjacentHTML("beforeend", `<option value='${value}'>${text}</option>`));
    selectSeries.addEventListener("change", () => display(search(input.value, selectSeries.value)));
    p.append(input, "  in series ", selectSeries);
  }
  div.append(tableDiv);
  display(colors);
  return div;
}