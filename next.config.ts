import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.137.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
        port: '',
        pathname: '/widgets/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 's1.qwant.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
}

export default nextConfig;