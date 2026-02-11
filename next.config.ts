import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger compatibility settings
  output: 'standalone',
  
  // Disable React Compiler for shared hosting stability
  reactCompiler: false,
  
  // Next.js 16+ configuration for Puppeteer
  serverExternalPackages: ['puppeteer'],
  
  // Turbopack configuration (Next.js 16 default for dev)
  turbopack: {
    // Set the absolute root directory to silence workspace warning
    root: process.cwd(),
    // Configure Turbopack for development
    rules: {
      // Handle any special file types if needed
    },
  },
  
  // Production optimizations for shared hosting
  experimental: {
    serverMinification: true,
    optimizeCss: true,
  },
  
  // Webpack configuration for production builds only
  webpack: (config, { isServer, dev }) => {
    // Only apply webpack config in production builds
    if (!dev) {
      if (isServer) {
        // Ensure Puppeteer is external on server
        config.externals = config.externals || [];
        config.externals.push('puppeteer');
      }
      
      // Optimize for shared hosting in production
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
    }
    
    return config;
  },
  
  // Image optimization settings for shared hosting
  images: {
    unoptimized: true,
  },
  
  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,
  
  // Ensure proper static file handling
  trailingSlash: false,
  
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
