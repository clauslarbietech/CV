import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isGithubPages
    ? {
        basePath: "/Dyslexia-support-app",
        assetPrefix: "/Dyslexia-support-app",
      }
    : {}),
};

export default nextConfig;
