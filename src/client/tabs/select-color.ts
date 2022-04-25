import { generateColorBar, updateColorDisplay } from "../display-color";
import { Tabs } from "../../lib/Tabs";
import * as col from "../../lib/color";
import globals from "../globals";
import { CanvasFilter } from "lib/CanvasFilter";
import { formatString, generateColorListElement, globalCompositionOperations } from "../utils";
import { paints } from "../paints";

const SPECTRA_WIDTH = 500, SPECTRA_HEIGHT = 60;

/** Tab header */
export function tabHeader() {
  const span = document.createElement("span");
  span.innerText = "Select";
  return span;
}

export const TAB_ID = "select";

/** Create content for "Select" - select a color */
export function generateContent() {
  const container = document.createElement("div");

  let center = document.createElement("div");
  center.classList.add("central");
  container.appendChild(center);

  let colorBar = generateColorBar();
  center.appendChild(colorBar);

  let title = document.createElement("h1");
  title.innerText = "Pick a Color";
  center.append(title);

  // Pick color options
  let div = document.createElement("div");
  center.appendChild(div);

  let map = new Map();
  map.set("image", { content: generatePickUsingImage(), text: "Image" });
  map.set("model", { content: generatePickUsingModel(), text: "Pick" });
  map.set("preset", { content: generatePickUsingNames(), text: "Preset" });
  const tabs = new Tabs(div, map);
  tabs.onTabOpen = () => updateColorDisplay();
  tabs.open("image");

  return container;
}

/** Pick color using a color space: RGB, HSL, CMYK */
function generatePickUsingModel() {
  const container = document.createElement("div");
  // container.append(generatePickUsingRGB(), generatePickUsingCMYK(), generatePickUsingHSL());
  container.append(
    generateUsingColorModel("rgb", [0, 0, 0], true, [0, 0, 0], [255, 255, 255]),
    generateUsingColorModel("cmyk", [0, 0, 0, 0], true, [0, 0, 0, 0], [100, 100, 100, 100], col.cmyk2rgb, col.rgb2cmyk),
    generateUsingColorModel("hsl", [0, 100, 50], true, [0, 0, 0], [360, 100, 100], col.hsl2rgb, col.rgb2hsl),
  );
  if (globals.user?.pro) {
    container.insertAdjacentHTML("beforeend", "<hr>");
    container.append(
      generateUsingColorModel("cmy", [0, 0, 0], true, [0, 0, 0], [100, 100, 100], col.cmy2rgb, col.rgb2cmy),
      generateUsingColorModel("hsv", [0, 100, 100], true, [0, 0, 0], [360, 100, 100], col.hsv2rgb, col.rgb2hsv),
      generateUsingColorModel("lab", [0, 0, 0], false, undefined, undefined, (l: number, a: number, b: number) => col.xyz2rgb(...col.lab2xyz(l, a, b)), (r: number, g: number, b: number) => col.xyz2lab(...col.rgb2xyz(r, g, b))),
      generateUsingColorModel("lms", [0, 0, 0], false, undefined, undefined, (l: number, m: number, s: number) => col.xyz2rgb(...col.lms2xyz(l, m, s)), (r: number, g: number, b: number) => col.xyz2lms(...col.rgb2xyz(r, g, b))),
      generateUsingColorModel("luv", [0, 0, 0], false, undefined, undefined, (l: number, u: number, v: number) => col.xyz2rgb(...col.luv2xyz(l, u, v)), (r: number, g: number, b: number) => col.xyz2luv(...col.rgb2xyz(r, g, b))),
      generateUsingColorModel("xyY", [0, 0, 0], false, undefined, undefined, (x: number, y: number, Y: number) => col.xyz2rgb(...col.xyY2xyz(x, y, Y)), (r: number, g: number, b: number) => col.xyz2xyY(...col.rgb2xyz(r, g, b))),
      generateUsingColorModel("xyz", [0, 0, 0], false, undefined, undefined, col.xyz2rgb, col.rgb2xyz),
    );
  }
  return container;
}

