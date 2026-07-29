/** Shared frame for the OG images rendered by next/og (flexbox-only CSS). */

export const OG_SIZE = { width: 1200, height: 630 } as const;

type Tile = { label: string; value: string; color?: string };

export function OgFrame({
  eyebrow,
  title,
  subtitle,
  tiles = [],
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  tiles?: Tile[];
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0b0d10",
        color: "#e8eaef",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "rgba(212, 163, 92, 0.16)",
            color: "#f0c989",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          54
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#f0c989",
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 82, fontWeight: 700 }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            lineHeight: 1.35,
            color: "#9aa3b2",
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {tiles.map((tile) => (
          <div
            key={tile.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "20px 28px",
              borderRadius: 16,
              border: "1px solid rgba(232, 234, 239, 0.12)",
              background: "#12151b",
            }}
          >
            <div style={{ display: "flex", fontSize: 20, color: "#6b7382" }}>
              {tile.label}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 700,
                color: tile.color ?? "#e8eaef",
              }}
            >
              {tile.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
