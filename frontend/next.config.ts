import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Increase from default 1mb to 5mb for image uploads
    },
  },
};

export default nextConfig;
