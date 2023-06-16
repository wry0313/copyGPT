/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },
}

module.exports = nextConfig
