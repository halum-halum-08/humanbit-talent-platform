import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if there are type errors
    ignoreBuildErrors: true,
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  experimental: {
    // Enable optimizations for better performance
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Ensure proper image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
