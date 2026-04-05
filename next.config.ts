import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Small black ball in development mode.
  devIndicators: false,

  // SEO optimizations
  compress: true,
  poweredByHeader: false,

  // Optimize image handling.
  images: {
    domains: ['quantplex.ai'], // Add any domains you need to load images from.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
