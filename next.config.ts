import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Configure for web-only usage
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': false,
      'sharp': false,
    };

    // Add fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      'stream': false,
      'os': false,
    };

    return config;
  },
  // Add transpilePackages to handle @xenova/transformers
  transpilePackages: ['@xenova/transformers'],
};

export default nextConfig;
