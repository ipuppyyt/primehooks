import fs from "node:fs/promises";
import type { ImageResponseOptions } from "next/server";
import type { ReactNode } from "react";

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  site?: ReactNode;
  logo?: ReactNode;
}

const font = fs.readFile("./lib/og/JetBrainsMono-Regular.ttf");
const fontBold = fs.readFile("./lib/og/JetBrainsMono-Bold.ttf");

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Mono",
        data: await font,
        weight: 400,
      },
      {
        name: "Mono",
        data: await fontBold,
        weight: 600,
      },
    ],
  };
}

export function generate({
  title,
  description,
  logo,
  site = "My App",
}: GenerateProps) {
  const primaryTextColor = "rgb(240,240,240)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        backgroundImage:
          "url('https://img.freepik.com/free-vector/zigzag-lines-pattern-black-background_1017-37483.jpg')",
        backgroundColor: "rgba(27, 27, 27, 1)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "4rem",
        }}
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: "76px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "32px",
            color: "rgba(240,240,240,0.7)",
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
            marginTop: "auto",
            color: primaryTextColor,
          }}
        >
          {logo}
          <p
            style={{
              fontSize: "46px",
              fontWeight: 600,
            }}
          >
            {site}
          </p>
        </div>
      </div>
    </div>
  );
}