/**
 * Generate input fields for inputting a color using a model.
 * @param model color model e.g. "hsl"
 * @param data  color data for each spectra. Note, the respective value will vary.
 * @param spectra display color spectras for each component?
 * @param dataMin minimum values for each value
 * @param dataMax maximum values for each value
 * @param toRGB function to convert color from `model` to rgb
 * @param fromRGB function to convert color from reg to `model`
 * @returns container
 */
function generateUsingColorModel<T extends [number, number, number] | [number, number, number, number]>(model: col.NColorFormat, data: T, spectra: boolean, dataMin?: T, dataMax?: T, toRGB?: (...nums: number[]) => [number, number, number], fromRGB?: (r: number, g: number, b: number) => T) {
  const container = document.createElement("div");

  let title = document.createElement("h2");
  title.classList.add("color-display");
  title.dataset.model = model;
  container.appendChild(title);

  if (spectra) {
    for (let i = 0; i < data.length; ++i) {
      let p = document.createElement("p");
      let input = document.createElement("input");
      input.type = "number";
      if (dataMin) input.min = dataMin[i].toString();
      if (dataMax) input.max = dataMax[i].toString();
      input.classList.add("color-display");
      input.dataset.model = model;
      input.dataset.index = i.toString();
      input.addEventListener("change", () => {
        let cdata = fromRGB ? fromRGB(...globals.color) : globals.color;
        cdata[i] = col.clamp(+input.value, (dataMin as T)[i], (dataMax as T)[i]);
        if (toRGB) globals.color = toRGB(...data);
        updateColorDisplay();
      });
      p.appendChild(input);
      p.insertAdjacentHTML("beforeend", " &nbsp;&nbsp;");
      let spectrum = new col.Spectrum_1D(model, data.map((n, j) => i === j ? NaN : n) as T, [(dataMin as T)[i], (dataMax as T)[i]], toRGB);
      globals.spectra1d.push(spectrum);
      spectrum.stops.push(globals.color[i]);
      let I = spectrum.createInteractive(SPECTRA_WIDTH, SPECTRA_HEIGHT, 0, "span");
      I.onclick = () => {
        let cdata = fromRGB ? fromRGB(...globals.color) : globals.color;
        cdata[i] = spectrum.stops[0];
        if (toRGB) globals.color = toRGB(...cdata);
        updateColorDisplay();
      };
      p.appendChild(I.element);
      container.appendChild(p);
    }
  } else {
    let p = document.createElement("p");
    p.append(model + "(");
    if (dataMin && dataMax) {
      // Seperate inputs
      for (let i = 0; i < data.length; ++i) {
        let input = document.createElement("input");
        input.type = dataMin && dataMax ? "range" : "number";
        if (dataMin) input.min = dataMin[i].toString();
        if (dataMax) input.max = dataMax[i].toString();
        input.classList.add("color-display");
        input.dataset.model = model;
        input.dataset.index = i.toString();
        input.addEventListener("change", () => {
          let cdata = fromRGB ? fromRGB(...globals.color) : globals.color;
          cdata[i] = (dataMin && dataMax) ? col.clamp(+input.value, dataMin[i], dataMax[i]) : +input.value;
          if (toRGB) globals.color = toRGB(...data);
          updateColorDisplay();
        });
        p.appendChild(input);
        if (i < data.length - 1) p.append(" ,  ");
      }
    } else {
      let input = document.createElement("input");
      input.type = "text";
      input.style.width = "50%";
      input.classList.add("color-display");
      input.dataset.model = model;
      input.value = data.join(", ");
      input.addEventListener("change", () => {
        let data = input.value.split(",").map(x => +x.trim()).filter(x => !isNaN(x) && isFinite(x));
        let rgb = col.col2col<any, [number, number, number]>(data, model, "rgb");
        globals.color = rgb;
        updateColorDisplay();
      });
      p.appendChild(input);
    }
    p.append(")");
    container.appendChild(p);
  }

  return container;
}

