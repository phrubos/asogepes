/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // QA builds (scripts/qa) use NEXT_DIST_DIR=.next-qa so they never clobber a running `next dev`
  distDir: process.env.NEXT_DIST_DIR || '.next',
  serverExternalPackages: [],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Suppress hydration mismatch warnings for browser extensions
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Handle hydration mismatches gracefully
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        default: false,
        vendors: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
