import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour que Transformers.js (le moteur IA) fonctionne sans erreur
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