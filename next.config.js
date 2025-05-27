/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // ✅ Allow Cloudinary images
  },
  experimental: {
    appDir: true, // ✅ Enables App Router features
  },
};

export default nextConfig;