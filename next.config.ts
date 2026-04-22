import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Large city pages can exceed the default 60s during static export/prerender.
  staticPageGenerationTimeout: 300,
  /** Use `NEXT_DIST_DIR` when `.next` is locked (e.g. Dropbox on Windows). */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  images: { unoptimized: true },
  experimental: { cpus: 1 },
};

export default nextConfig;
