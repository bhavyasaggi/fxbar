import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    dangerouslyAllowSVG: true,
    // disableStaticImages: true,
    unoptimized: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  transpilePackages: ['@lib/*', '@fxbar/*'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      type: 'asset/resource',
    })
    return config
  },
}

export default nextConfig
