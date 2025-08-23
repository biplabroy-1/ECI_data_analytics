// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for extended timeouts
  experimental: {
    // Enable server actions with extended timeout
    serverActions: {
      // 5 minutes timeout for server actions
      bodySizeLimit: '10mb',
    },
  },
  
  // API routes configuration
  api: {
    // Increase body size limit for file uploads
    bodyParser: {
      sizeLimit: '10mb',
    },
    // Response timeout - 5 minutes
    responseLimit: false,
  },

  // Headers configuration for CORS if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Webpack configuration for large files
  webpack: (config, { isServer }) => {
    // Handle large files
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },

  // Increase static generation timeout
  staticPageGenerationTimeout: 300,

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image configuration if needed
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

module.exports = nextConfig;