import type { Tabs } from "../lib/Tabs";
import type { Spectrum } from "../lib/color";

export interface IGlobals {
  title: string;
  color: [number, number, number];
  tabs: Tabs | undefined;
  spectra: Spectrum[];
}

export const globals: IGlobals = {
  title: "Color",
  color: [0, 0, 0], // Active RGB color
  tabs: undefined,
  spectra: [],
};

export default globals;