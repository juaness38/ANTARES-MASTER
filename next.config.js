/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'http://3.85.5.222/api/v1',
  },
  poweredByHeader: false,
  // Optimizaciones para Vercel
  experimental: {
    serverComponentsExternalPackages: ['molstar']
  },
  // Optimizaciones de memoria para build
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configuración de webpack para optimizar el build
  webpack: (config, { isServer }) => {
    // Optimización para molstar y dependencias pesadas
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Optimización de memoria
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          molstar: {
            test: /[\\/]node_modules[\\/]molstar[\\/]/,
            name: 'molstar',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
};

module.exports = nextConfig;
