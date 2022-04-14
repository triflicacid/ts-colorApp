export interface DropShadow {
  offsetX: string;
  offsetY: string;
  radius: string;
  color: string;
}

export class CanvasFilter {
  private _blur: number = 0;
  private _brightness: number = 100;
  private _contrast: number = 100;
  private _dropShadow: DropShadow = { offsetX: "0", offsetY: "0", radius: "0", color: "none" };
  private _doDrawShadow = false;
  private _grayscale: number = 0;
  private _hueRotate: number = 0;
  private _invert: number = 0;
  private _opacity: number = 100;
  private _saturate: number = 100;
  private _sepia: number = 0;

  constructor() {
    this.reset();
  }

  /** Reset values to initial (i.e. no filter) */
  public reset() {
    this._blur = 0;
    this._brightness = 100;
    this._contrast = 100;
    this._dropShadow = { offsetX: "0", offsetY: "0", radius: "0", color: "none" };
    this._doDrawShadow = false
    this._grayscale = 0;
    this._hueRotate = 0;
    this._invert = 0;
    this._opacity = 100;
    this._saturate = 100;
    this._sepia = 0;
    return this;
  }

  /** A numerical length in pixels. Applies a Gaussian blur to the drawing. It defines the value of the standard
   * deviation to the Gaussian function, i.e., how many pixels on the screen blend into each other;
   * thus, a larger value will create more blur. A value of 0 leaves the input unchanged. */
  public blur(): number;
  public blur(b: number): this;
  public blur(b?: number) {
    if (b === undefined) return this._blur;
    this._blur = b;
    return this;
  }

  /** A CSS `<percentage>`. Applies a linear multiplier to the drawing, making it appear brighter or darker.
   * A value under 100% darkens the image, while a value over 100% brightens it. A value of 0% will create
   * an image that is completely black, while a value of 100% leaves the input unchanged. */
  public brightness(): number;
  public brightness(p: number): this;
  public brightness(p?: number) {
    if (p === undefined) return this._brightness;
    this._brightness = p;
    return this;
  }

  /** A CSS `<percentage>`. Adjusts the contrast of the drawing. A value of 0% will create a drawing that is
   * completely black. A value of 100% leaves the drawing unchanged. */
  public contrast(): number;
  public contrast(p: number): this;
  public contrast(p?: number) {
    if (p === undefined) return this._contrast;
    this._contrast = p;
    return this;
  }

  /** Applies a drop shadow effect to the drawing. A drop shadow is effectively a blurred, offset version
   * of the drawing's alpha mask drawn in a particular color, composited below the drawing.
   * This function takes a DropShadow object with the following properties:
   * @property offsetX - CSS `<length>`. Specifies the horizontal distance of the shadow.
   * @property offsetY - CSS `<length>`. Specifies the vertical distance of the shadow.
   * @property radius - CSS `<length>`. The larger this value, the bigger the blur, so the shadow becomes bigger and lighter. Negative values are not allowed.
   * @property color - CSS color of shadow
  */
  public dropShadow(): DropShadow;
  public dropShadow(shadow: DropShadow): this;
  public dropShadow(shadow?: DropShadow) {
    if (shadow === undefined) return this._dropShadow;
    this._doDrawShadow = true;
    this._dropShadow = shadow;
    return this;
  }

  /** Remove drop shadow filter */
  public removeDropShadow() {
    this._dropShadow = { offsetX: "0", offsetY: "0", radius: "0", color: "none" };
    this._doDrawShadow = false;
    return this;
  }

  /** A CSS `<percentage>`. Converts the drawing to grayscale.
   * A value of 100% is completely grayscale.
   * A value of 0% leaves the drawing unchanged. */
  public grayscale(): number;
  public grayscale(p: number): this;
  public grayscale(p?: number) {
    if (p === undefined) return this._grayscale;
    this._grayscale = p;
    return this;
  }

  /** Angle in degrees. Applies a hue rotation on the drawing.
   * A value of 0 leaves the input unchanged. */
  public hueRotate(): number;
  public hueRotate(θ: number): this;
  public hueRotate(θ?: number) {
    if (θ === undefined) return this._hueRotate;
    this._hueRotate = θ;
    return this;
  }

  /** A CSS `<percentage>`. Inverts the drawing.
   * A value of 100% means complete inversion.
   * A value of 0% leaves the drawing unchanged. */
  public invert(): number;
  public invert(p: number): this;
  public invert(p?: number) {
    if (p === undefined) return this._invert;
    this._invert = p;
    return this;
  }

  /** A CSS `<percentage>`. Applies transparency to the drawing.
   * A value of 0% means completely transparent. A value of 100%
   * leaves the drawing unchanged. */
  public opacity(): number;
  public opacity(p: number): this;
  public opacity(p?: number) {
    if (p === undefined) return this._opacity;
    this._opacity = p;
    return this;
  }

