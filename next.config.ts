/** @type {import('next').NextConfig} */
const nextConfig = {
    // On coupe toutes les vérifications strictes
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Configuration pour que l'IA fonctionne
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
};

export default nextConfig;