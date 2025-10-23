import localFont from "next/font/local";

export interface FontType {
  variable: string;
  src: string;
  weight: string;
  style: string;
  display: string;
  preload: boolean;
}

export const figtree = localFont({
  variable: "--figtree",
  src: [
    {
      path: "./figtree/Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./figtree/BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "./figtree/Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./figtree/BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./figtree/ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./figtree/ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./figtree/Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./figtree/Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./figtree/LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./figtree/Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./figtree/MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./figtree/Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./figtree/SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./figtree/SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
  ],
  display: "swap",
  preload: true,
});
