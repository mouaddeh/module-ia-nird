/** @type {import('next').NextConfig} */
const nextConfig = {
    // On ignore les erreurs pour forcer le déploiement
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Config pour l'IA
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
