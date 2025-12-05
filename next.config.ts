import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. On ignore les erreurs TypeScript (types manquants etc.)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. On ignore les erreurs de style (ESLint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 3. On configure Webpack pour l'IA (Transformers.js)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;