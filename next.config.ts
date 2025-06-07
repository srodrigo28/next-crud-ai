// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todos os domínios HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Permite todos os domínios HTTP
      },
    ],
  },
};

export default nextConfig;