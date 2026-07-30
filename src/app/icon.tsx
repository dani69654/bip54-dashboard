import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon mark: “54” inside a soft-fork ring with four corner brackets
 * (one per consensus fix) and a locktime tick — matches site accent gold.
 */
export default function Icon() {
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
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 7,
            border: `1.5px solid ${goldDeep}`,
            display: "flex",
          }}
        />

        {/* four cleanup brackets */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 5,
            height: 5,
            borderTop: `2px solid ${gold}`,
            borderLeft: `2px solid ${gold}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 5,
            height: 5,
            borderTop: `2px solid ${gold}`,
            borderRight: `2px solid ${gold}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 4,
            width: 5,
            height: 5,
            borderBottom: `2px solid ${gold}`,
            borderLeft: `2px solid ${gold}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            width: 5,
            height: 5,
            borderBottom: `2px solid ${gold}`,
            borderRight: `2px solid ${gold}`,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            marginTop: -1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: -0.8,
              color: gold,
              lineHeight: 1,
            }}
          >
            54
          </div>
          <div
            style={{
              display: "flex",
              width: 12,
              height: 2,
              borderRadius: 99,
              background: goldDeep,
              opacity: 0.7,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 3,
                height: 3,
                borderRadius: 99,
                background: gold,
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
