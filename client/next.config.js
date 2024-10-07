/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content-Security-Policy désactivée
          {
            key: 'Content-Security-Policy',
            value: `
              default-src * data: blob: 'unsafe-inline' 'unsafe-eval';
              connect-src *;
              script-src * 'unsafe-inline' 'unsafe-eval';
              style-src * 'unsafe-inline';
              img-src * data: blob:;
              font-src *;
              frame-src *;
            `.replace(/\s+/g, ' ').trim()
          },

          // X-Frame-Options désactivée
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },

          // Cross-Origin-Opener-Policy désactivée
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },

          // Autres en-têtes désactivés ou allégés
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Ajout de la configuration pour résoudre les alias
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    
    return config;
  },
};

module.exports = nextConfig;
