/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/api/v1',
  },
  poweredByHeader: false,
  // Configuración específica para Molstar y Vercel
  experimental: {
    serverComponentsExternalPackages: ['molstar'],
  },
  // Configuración de webpack optimizada para Molstar
  webpack: (config, { isServer, dev }) => {
    // Configuración para el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      };
      
      // Optimización específica para Molstar
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });
    }
    
    // Optimización de chunks para producción
    if (!dev) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          molstar: {
            test: /[\\/]node_modules[\\/]molstar[\\/]/,
            name: 'molstar',
            chunks: 'async',
            priority: 10,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
