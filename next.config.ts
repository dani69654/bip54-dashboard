import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
