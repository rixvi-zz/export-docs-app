import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger compatibility settings
  output: 'standalone',
  
  // Disable React Compiler for shared hosting stability
  reactCompiler: false,
  
  // Next.js 16+ configuration for Puppeteer
  serverExternalPackages: ['puppeteer'],
  
  // Use webpack instead of Turbopack for production
  turbopack: {},
  
  // Production optimizations for shared hosting
  experimental: {
    serverMinification: true,
    optimizeCss: true,
  },
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Puppeteer is external on server
      config.externals = config.externals || [];
      config.externals.push('puppeteer');
    }
    
    // Optimize for shared hosting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Image optimization settings for shared hosting
  images: {
    unoptimized: true,
  },
  
  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
