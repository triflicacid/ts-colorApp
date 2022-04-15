import * as col from "../lib/color";

export interface IColorSeries {
  type: string;
  make: string;
  series: string;
  colors: { name: string; hex: string; }[];
}

export const paints: IColorSeries[] = [
  {
    type: "acrylic",
    make: "winsor-and-newton",
    series: "galeria-acrylic",
    colors: [
      { name: "pale lemon", hex: "#F3ECC2" },
      { name: "lemon yellow", hex: "#F0D701" },
      { name: "cadmium yellow pale hue", hex: "#F0D200" },
      { name: "transparent yellow", hex: "#CB8703" },
      { name: "cadmium yellow deep hue", hex: "#F69900" },
      { name: "flesh tint", hex: "#BE8C6B" },
      { name: "cadmium orange hue", hex: "#D5320F" },
      { name: "vermilion hue", hex: "#DA281E" },
      { name: "cadmium red hue", hex: "#A71314" },
      { name: "crimson", hex: "#A60313" },
      { name: "permanent alizarin crimson", hex: "#931722" },
      { name: "permanent rose", hex: "#B10923" },
      { name: "opera rose", hex: "#FE3A9A" },
      { name: "permanant magenta", hex: "#680A28" },
      { name: "burgundy", hex: "#451B25" },
      { name: "pale violet", hex: "#B1A7DB" },
      { name: "winsow violet", hex: "#221C25" },
      { name: "ultramarine", hex: "#121C38" },
      { name: "powder blue", hex: "#9FB8E0" },
      { name: "cobalt blue hue", hex: "#0145B2" },
      { name: "cerulean blue hue", hex: "#0060AC" },
      { name: "winsor blue", hex: "#0B193E" },
      { name: "prussian blue hue", hex: "#121524" },
      { name: "phthalo blue", hex: "#0B2645" },
      { name: "deep turquoise", hex: "#004875" },
      { name: "pale olive", hex: "#7CA482" },
      { name: "sap green", hex: "#1D4F2A" },
      { name: "olive green", hex: "#1F2921" },
      { name: "hooker's green", hex: "#19231B" },
      { name: "permanant green light", hex: "#01A427" },
      { name: "permanant green middle", hex: "#016944" },
      { name: "permanant green deep", hex: "#01493E" },
      { name: "phthalo green", hex: "#113322" },
      { name: "green gold", hex: "#8B7302" },
      { name: "buff titanium", hex: "#CFB680" },
      { name: "naples yellow", hex: "#D1A54C" },
      { name: "yellow ochre", hex: "#A47219" },
      { name: "raw sienna opaque", hex: "#9F5A23" },
      { name: "raw sienna", hex: "#6F3913" },
      { name: "burnt sienna", hex: "#512113" },
      { name: "burnt sienna opaque", hex: "#652C1B" },
      { name: "pale terracotta", hex: "#D59F7D" },
      { name: "red ochre", hex: "#6A241A" },
      { name: "burnt umber", hex: "#271916" },
      { name: "pale umber", hex: "#B5A79C" },
      { name: "raw umber", hex: "#2B2219" },
      { name: "vandyke brown", hex: "#2B2622" },
      { name: "payne's gray", hex: "#1F2025" },
      { name: "ivory black", hex: "#1C1C1E" },
      { name: "lamp black", hex: "#1F1F1F" },
      { name: "mars black", hex: "#222224" },
      { name: "mixing white", hex: "#E8E7E3" },
      { name: "titanium white", hex: "#E4E3E1" },
      { name: "gold", hex: "#B37E42" },
      { name: "copper", hex: "#994224" },
      { name: "silver", hex: "#B5B3B4" },
      { name: "process yellow", hex: "#F7CE00" },
      { name: "process magenta", hex: "#AE1625" },
      { name: "process cyan", hex: "#023075" }
    ]
  },
  {
    type: "acrylic",
    make: "winsor-and-newton",
    series: "professional-acrylic",
    colors: [
      { name: "lemon yellow", hex: "#ECD934" },
      { name: "cadmium lemon", hex: "#E3CB37" },
      { name: "bismuth yellow", hex: "#E5CB02" },
      { name: "cadmium yellow light", hex: "#DABD01" },
      { name: "nickel azo yellow", hex: "#D89102" },
      { name: "azo yellow medium", hex: "#DBAD00" },
      { name: "cadmium yellow medium", hex: "#E4AB03" },
      { name: "cadmium yellow deep", hex: "#EA9D02" },
      { name: "azo yellow deep", hex: "#E78D02" },
      { name: "cadmium orange", hex: "#E66B01" },
      { name: "pyrrole orange", hex: "#E94C17" },
      { name: "cadmium red light", hex: "#DC3218" },
      { name: "pyrrole red light", hex: "#C61618" },
      { name: "cadmium red medium", hex: "#BF1F21" },
      { name: "napthol red light", hex: "#A90609" },
      { name: "pyrrole red", hex: "#A1000C" },
      { name: "cadmium red deep", hex: "#97151F" },
      { name: "quinacridone red", hex: "#E45950" },
      { name: "perylene red", hex: "#840C15" },
      { name: "napthol red medium", hex: "#A60F1E" },
      { name: "permanant rose", hex: "#B90824" },
      { name: "permanant alizarin crimson", hex: "#CD1E3B" },
      { name: "perylene maroon", hex: "#6A1C22" },
      { name: "quinacridone violet", hex: "#4E121E" },
      { name: "quinacridone magenta", hex: "#871336" },
      { name: "perylene violet", hex: "#361A17" },
      { name: "dioxazine purple", hex: "#3E2C7E" },
      { name: "ultramarine violet", hex: "#6A6BBE" },
      { name: "indanthrene blue", hex: "#221D24" },
      { name: "ultramarine blue", hex: "#0029A7" },
      { name: "cobalt blue deep", hex: "#012072" },
      { name: "cobalt blue", hex: "#024DCA" },
      { name: "phthalo blue (red shade)", hex: "#141A31" },
      { name: "phthalo blue (green shade)", hex: "#151934" },
      { name: "cerulean blue", hex: "#017ECE" },
      { name: "cerulean blue chromium", hex: "#044A9A" },
      { name: "cerulean blue hue", hex: "#0764B2" },
      { name: "cobalt turquoise light", hex: "#008C9D" },
      { name: "cobalt turquoise", hex: "#05556E" },
      { name: "phthalo turquoise", hex: "#002C59" },
      { name: "phthalo green (yellow shade)", hex: "#016436" },
      { name: "cobalt green", hex: "#037D5E" },
      { name: "phthalo green (blue shade)", hex: "#0B2325" },
      { name: "cobalt green deep", hex: "#113835" },
      { name: "chromium oxide green", hex: "#3F5B2A" },
      { name: "hooker's green", hex: "#182219" },
      { name: "perylene green", hex: "#1D1B1C" },
      { name: "permanant sap green", hex: "#414A0F" },
      { name: "olive green", hex: "#82620C" },
      { name: "green gold", hex: "#7F5E15" },
      { name: "buff titanium", hex: "#CEB175" },
      { name: "naples yellow", hex: "#E3B46C" },
      { name: "naples yellow deep", hex: "#CD8B2C" },
      { name: "yellow ochre", hex: "#AF6816" },
      { name: "yellow iron oxide", hex: "#9A6B19" },
      { name: "gold ochre", hex: "#D16E11" },
      { name: "quinacridone gold", hex: "#AF4923" },
      { name: "raw sienna", hex: "#754A27" },
      { name: "burnt sienna", hex: "#572019" },
      { name: "potter's pink", hex: "#9D4249" },
      { name: "light red", hex: "#B8441F" },
      { name: "red iron oxide", hex: "#712C1C" },
      { name: "quinacridone burnt orange", hex: "#A62E20" },
      { name: "violet iron oxide", hex: "#481F1D" },
      { name: "raw umber light", hex: "#CE9841" },
      { name: "raw umber", hex: "#2D2A25" },
      { name: "burnt umber", hex: "#2B211F" },
      { name: "davy's gray", hex: "#CABB91" },
      { name: "graphite grey", hex: "#333333" },
      { name: "payne's gray", hex: "#201F24" },
      { name: "ivory black", hex: "#1B1B1B" },
      { name: "mars black", hex: "#1E1E1E" },
      { name: "mixing white", hex: "#E2DFDA" },
      { name: "titanium white", hex: "#DBDAD6" },
      { name: "iridescent white", hex: "#D7D3D2" },
      { name: "silver", hex: "#BCBABD" },
      { name: "silver (2)", hex: "#676664" },
      { name: "gold", hex: "#C99F53" },
      { name: "renaissance gold", hex: "#B98651" },
      { name: "antique gold", hex: "#CCAF61" }
    ]
  }
];

/** Transform simple color map { name -> hex } to IColorSeries object */
export function toColorSeries(type: string, make: string, series: string, colors: { [name: string]: string }): IColorSeries {
  return { type, make, series, colors: Object.entries(colors).map(([name, hex]) => ({ name, hex: hex.toUpperCase() })) };
}

/** Return closest colours via HSL */
export function getClosestColor(rgb: [number, number, number], tolerance: [number, number, number] = [15, 50, 50], colors = paints) {
  tolerance[0] = col.clamp(tolerance[0] % 360, 0, 360);
  const targetHSL = col.rgb2hsl(...rgb);
  const close: IColorSeries[] = [];
  for (const cseries of colors) {
    const repr = { type: cseries.type, make: cseries.make, series: cseries.series, colors: [] } as IColorSeries;
    for (const color of cseries.colors) {
      const hsl = col.rgb2hsl(...col.hex2rgb(color.hex));
      if (targetHSL.every((_, i) => targetHSL[i] - tolerance[i] <= hsl[i] && hsl[i] <= targetHSL[i] + tolerance[i])) {
        repr.colors.push(color);
      }
    }
    if (repr.colors.length > 0) close.push(repr);
  }
  return close;
}