/** Pick color using RGB color space */
function generatePickUsingRGB() {
  const container = document.createElement("div");

  let title = document.createElement("h2");
  title.classList.add("color-display");
  title.dataset.model = "rgb";
  container.appendChild(title);

  let p = document.createElement("p");
  let hexInput = document.createElement("input");
  hexInput.type = "text";
  hexInput.maxLength = hexInput.size = 7;
  hexInput.classList.add("color-display");
  hexInput.dataset.model = "hex";
  hexInput.addEventListener('change', () => {
    let rgb = col.hex2rgb(hexInput.value);
    globals.color = rgb;
    updateColorDisplay();
  });
  p.appendChild(hexInput);
  container.appendChild(p);

  for (let i = 0; i < 3; i++) {
    let range = [0, 255] as [number, number];
    let p = document.createElement("p");
    let input = document.createElement("input");
    input.type = "number";
    input.min = range[0].toString();
    input.max = range[1].toString();
    input.classList.add("color-display");
    input.dataset.model = "rgb";
    input.dataset.index = i.toString();
    input.addEventListener("change", () => {
      globals.color[i] = col.clamp(+input.value, ...range);
      updateColorDisplay();
    });
    p.appendChild(input);
    p.insertAdjacentHTML("beforeend", " &nbsp;&nbsp;");
    let spectrum = new col.Spectrum_1D("rgb", Array.from({ length: 3 }, (_, j) => i === j ? NaN : 0) as [number, number, number], range);
    globals.spectra1d.push(spectrum);
    spectrum.stops.push(globals.color[i]);
    let I = spectrum.createInteractive(SPECTRA_WIDTH, SPECTRA_HEIGHT, 0, "span");
    I.onclick = () => {
      globals.color[i] = spectrum.stops[0];
      updateColorDisplay();
    };
    p.appendChild(I.element);
    container.appendChild(p);

  }

  return container;
}

/** Pick color using CMYK color space */
function generatePickUsingCMYK() {
  const container = document.createElement("div");

  let title = document.createElement("h2");
  title.classList.add("color-display");
  title.dataset.model = "cmyk";
  container.appendChild(title);

  for (let i = 0; i < 4; i++) {
    let range = [0, 100] as [number, number];
    let p = document.createElement("p");
    let input = document.createElement("input");
    input.type = "number";
    input.min = range[0].toString();
    input.max = range[1].toString();
    input.classList.add("color-display");
    input.dataset.model = "cmyk";
    input.dataset.index = i.toString();
    input.addEventListener("change", () => {
      let cmyk = col.rgb2cmyk(...globals.color);
      cmyk[i] = col.clamp(+input.value, ...range);
      globals.color = col.cmyk2rgb(...cmyk);
      updateColorDisplay();
    });
    p.appendChild(input);
    p.insertAdjacentHTML("beforeend", " &nbsp;&nbsp;");
    let spectrum = new col.Spectrum_1D("cmyk", Array.from({ length: 4 }, (_, j) => i === j ? NaN : 0) as [number, number, number], range, col.cmyk2rgb);
    globals.spectra1d.push(spectrum);
    spectrum.stops.push(globals.color[i]);
    let I = spectrum.createInteractive(SPECTRA_WIDTH, SPECTRA_HEIGHT, 0, "span");
    I.onclick = () => {
      let cmyk = col.rgb2cmyk(...globals.color);
      cmyk[i] = spectrum.stops[0];
      globals.color = col.cmyk2rgb(...cmyk);
      updateColorDisplay();
    };
    p.appendChild(I.element);
    container.appendChild(p);
  }

  return container;
}

