import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ⚠️ 危险：这将在构建时完全忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
