import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isGithubPages
    ? {
        basePath: "/CV/lexrise",
        assetPrefix: "/CV/lexrise",
      }
    : {}),
};

export default nextConfig;
