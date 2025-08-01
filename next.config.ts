import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment optimization
  experimental: {
    serverComponentsExternalPackages: ['@langchain/openai', '@langchain/community', 'langchain'],
  },
  
  // Enable webpack optimizations for serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@langchain/openai', '@langchain/community', 'langchain');
    }
    return config;
  },
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000',
  },
  
  // Headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
