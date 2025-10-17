import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  typescript: {
    // keep your current behavior
    ignoreBuildErrors: true,
  },

  env: {
    SC_DISABLE_SPEEDY: 'false',
  },

  images: {
    // Prefer remotePatterns for tighter control of Sanity CDN paths
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**', // Sanity asset path
      },
    ],
    // Modern formats first; Next will negotiate and fall back if needed
    formats: ['image/avif', 'image/webp'],
    // Cache optimized variants longer (tune if you want them fresher)
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  experimental: {
    // Helps split and minify CSS per route (nice win if you saw "unused CSS")
    optimizeCss: true,
  },

  // Optional: cache headers for your own public assets (fonts/images)
  async headers() {
    return [
      {
        // everything in /public/fonts
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // everything in /public/images
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // If you deploy on platforms that benefit from it (e.g. Docker), keep this:
  // output: 'standalone',
};

export default nextConfig;
