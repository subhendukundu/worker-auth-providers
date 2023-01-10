/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        runtime: 'experimental-edge', 
    },
    reactStrictMode: true, 
    wcMinify: true,
}
module.exports = nextConfig