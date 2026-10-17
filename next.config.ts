import type { NextConfig } from "next";

const publishPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = publishPages
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
