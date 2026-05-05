/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.dummyjson.com',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
    // Allow external images from DummyJSON
    unoptimized: true,
  },
};

module.exports = nextConfig;
