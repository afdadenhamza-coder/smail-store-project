/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    domains: ["localhost"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
  // Reduce dev overlay noise
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
