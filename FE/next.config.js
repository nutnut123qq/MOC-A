/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  trailingSlash: false,
  // Use src directory
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

module.exports = nextConfig;
