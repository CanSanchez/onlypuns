/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'cloudinary.com', 'res.cloudinary.com', 'giphy.com', 'media.giphy.com', 'ih1.redbubble.net'],
  },
}

module.exports = nextConfig
