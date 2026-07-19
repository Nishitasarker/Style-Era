import type { NextConfig } from "next";

const nextConfig: NextConfig ={
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ImgBB এর ডোমেইন
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // আগের ডোমেইনটিও রাখা ভালো
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;
