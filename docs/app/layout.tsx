import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import * as fonts from "@/assets/fonts";
import { meta, view } from "@/meta";
import "@assets/styles/global.css";

export const metadata: Metadata = meta;
export const viewport: Viewport = view;

const fontVariables = (Object.values(fonts) as unknown as fonts.FontType[])
  .map((font) => font.variable)
  .join(" ");

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-figtree">
        <RootProvider search={{ options: { type: "static" } }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
