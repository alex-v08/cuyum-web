/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cuyum-web',
  assetPrefix: '/cuyum-web',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ]
  }
}

export default nextConfig
