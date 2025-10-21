import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['fs', 'child_process'],
};

export default nextConfig;
