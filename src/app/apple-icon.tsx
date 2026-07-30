import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — larger rendering of the BIP54 mark. */
export default function AppleIcon() {
  const gold = "#f0c989";
  const goldDeep = "#d4a35c";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1a1f28 0%, #0b0d10 100%)",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: 34,
            border: `3.5px solid ${goldDeep}`,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 20,
            height: 20,
            borderTop: `4px solid ${gold}`,
            borderLeft: `4px solid ${gold}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 20,
            height: 20,
            borderTop: `4px solid ${gold}`,
            borderRight: `4px solid ${gold}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 20,
            height: 20,
            borderBottom: `4px solid ${gold}`,
            borderLeft: `4px solid ${gold}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 20,
            height: 20,
            borderBottom: `4px solid ${gold}`,
            borderRight: `4px solid ${gold}`,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: -4,
              color: gold,
              lineHeight: 1,
            }}
          >
            54
          </div>
          <div
            style={{
              display: "flex",
              width: 70,
              height: 4,
              borderRadius: 99,
              background: "rgba(212,163,92,0.55)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 10,
                height: 10,
                borderRadius: 99,
                background: goldDeep,
                display: "flex",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
