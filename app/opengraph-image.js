import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

// The preview card shown when the site is shared on WhatsApp, LinkedIn, X, Slack, ...
// Rendered once at build time.
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [logo, outfitMedium, outfitExtraBold] = await Promise.all([
  readFile(join(process.cwd(), "public/company_logo.jpeg"), "base64"),
  readFile(join(process.cwd(), "assets/fonts/Outfit-Medium.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Outfit-ExtraBold.ttf")),
]);

const GOLD = "#D4AF37";
const MUTED = "#A6A6A6";

// Mirrors the hero heading, with the middle line in gold
const headline = [
  { text: "Building digital experiences", color: "#FFFFFF" },
  { text: "that move business", color: GOLD },
  { text: "forward.", color: "#FFFFFF" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
          gap: 56,
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(circle at 78% 12%, rgba(210,170,55,0.22), transparent 45%), radial-gradient(circle at 10% 100%, rgba(216,216,216,0.08), transparent 40%)",
          fontFamily: "Outfit",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${logo}`}
          width={360}
          height={360}
          style={{
            borderRadius: 32,
            border: `2px solid ${GOLD}`,
            boxShadow: "0 0 60px rgba(212,175,55,0.35)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: GOLD,
              marginBottom: 22,
            }}
          >
            SOFTWARE · WEB · MOBILE · CLOUD · AI
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginBottom: 30 }}>
            {headline.map((line) => (
              <div
                key={line.text}
                style={{
                  display: "flex",
                  fontSize: 50,
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: "-0.02em",
                  color: line.color,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", fontSize: 22, fontWeight: 500, color: MUTED }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfitMedium, style: "normal", weight: 500 },
        { name: "Outfit", data: outfitExtraBold, style: "normal", weight: 800 },
      ],
    }
  );
}