  /** A CSS `<percentage>`. Saturates the drawing. A value
   * of 0% means completely un-saturated. A value of 100%
   * leaves the drawing unchanged. */
  public saturate(): number;
  public saturate(p: number): this;
  public saturate(p?: number) {
    if (p === undefined) return this._saturate;
    this._saturate = p;
    return this;
  }

  /** A CSS `<percentage>`. Converts the drawing to sepia.
   * A value of 100% means completely sepia. A value of 0%
   * leaves the drawing unchanged. */
  public sepia(): number;
  public sepia(p: number): this;
  public sepia(p?: number) {
    if (p === undefined) return this._sepia;
    this._sepia = p;
    return this;
  }

  /** Return CSS filter DOMString representation. `ignore` uneccessary filters? */
  public toString(ignore = true) {
    let parts: string[] = [];
    if (!ignore || this._blur !== 0) parts.push(`blur(${this._blur}px)`);
    if (!ignore || this._brightness !== 100) parts.push(`brightness(${this._brightness}%)`);
    if (!ignore || this._contrast !== 100) parts.push(`contrast(${this._contrast}%)`);
    if (!ignore || this._doDrawShadow) parts.push(`drop-shadow(${this._dropShadow.offsetX} ${this._dropShadow.offsetY} ${this._dropShadow.radius} ${this._dropShadow.color})`);
    if (!ignore || this._grayscale !== 0) parts.push(`grayscale(${this._grayscale}%)`);
    if (!ignore || this._hueRotate !== 0) parts.push(`hue-rotate(${this._hueRotate}deg)`);
    if (!ignore || this._invert !== 0) parts.push(`invert(${this._invert}%)`);
    if (!ignore || this._opacity !== 100) parts.push(`opacity(${this._opacity}%)`);
    if (!ignore || this._saturate !== 100) parts.push(`saturate(${this._saturate}%)`);
    if (!ignore || this._sepia !== 0) parts.push(`sepia(${this._sepia}%)`);
    return parts.length === 0 ? "none" : parts.join(" ");
  }

  /** Generate HTML input for controlling the filter */
  public generateHTMLControl(onchange?: (prop: string, val: any) => void) {
    const div = document.createElement("div");
    [
      { text: "Blur", prop: "blur", type: "number", min: 0, max: 50 },
      { text: "Contrast", prop: "contrast", type: "number" },
      { text: "Grayscale", prop: "grayscale", type: "number", min: 0, max: 100 },
      { text: "Rotate Hue", prop: "hueRotate", type: "number", min: 0, max: 360 },
      { text: "Invert", prop: "invert", type: "number", min: 0, max: 100 },
      { text: "Opacity", prop: "opacity", type: "number", min: 0, max: 100 },
      { text: "Saturation", prop: "saturate", type: "number", min: 0, max: 100 },
      { text: "Sepia", prop: "sepia", type: "number", min: 0, max: 100 },
    ].forEach(obj => {
      let p = document.createElement("p"), prop = ("_" + obj.prop) as keyof this;
      p.insertAdjacentHTML("beforeend", `<strong>${obj.text}</strong> &mdash; `);
      let input = document.createElement("input"), input2: HTMLInputElement | undefined = undefined, event: keyof HTMLElementEventMap;
      if (obj.type === "number" && obj.min !== undefined) {
        input.type = "range";
        input2 = document.createElement("input");
        input.min = input2.min = obj.min.toString();
        input.max = input2.max = obj.max.toString();
        event = "input";
      } else {
        input.type = obj.type;
        event = "change";
      }
      input.title = obj.prop;
      input.value = "" + this[prop];
      if (input2) input2.value = input.value;
      input.addEventListener(event, () => {
        let value = obj.type === "number" ? +input.value : input.value;
        this[prop] = value as any;
        if (input2) input2.value = value.toString();
        if (onchange) onchange(obj.prop, value);
      });
      p.appendChild(input);
      if (input2) {
        input2.addEventListener(event, () => {
          if (input2) {
            let value = obj.type === "number" ? +input2.value : input2.value;
            this[prop] = value as any;
            input.value = value.toString();
            if (onchange) onchange(obj.prop, value);
          }
        });

        p.insertAdjacentHTML("beforeend", " &nbsp;&nbsp;");
        p.appendChild(input2);
      }
      div.appendChild(p);
    });
    return div;
  }

  /** Clone. */
  public clone() {
    return new CanvasFilter()
      .blur(this._blur)
      .brightness(this._brightness)
      .contrast(this._contrast)
      .dropShadow(this._dropShadow)
      .grayscale(this._grayscale)
      .hueRotate(this._hueRotate)
      .invert(this._invert)
      .opacity(this._opacity)
      .saturate(this._saturate)
      .sepia(this._sepia);
  }
}