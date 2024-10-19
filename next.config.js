/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any necessary configurations here
  images: {
    domains: ['images.clerk.dev'],
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
