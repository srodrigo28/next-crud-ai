npm install @supabase/supabase-js

npm install jsonwebtoken cookie

npm install --save-dev @types/jsonwebtoken @types/cookie


* next.config.ts
```
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
```