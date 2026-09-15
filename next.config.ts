import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HTTP -> HTTPS is handled by Cloudflare at the edge (it preserves the
  // path). A next.config redirect must NOT be used for this: Cloudflare's
  // edge does not interpolate `:path*` in the destination, so the Location
  // header ends up as the literal `https://bip-54.com/:path*` and the site
  // never loads.

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