/** Pick color using HSL color space */
function generatePickUsingHSL() {
  const container = document.createElement("div");

  let title = document.createElement("h2");
  title.classList.add("color-display");
  title.dataset.model = "hsl";
  container.appendChild(title);

  for (let i = 0; i < 3; i++) {
    let range = [0, i === 0 ? 360 : 100] as [number, number];
    let p = document.createElement("p");
    let input = document.createElement("input");
    input.type = "number";
    input.min = range[0].toString();
    input.max = range[1].toString();
    input.classList.add("color-display");
    input.dataset.model = "hsl";
    input.dataset.index = i.toString();
    input.addEventListener("change", () => {
      let hsl = col.rgb2hsl(...globals.color);
      hsl[i] = col.clamp(+input.value, ...range);
      globals.color = col.hsl2rgb(...hsl);
      updateColorDisplay();
    });
    p.appendChild(input);
    p.insertAdjacentHTML("beforeend", " &nbsp;&nbsp;");
    let spectrum = new col.Spectrum_1D("hsl", [0, 100, 50].map((v, j) => i === j ? NaN : v) as [number, number, number], range, col.hsl2rgb);
    globals.spectra1d.push(spectrum);
    spectrum.stops.push(globals.color[i]);
    let I = spectrum.createInteractive(SPECTRA_WIDTH, SPECTRA_HEIGHT, 0, "span");
    I.onclick = () => {
      let hsl = col.rgb2hsl(...globals.color);
      hsl[i] = spectrum.stops[0];
      globals.color = col.hsl2rgb(...hsl);
      updateColorDisplay();
    };
    p.appendChild(I.element);
    container.appendChild(p);
  }

  return container;
}

