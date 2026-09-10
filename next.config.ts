import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force HTTPS so Google/Bing only ever see one protocol version of each
  // page. Without this, http://bip-54.com serves the same content as
  // https://bip-54.com, and Search Console flags the http copies as
  // "Alternative page with proper canonical tag" (not indexed).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: `https://bip-54.com/:path*`,
        permanent: true,
      },
    ];
  },

  // Same-origin proxies so the browser can load mainnet.observer CSVs
  // without hitting CORS (client-side fetch from the dashboard).
  async rewrites() {
    return [
      {
        source: "/data/miningpools-mining-bip54-coinbase.csv",
        destination:
          "https://mainnet.observer/csv/miningpools-mining-bip54-coinbase.csv",
      },
      {
        source: "/data/coinbase_locktime_set_bip54_avg.csv",
        destination:
          "https://mainnet.observer/csv/coinbase_locktime_set_bip54_avg.csv",
      },
      {
        source: "/data/date.csv",
        destination: "https://mainnet.observer/csv/date.csv",
      },
    ];
  },
};

export default nextConfig;
