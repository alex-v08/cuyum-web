/** @type {import('next').NextConfig} */
// basePath solo en producción — en dev los assets se sirven desde / sin prefijo
const isProd = process.env.NODE_ENV === 'production';
const BASE_PATH = isProd ? '/cuyum-web' : '';

const nextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ]
  }
}

export default nextConfig