/** Pick color from an image */
function generatePickUsingImage() {
  /** Update canvas size according to screen size */
  const setCanvasSize = () => {
    canvas.width = window.innerWidth * 0.66;
    canvas.height = window.innerHeight * 0.5;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.filter = filter.toString();
  };

  /** Apply new filter */
  const applyFilter = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fstr = filter.toString();
    ctx.filter = fstr;
    ctx.drawImage(withoutFilters, 0, 0);
  };

  const container = document.createElement("div");
  let canvasDiv = document.createElement("div");
  container.appendChild(canvasDiv);
  const canvas = document.createElement("canvas"), filter = new CanvasFilter();
  let ctx: CanvasRenderingContext2D, withoutFilters = new Image(); // withoutFilters -> Image of canvas without filters

  window.addEventListener("resize", () => setCanvasSize());
  setCanvasSize();
  canvas.style.border = "1px solid black";
  canvas.style.cursor = "crosshair";
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvasDiv.appendChild(canvas);

  canvasDiv.addEventListener("mousemove", e => {
    let [x, y] = col.extractCoords(e);
    let rgb = Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 4)) as [number, number, number];
    let hex = col.rgb2hex(...rgb);
    swatch.style.backgroundColor = hex;
    swatchSpan.innerText = hex;
  });

  canvasDiv.addEventListener("click", e => {
    let [x, y] = col.extractCoords(e);
    let rgb = Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 4)) as [number, number, number];
    globals.color = rgb;
    updateColorDisplay();
    window.scrollTo(window.scrollX, 0);
  });

  // Show current color
  let p = document.createElement("p");
  let swatch = document.createElement("span");
  swatch.style.border = "1px solid black";
  swatch.style.height = "30px";
  swatch.style.width = "30px";
  swatch.style.display = "inline-block";
  swatch.style.backgroundColor = "black";
  p.appendChild(swatch);
  p.insertAdjacentHTML("beforeend", " &nbsp;&nbsp;");
  let swatchSpan = document.createElement("span");
  swatchSpan.innerText = "#000000";
  p.appendChild(swatchSpan);
  container.appendChild(p);

  // Upload new image
  p = document.createElement("p");
  container.appendChild(p);
  let btn = document.createElement("button");
  btn.innerText = "Upload Image";
  let upload = document.createElement("input");
  upload.type = "file";
  upload.accept = "image/*";
  btn.addEventListener("click", () => upload.click());
  upload.addEventListener("change", async () => {
    let file = upload.files?.[0];
    if (file) {
      let url = await new Promise<string>(res => {
        let reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(file as File);
      });
      let img = new Image();
      await new Promise(res => {
        img.onload = res;
        img.src = url;
      });
      let oc = new OffscreenCanvas(img.width, img.height), occtx = oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
      occtx.drawImage(img, 0, 0);
      let m = Math.min(canvas.width / img.width, canvas.height / img.height);
      let x = img.width * m < canvas.width ? (canvas.width - m * img.width) / 2 : 0;
      let y = img.height * m < canvas.height ? (canvas.height - m * img.height) / 2 : 0;
      if (ctx.globalCompositeOperation === "source-over") {
        ctx.fillStyle = "#EEEEEE";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(x, y, img.width * m, img.height * m);
      }
      ctx.drawImage(oc, x, y, img.width * m, img.height * m);

      url = canvas.toDataURL();
      withoutFilters = await new Promise(r => {
        let i = new Image();
        i.onload = () => r(i);
        i.src = url;
      });
    }
  });
  p.appendChild(btn);

  // Clear
  p.insertAdjacentHTML("beforeend", " &nbsp;");
  btn = document.createElement("button");
  btn.innerText = "Clear";
  btn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  p.appendChild(btn);

  // Download
  if (globals.user && globals.user.pro) {
    p.insertAdjacentHTML("beforeend", " &nbsp;");
    btn = document.createElement("button");
    btn.innerText = "Download Image";
    let downloadAs: string = "image/png";
    btn.addEventListener("click", async () => {
      let url = canvas.toDataURL(downloadAs);
      let link = document.createElement("a");
      link.href = url;
      link.download = "image";
      link.click();
    });
    let selectImageOut = document.createElement("select");
    selectImageOut.insertAdjacentHTML("beforeend", "<option value='image/png'>PNG</option>");
    selectImageOut.insertAdjacentHTML("beforeend", "<option value='image/jpeg'>JPEG</option>");
    selectImageOut.insertAdjacentHTML("beforeend", "<option value='image/webp'>WEBP</option>");
    selectImageOut.addEventListener("change", () => downloadAs = selectImageOut.value);
    p.appendChild(btn);
    p.insertAdjacentHTML("beforeend", " as ");
    p.appendChild(selectImageOut);
  }

  if (globals.user && globals.user.pro) {
    // Image overlay option
    p = document.createElement("p");
    p.insertAdjacentHTML("beforeend", "Image overlay option: ");
    let selectImageIn = document.createElement("select");
    globalCompositionOperations.forEach(op => selectImageIn.insertAdjacentHTML("beforeend", `<option value='${op}'>${formatString(op)}</option>`));
    (selectImageIn.querySelector("option[value='source-over']") as HTMLOptionElement).selected = true;
    selectImageIn.addEventListener("click", () => (ctx.globalCompositeOperation = selectImageIn.value as GlobalCompositeOperation));
    p.appendChild(selectImageIn);
    container.appendChild(p);

    // Filter
    let title = document.createElement("h3");
    title.innerHTML = "Filters &mdash; ";
    btn = document.createElement("button");
    btn.innerText = "Reset";
    btn.addEventListener("click", () => {
      //Filter
      filter.reset();
      fctrl.remove();
      fctrl = filter.generateHTMLControl(applyFilter);
      fctrlDiv.appendChild(fctrl);
      applyFilter();
      //Image composition
      (selectImageIn.querySelector("option[value='source-over']") as HTMLOptionElement).selected = true;
      ctx.globalCompositeOperation = "source-over";
    });
    title.appendChild(btn);
    container.appendChild(title);
    let fctrlDiv = document.createElement("div");
    container.appendChild(fctrlDiv);
    let fctrl = filter.generateHTMLControl(applyFilter);
    fctrlDiv.append(fctrl);
  }


  return container;
}

interface IColorListItem {
  series: string;
  name: string;
  hex: string;
  el: HTMLParagraphElement;
}
interface IColorListTitle {
  title: string;
}
type ColorList = (IColorListItem | IColorListTitle)[];

/** Select color using color names */
function generatePickUsingNames() {
  const container = document.createElement("div");
  container.append(generateColorListElement(paints));
  return container;
}