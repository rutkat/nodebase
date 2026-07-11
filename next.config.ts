import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
const nextConfig: NextConfig = {
  // Your existing Next.js configuration
  // devIndicators: false,
  async redirects() {
    return [{
      source: "/",
      destination: "/workflows",
      permanent: false,
    }]
  }
};
export default withSentryConfig(nextConfig, {
  org: "rtg-g0",
  project: "nodebase",
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
});