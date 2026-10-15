import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH; locally it is empty so the site runs at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
